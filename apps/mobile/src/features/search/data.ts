import { mockDiscoveryRestaurants } from '@/features/discovery/mockData';
import { mockRestaurants } from '@/features/home/mockData';
import {
  mockPopularSearches,
  mockRecentSearches,
  mockSearchKeywords,
  mockSearchRestaurants,
  mockSuggestedCategories,
} from './mockData';
import type { SearchEntry, SuggestedCategory } from './types';

/**
 * Everything a query can return, in the order results are rendered.
 *
 * Search is the one screen that must see the whole app: a customer typing
 * "pizza" expects Forno 27 whether it was cast on Home or on Discovery. So
 * the catalogue is the union of all three sets rather than a fourth island —
 * the opposite call to `discovery/data.ts`, and for the opposite reason. A
 * feed curates; a search must not.
 *
 * Search's own records come first and the union is deduplicated by name, so
 * where two catalogues describe the same merchant the board's search card
 * wins — which is what puts its photograph, its rating and its window on
 * screen for "hambúrguer" (nodes 48:20196, 48:20208) instead of Home's or
 * Discovery's. Name is the key rather than id because the ids are per
 * catalogue: Burger House is `s1` here and `r4` on Home.
 */
export function getSearchCatalogue(): SearchEntry[] {
  const seen = new Set<string>();
  const catalogue: SearchEntry[] = [];

  for (const restaurant of [...mockSearchRestaurants, ...mockRestaurants, ...mockDiscoveryRestaurants]) {
    if (seen.has(restaurant.name)) continue;
    seen.add(restaurant.name);
    catalogue.push({ restaurant, keywords: mockSearchKeywords[restaurant.id] ?? [] });
  }

  return catalogue;
}

/** The terms the focused screen offers before anything is typed (node 48:20095). */
export function getRecentSearches(): string[] {
  return mockRecentSearches;
}

/** Node 48:20115. */
export function getPopularSearches(): string[] {
  return mockPopularSearches;
}

/** Node 48:20136. */
export function getSuggestedCategories(): SuggestedCategory[] {
  return mockSuggestedCategories;
}
