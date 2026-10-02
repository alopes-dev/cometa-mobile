import type { Restaurant } from '@/features/home/types';
import { mockBroadCategories, mockDiscoveryRestaurants, mockNearbyPins } from './mockData';
import type { BroadCategory, NearbyPin } from './types';

export function getBroadCategories(): BroadCategory[] {
  return mockBroadCategories;
}

export function getRestaurantById(id: string): Restaurant | undefined {
  return mockDiscoveryRestaurants.find((restaurant) => restaurant.id === id);
}

/**
 * Which restaurants each feed section shows, exactly as the board casts them
 * (nodes 48:20290, 48:20317, 48:20331, 48:20345).
 *
 * An explicit cast rather than a sort over the catalogue, for the reason
 * `home/data.ts` gives: the board curates these rows, and deriving them from
 * rating or distance puts restaurants in them the design never shows. Here it
 * matters more than on Home — every card carries the same 4,8 and the same
 * 25–35 min, so any sort would order them arbitrarily.
 */
const SECTION_CASTING = {
  trending: ['d1', 'd2'],
  popular: 'd3',
  newOnKometa: 'd4',
  offers: 'd5',
} as const;

function byIds(ids: readonly string[]): Restaurant[] {
  return ids.flatMap((id) => {
    const restaurant = getRestaurantById(id);
    return restaurant ? [restaurant] : [];
  });
}

/** "Trending" (node 48:20290) — a carousel. */
export function getTrendingRestaurants(): Restaurant[] {
  return byIds(SECTION_CASTING.trending);
}

/** "Popular" (node 48:20317) — one full-width card. */
export function getPopularRestaurant(): Restaurant | undefined {
  return getRestaurantById(SECTION_CASTING.popular);
}

/** "New on Kometa" (node 48:20331) — one full-width card. */
export function getNewRestaurant(): Restaurant | undefined {
  return getRestaurantById(SECTION_CASTING.newOnKometa);
}

/** "Offers" (node 48:20345) — one full-width card, carrying its discount. */
export function getOfferRestaurant(): Restaurant | undefined {
  return getRestaurantById(SECTION_CASTING.offers);
}

/** "Nearby" (node 48:20361) — the merchants marked on the map preview. */
export function getNearbyPins(): NearbyPin[] {
  return mockNearbyPins;
}
