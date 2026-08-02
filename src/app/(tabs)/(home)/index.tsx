import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { FlatList, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styled from "styled-components/native";
import { Text } from "@/components/design-system/atoms";
import { SearchBar } from "@/components/design-system/molecules";
import { CategoryChipList } from "@/features/home/components/CategoryChipList";
import { DiscoverHeader } from "@/features/home/components/DiscoverHeader";
import { OfferCard } from "@/features/home/components/OfferCard";
import { RestaurantCard } from "@/features/home/components/RestaurantCard";
import { SectionHeader } from "@/features/home/components/SectionHeader";
import { getCategories, getOffers, getRestaurants } from "@/features/home/data";
import { filterRestaurants } from "@/features/home/selectors";
import type { Restaurant } from "@/features/home/types";

const MOCK_AVATAR_URL =
  "https://loremflickr.com/200/200/portrait,woman?lock=999";
const MOCK_ADDRESS = "Luanda, Talatona";

const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ListHeader = styled.View<{ topInset: number }>`
  gap: ${({ theme }) => theme.spacing.md}px;
  padding-top: ${({ theme, topInset }) => theme.spacing.md + topInset}px;
  padding-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const PaddedSection = styled.View`
  gap: ${({ theme }) => theme.spacing.md}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
`;

const OffersSection = styled.View`
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const RecommendedHeader = styled.View`
  padding-bottom: ${({ theme }) => theme.spacing.sm}px;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  const restaurants = useMemo(() => getRestaurants(), []);
  const categories = useMemo(() => getCategories(), []);
  const offers = useMemo(() => getOffers(), []);

  const filteredRestaurants = useMemo(
    () =>
      filterRestaurants(restaurants, {
        query: searchQuery,
        category: selectedCategory,
      }),
    [restaurants, searchQuery, selectedCategory],
  );

  const toggleFavorite = (id: string) => {
    setFavoriteIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <Screen>
      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item: Restaurant) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16,
          gap: 16,
        }}
        ListHeaderComponent={
          <ListHeader topInset={insets.top}>
            <PaddedSection>
              <DiscoverHeader
                avatarUrl={MOCK_AVATAR_URL}
                address={MOCK_ADDRESS}
              />
              <Text variant="headline" color="brandAccent">
                Descobrir
              </Text>
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Restaurantes, pratos ou cozinhas"
                backgroundColor="brandChipBackground"
              />
            </PaddedSection>
            <CategoryChipList
              categories={categories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
            <OffersSection>
              <SectionHeader
                title="Ofertas Especiais"
                actionLabel="Ver todas"
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}
              >
                {offers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </ScrollView>
            </OffersSection>
            <RecommendedHeader>
              <SectionHeader title="Recomendados para Si" />
            </RecommendedHeader>
          </ListHeader>
        }
        renderItem={({ item }) => (
          <RestaurantCard
            restaurant={item}
            onPress={() => router.push(`/restaurant/${item.id}`)}
            isFavorite={favoriteIds.has(item.id)}
            onToggleFavorite={() => toggleFavorite(item.id)}
          />
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
