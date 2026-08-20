import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { FlatList, Pressable, ScrollView } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styled from "styled-components/native";
import { Icon, Text } from "@/components/design-system/atoms";
import { useEntranceAnimation } from "@/hooks/useEntranceAnimation";
import { usePressScale } from "@/hooks/usePressScale";
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

// Home's entrance cascade: header block → categories → offers → restaurant
// cards, each starting a beat after the previous (§5 of the motion spec).
const HEADER_STACK_DELAY_MS = 0;
const CATEGORIES_DELAY_MS = 90;
const OFFERS_DELAY_MS = 160;
const HEADER_ENTRANCE_DELAY_MS = 230;

const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ListHeader = styled.View<{ topInset: number }>`
  gap: ${({ theme }) => theme.spacing.md}px;
  padding-top: ${({ theme, topInset }) => theme.spacing.md + topInset}px;
  padding-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const HeaderStack = styled.View`
  gap: ${({ theme }) => theme.spacing.md}px;
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

  const headerEntranceStyle = useEntranceAnimation(HEADER_STACK_DELAY_MS);
  const categoriesEntranceStyle = useEntranceAnimation(CATEGORIES_DELAY_MS);
  const offersEntranceStyle = useEntranceAnimation(OFFERS_DELAY_MS);
  const { style: searchPressStyle, onPressIn: onSearchPressIn, onPressOut: onSearchPressOut } = usePressScale(0.98);

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
            <Animated.View style={headerEntranceStyle}>
              <HeaderStack>
                <DiscoverHeader
                  avatarUrl={MOCK_AVATAR_URL}
                  address={MOCK_ADDRESS}
                  onPressNotifications={() => router.push("/notifications")}
                />
                <Text variant="headline" color="primary">
                  Descobrir
                </Text>
                <Pressable
                  onPress={() => router.push("/search")}
                  onPressIn={onSearchPressIn}
                  onPressOut={onSearchPressOut}
                  accessibilityRole="button"
                  accessibilityLabel="Pesquisar"
                >
                  <Animated.View style={searchPressStyle}>
                    <SearchTrigger>
                      <Icon name="search" sf="magnifyingglass" size={18} color="textSecondary" />
                      <Text variant="body" color="textSecondary">
                        O que você quer comer?
                      </Text>
                    </SearchTrigger>
                  </Animated.View>
                </Pressable>
              </HeaderStack>
            </Animated.View>
            <Animated.View style={categoriesEntranceStyle}>
              <CategoryChipList
                categories={categories}
                selected={null}
                onSelect={handleSelectCategory}
              />
            </Animated.View>
            <Animated.View style={offersEntranceStyle}>
              <OffersSection>
                <SectionHeader
                  title="Ofertas Especiais"
                  actionLabel="Ver todas"
                  onPressAction={() => router.push("/offers")}
                />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 12 }}
                >
                  {offers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} />
                  ))}
                </ScrollView>
              </OffersSection>
              <RecommendedHeader>
                <SectionHeader title="Recomendados para Si" />
              </RecommendedHeader>
            </Animated.View>
          </ListHeader>
        }
        renderItem={({ item, index }) => (
          <RestaurantCard
            restaurant={item}
            onPress={() => router.push(`/restaurant/${item.id}`)}
            isFavorite={favoriteIds.has(item.id)}
            onToggleFavorite={() => toggleFavorite(item.id)}
            index={index}
            entranceDelayMs={HEADER_ENTRANCE_DELAY_MS}
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
