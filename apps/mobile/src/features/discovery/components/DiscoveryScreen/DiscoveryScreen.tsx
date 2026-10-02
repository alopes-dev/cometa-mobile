import { useCallback, useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchBar } from '@/components/design-system/molecules';
import { RestaurantCard, RESTAURANT_CARD_WIDTH } from '@/features/home/components/RestaurantCard';
import { SectionHeader } from '@/features/home/components/SectionHeader';
import type { Restaurant } from '@/features/home/types';
import { mockNotifications } from '@/features/notifications/mockData';
import { hasUnreadNotifications } from '@/features/notifications/selectors';
import { spacing } from '@/theme';
import { discovery } from '../../content';
import {
  getBroadCategories,
  getNearbyPins,
  getNewRestaurant,
  getOfferRestaurant,
  getPopularRestaurant,
  getTrendingRestaurants,
} from '../../data';
import { BroadCategoryGrid } from '../BroadCategoryGrid';
import { DiscoveryHeader } from '../DiscoveryHeader';
import { NearbyMapCard } from '../NearbyMapCard';
import { CAROUSEL_GAP, GUTTER, Gutter, Screen, Section } from './DiscoveryScreen.styles';

/**
 * Discovery — frame 48:20245, "Descobrir".
 *
 * Every section the board draws renders unconditionally and in the board's
 * order. Search and the vertical tiles are entry points, not filters:
 * narrowing the feed in place would hide sections the design always shows,
 * and the board gives searching its own screen (frame 48:20081).
 *
 * The cards are Home's `RestaurantCard` rather than a second copy — the board
 * draws the identical component in both places, down to the 250pt carousel
 * width and the 150pt media — so the two feeds cannot drift apart.
 */
export type DiscoveryScreenProps = {
  /** Opens the search screen (frame 48:20081), which is where searching happens. */
  onPressSearch?: () => void;
};

export function DiscoveryScreen({ onPressSearch = () => {} }: DiscoveryScreenProps = {}) {
  const insets = useSafeAreaInsets();

  const [favoriteIds, setFavoriteIds] = useState<ReadonlySet<string>>(() => new Set());

  const categories = getBroadCategories();
  const trending = getTrendingRestaurants();
  const popular = getPopularRestaurant();
  const newcomer = getNewRestaurant();
  const offer = getOfferRestaurant();
  const pins = getNearbyPins();
  const hasUnread = hasUnreadNotifications(mockNotifications);

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }, []);

  const renderCard = (restaurant: Restaurant, index: number, width?: number) => (
    <RestaurantCard
      key={restaurant.id}
      restaurant={restaurant}
      index={index}
      width={width}
      isFavorite={favoriteIds.has(restaurant.id)}
      onToggleFavorite={() => toggleFavorite(restaurant.id)}
      // No restaurant detail route exists yet, so there is no hero to fly into.
      enableHeroTransition={false}
      onPress={() => {}}
    />
  );

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingTop: insets.top + spacing[8],
          paddingBottom: insets.bottom + spacing[24],
          gap: spacing[24],
        }}
      >
        <Gutter>
          <DiscoveryHeader hasUnread={hasUnread} onPressNotifications={() => {}} />
        </Gutter>

        <Gutter>
          {/*
            A doorway, not a filter: the board gives searching its own screen
            (frame 48:20081), and typing here would narrow a feed whose
            sections the design always shows in full.
          */}
          <SearchBar
            value=""
            onChangeText={() => {}}
            onPress={onPressSearch}
            placeholder={discovery.searchPlaceholder}
            shape="default"
            height={52}
          />
        </Gutter>

        <Section>
          <Gutter>
            <SectionHeader title={discovery.broadCategories} />
          </Gutter>
          <Gutter>
            <BroadCategoryGrid
              categories={categories}
              horizontalInset={GUTTER}
              onSelect={() => {}}
            />
          </Gutter>
        </Section>

        <Section>
          <Gutter>
            <SectionHeader title={discovery.trending} actionLabel={discovery.seeAll} />
          </Gutter>
          {/*
            Snapping by one card step: the gutter padding shifts every card
            equally, so a stride of card + gap still lands each one on the gutter.
          */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={RESTAURANT_CARD_WIDTH + CAROUSEL_GAP}
            snapToAlignment="start"
            decelerationRate="fast"
            contentContainerStyle={{ gap: CAROUSEL_GAP, paddingHorizontal: GUTTER }}
          >
            {trending.map((restaurant, index) =>
              renderCard(restaurant, index, RESTAURANT_CARD_WIDTH)
            )}
          </ScrollView>
        </Section>

        {popular ? (
          <Section>
            <Gutter>
              <SectionHeader title={discovery.popular} actionLabel={discovery.seeAll} />
            </Gutter>
            <Gutter>{renderCard(popular, 0)}</Gutter>
          </Section>
        ) : null}

        {newcomer ? (
          <Section>
            <Gutter>
              <SectionHeader title={discovery.newOnCometa} actionLabel={discovery.seeAll} />
            </Gutter>
            <Gutter>{renderCard(newcomer, 0)}</Gutter>
          </Section>
        ) : null}

        {offer ? (
          <Section>
            <Gutter>
              <SectionHeader title={discovery.offers} actionLabel={discovery.seeAll} />
            </Gutter>
            <Gutter>{renderCard(offer, 0)}</Gutter>
          </Section>
        ) : null}

        <Section>
          <Gutter>
            <SectionHeader title={discovery.nearby} actionLabel={discovery.seeAll} />
          </Gutter>
          <Gutter>
            <NearbyMapCard pins={pins} onPress={() => {}} />
          </Gutter>
        </Section>
      </ScrollView>
    </Screen>
  );
}
