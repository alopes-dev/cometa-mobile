import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Text } from '@/components/design-system/atoms';
import { SearchBar } from '@/components/design-system/molecules';
import { CategoryChipList } from '@/features/home/components/CategoryChipList';
import { RestaurantCard } from '@/features/home/components/RestaurantCard';
import { getCategories, getRestaurants } from '@/features/home/data';
import { filterRestaurants } from '@/features/home/selectors';
import type { Restaurant } from '@/features/home/types';

const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.View<{ topInset: number }>`
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding-top: ${({ theme, topInset }) => theme.spacing.md + topInset}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
`;

const EmptyState = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const restaurants = useMemo(() => getRestaurants(), []);
  const categories = useMemo(() => getCategories(), []);

  const filteredRestaurants = useMemo(
    () => filterRestaurants(restaurants, { query: searchQuery, category: selectedCategory }),
    [restaurants, searchQuery, selectedCategory]
  );

  return (
    <Screen>
      <Header topInset={insets.top}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Buscar restaurantes" />
        <CategoryChipList categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
      </Header>
      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item: Restaurant) => item.id}
        contentContainerStyle={{ padding: 16, gap: 16 }}
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
