import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { FlatList, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styled from "styled-components/native";
import { Icon, Text } from "@/components/design-system/atoms";
import { CategoryChipList } from "@/features/home/components/CategoryChipList";
import { DiscoverHeader } from "@/features/home/components/DiscoverHeader";
import { OfferCard } from "@/features/home/components/OfferCard";
import { RestaurantCard } from "@/features/home/components/RestaurantCard";
import { SectionHeader } from "@/features/home/components/SectionHeader";
import { getCategories, getOffers, getRestaurants } from "@/features/home/data";
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

const SearchTrigger = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  height: 44px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius.pill}px;
  background-color: ${({ theme }) => theme.colors.surface};
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
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  const restaurants = useMemo(() => getRestaurants(), []);
  const categories = useMemo(() => getCategories(), []);
  const offers = useMemo(() => getOffers(), []);

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

  const handleSelectCategory = (category: string | null) => {
    // "Tudo" (null) stays on Home; any real category opens the dedicated listing screen.
    if (category === null) return;
    router.push({ pathname: "/restaurants", params: { category } });
  };

  return (
    <Screen>
      <FlatList
        data={restaurants}
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
              <Text variant="headline" color="primary">
                Descobrir
              </Text>
              <Pressable
                onPress={() => router.push("/search")}
                accessibilityRole="button"
                accessibilityLabel="Pesquisar"
              >
                <SearchTrigger>
                  <Icon name="search" sf="magnifyingglass" size={18} color="textSecondary" />
                  <Text variant="body" color="textSecondary">
                    Restaurantes, pratos ou cozinhas
                  </Text>
                </SearchTrigger>
              </Pressable>
            </PaddedSection>
            <CategoryChipList
              categories={categories}
              selected={null}
              onSelect={handleSelectCategory}
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
