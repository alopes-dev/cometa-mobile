import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import Animated from 'react-native-reanimated';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Chip, Icon, Text, TextField } from '@/components/design-system/atoms';
import { RestaurantCard } from '@/features/home/components/RestaurantCard';
import { useEntranceAnimation } from '@/hooks/useEntranceAnimation';
import { useTabBarVisibility } from '@/hooks/useTabBarVisibility';
import { getCategories, getRestaurantById, getRestaurants, searchMenuItems } from '@/features/home/data';
import { filterRestaurants } from '@/features/home/selectors';
import { formatKwanza } from '@/features/home/format';

const RECENT_SEARCHES = ['hambúrguer', 'pizza', 'sushi'];
const MIN_QUERY_LENGTH = 2;

const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.View<{ topInset: number }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
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
`;

const Content = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.lg}px;
  padding-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const SectionLabel = styled.Text`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const ChipRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const ResultsGap = styled.View`
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const DishRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const DishThumbnail = styled(Image)`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radius.md}px;
`;

const EmptyState = styled.View`
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

export default function Search() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setIsTabBarHidden } = useTabBarVisibility();
  const [query, setQuery] = useState('');
  const inputEntranceStyle = useEntranceAnimation(0);

  useFocusEffect(
    useCallback(() => {
      setIsTabBarHidden(true);
      return () => setIsTabBarHidden(false);
    }, [setIsTabBarHidden])
  );

  const categories = useMemo(() => getCategories(), []);
  const isSearching = query.trim().length >= MIN_QUERY_LENGTH;

  const restaurantResults = useMemo(
    () => (isSearching ? filterRestaurants(getRestaurants(), { query, category: null }) : []),
    [isSearching, query]
  );
  const dishResults = useMemo(() => (isSearching ? searchMenuItems(query) : []), [isSearching, query]);

  return (
    <Screen>
      <Header topInset={insets.top}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar" hitSlop={8}>
          <BackButton>
            <Icon name="chevron-back" sf="chevron.left" size={18} color="textPrimary" />
          </BackButton>
        </Pressable>
        <Animated.View style={[{ flex: 1 }, inputEntranceStyle]}>
          <TextField
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar restaurantes ou pratos"
            accessibilityLabel="Pesquisar"
            shape="pill"
            autoFocus
            leadingIcon={{ name: 'search', sf: 'magnifyingglass' }}
          />
        </Animated.View>
      </Header>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
        <Content>
          {!isSearching ? (
            <>
              <View>
                <SectionLabel>Pesquisas recentes</SectionLabel>
                <ChipRow>
                  {RECENT_SEARCHES.map((term) => (
                    <Chip key={term} label={term} onPress={() => setQuery(term)} />
                  ))}
                </ChipRow>
              </View>
              <View>
                <SectionLabel>Sugestões</SectionLabel>
                <ChipRow>
                  {categories.map((category) => (
                    <Chip
                      key={category}
                      label={category}
                      onPress={() => router.push({ pathname: '/restaurants', params: { category } })}
                    />
                  ))}
                </ChipRow>
              </View>
            </>
          ) : restaurantResults.length === 0 && dishResults.length === 0 ? (
            <EmptyState>
              <Text color="textSecondary">Nenhum resultado encontrado</Text>
            </EmptyState>
          ) : (
            <>
              {restaurantResults.length > 0 ? (
                <View>
                  <SectionLabel>Restaurantes</SectionLabel>
                  <ResultsGap>
                    {restaurantResults.map((restaurant) => (
                      <RestaurantCard
                        key={restaurant.id}
                        restaurant={restaurant}
                        onPress={() => router.push(`/restaurant/${restaurant.id}`)}
                      />
                    ))}
                  </ResultsGap>
                </View>
              ) : null}

              {dishResults.length > 0 ? (
                <View>
                  <SectionLabel>Pratos</SectionLabel>
                  <ResultsGap>
                    {dishResults.map((dish) => {
                      const restaurant = getRestaurantById(dish.restaurantId);
                      return (
                        <Pressable
                          key={dish.id}
                          onPress={() => router.push(`/restaurant/${dish.restaurantId}`)}
                          accessibilityRole="button"
                        >
                          <DishRow>
                            <DishThumbnail source={{ uri: dish.imageUrl }} contentFit="cover" />
                            <View style={{ flex: 1 }}>
                              <Text variant="bodyEmphasized" numberOfLines={1}>
                                {dish.name}
                              </Text>
                              {restaurant ? (
                                <Text variant="footnote" color="textSecondary" numberOfLines={1}>
                                  {restaurant.name}
                                </Text>
                              ) : null}
                            </View>
                            <Text variant="footnote" color="primary">
                              {formatKwanza(dish.price)}
                            </Text>
                          </DishRow>
                        </Pressable>
                      );
                    })}
                  </ResultsGap>
                </View>
              ) : null}
            </>
          )}
        </Content>
      </ScrollView>
    </Screen>
  );
}
