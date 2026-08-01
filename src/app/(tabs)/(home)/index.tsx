import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { Text } from '@/components/design-system/atoms';
import { SearchBar } from '@/components/design-system/molecules';
import { CategoryChipList } from '@/features/home/components/CategoryChipList';
import { RestaurantCard } from '@/features/home/components/RestaurantCard';
import { getCategories, getRestaurants } from '@/features/home/data';
import type { Restaurant } from '@/features/home/types';

const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.View`
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding-top: ${({ theme }) => theme.spacing.md}px;
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const restaurants = useMemo(() => getRestaurants(), []);
  const categories = useMemo(() => getCategories(), []);

  const filteredRestaurants = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return restaurants.filter((restaurant) => {
      const matchesCategory = !selectedCategory || restaurant.cuisine === selectedCategory;
      const matchesQuery =
        !query ||
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.cuisine.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [restaurants, searchQuery, selectedCategory]);

  return (
    <Screen>
      <Header>
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
