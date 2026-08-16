import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Icon, Text } from '@/components/design-system/atoms';
import { RestaurantCard } from '@/features/home/components/RestaurantCard';
import { RestaurantListFilterBar } from '@/features/home/components/RestaurantListFilterBar';
import { useTabBarVisibility } from '@/hooks/useTabBarVisibility';
import { getRestaurants } from '@/features/home/data';
import { applyRestaurantSort, filterRestaurants, type RestaurantSort } from '@/features/home/selectors';
import type { Restaurant } from '@/features/home/types';

const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.View<{ topInset: number }>`
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding-top: ${({ theme, topInset }) => theme.spacing.md + topInset}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const BackButton = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.surface};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const ListHeader = styled.View`
  gap: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const EmptyState = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

export default function RestaurantListing() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setIsTabBarHidden } = useTabBarVisibility();
  const { category, q } = useLocalSearchParams<{ category?: string; q?: string }>();
  const [sort, setSort] = useState<RestaurantSort | null>(null);

  useFocusEffect(
    useCallback(() => {
      setIsTabBarHidden(true);
      return () => setIsTabBarHidden(false);
    }, [setIsTabBarHidden])
  );

  const baseResults = useMemo(
    () => filterRestaurants(getRestaurants(), { query: q ?? '', category: category ?? null }),
    [category, q]
  );
  const results = useMemo(() => applyRestaurantSort(baseResults, sort), [baseResults, sort]);

  return (
    <Screen>
      <Header topInset={insets.top}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar" hitSlop={8}>
          <BackButton>
            <Icon name="chevron-back" sf="chevron.left" size={18} color="textPrimary" />
          </BackButton>
        </Pressable>
        <Text variant="headline">{category ?? 'Resultados'}</Text>
        <Text variant="footnote" color="textSecondary">
          {results.length} {results.length === 1 ? 'restaurante encontrado' : 'restaurantes encontrados'}
        </Text>
      </Header>
      <FlatList
        data={results}
        keyExtractor={(item: Restaurant) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, gap: 16 }}
        ListHeaderComponent={
          <ListHeader>
            <RestaurantListFilterBar selected={sort} onSelect={setSort} />
          </ListHeader>
        }
        renderItem={({ item }) => (
          <RestaurantCard restaurant={item} onPress={() => router.push(`/restaurant/${item.id}`)} />
        )}
        ListEmptyComponent={
          <EmptyState>
            <Text color="textSecondary">Nenhum restaurante encontrado</Text>
          </EmptyState>
        }
      />
    </Screen>
  );
}
