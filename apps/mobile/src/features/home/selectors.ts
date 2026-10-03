import type { MenuItem, Restaurant } from './types';

export type RestaurantFilter = {
  query: string;
  category: string | null;
};

export function filterRestaurants(restaurants: Restaurant[], filter: RestaurantFilter): Restaurant[] {
  const query = filter.query.trim().toLowerCase();
  return restaurants.filter((restaurant) => {
    const matchesCategory = !filter.category || restaurant.cuisine === filter.category;
    const matchesQuery =
      !query ||
      restaurant.name.toLowerCase().includes(query) ||
      restaurant.cuisine.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });
}

export type RestaurantSort = 'fastest' | 'topRated' | 'nearest' | 'lowestFee' | 'promotions';

export function applyRestaurantSort(restaurants: Restaurant[], sort: RestaurantSort | null): Restaurant[] {
  if (!sort) return restaurants;
  if (sort === 'promotions') {
    return restaurants.filter((restaurant) => restaurant.hasPromotion);
  }

  const sorted = [...restaurants];
  switch (sort) {
    case 'fastest':
      sorted.sort((a, b) => a.deliveryTimeMinutes - b.deliveryTimeMinutes);
      break;
    case 'topRated':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case 'nearest':
      sorted.sort((a, b) => a.distanceKm - b.distanceKm);
      break;
    case 'lowestFee':
      sorted.sort((a, b) => a.deliveryFee - b.deliveryFee);
      break;
  }
  return sorted;
}

export type MenuSection = {
  title: string;
  data: MenuItem[];
};

export function groupMenuItemsByCategory(items: MenuItem[]): MenuSection[] {
  const byCategory = new Map<string, MenuItem[]>();
  for (const item of items) {
    const existing = byCategory.get(item.category) ?? [];
    existing.push(item);
    byCategory.set(item.category, existing);
  }
  return Array.from(byCategory.entries()).map(([title, data]) => ({ title, data }));
}

export const POPULAR_SECTION_KEY = 'popular';
const POPULAR_ITEM_COUNT = 2;

export type MenuDetailSection = {
  key: string;
  title: string;
  data: MenuItem[];
};

// Popular items are cross-listed here and in their own category section below, not excluded from it.
export function buildMenuSections(items: MenuItem[]): MenuDetailSection[] {
  const sections: MenuDetailSection[] = [];
  const popular = items.slice(0, POPULAR_ITEM_COUNT);

  if (popular.length > 0) {
    sections.push({ key: POPULAR_SECTION_KEY, title: 'Mais pedidos', data: popular });
  }

  for (const { title, data } of groupMenuItemsByCategory(items)) {
    sections.push({ key: title, title, data });
  }

  return sections;
}

/**
 * Narrows the catalogue to a craving tile (node 48:19802).
 *
 * Kept separate from `filterRestaurants`'s `category`, which matches a
 * cuisine exactly. A craving like "Frango" is not a cuisine — it spans
 * "Angolana" and "Grelhados" — so it matches on keywords across the name,
 * cuisine and description instead.
 */
export function filterByCraving(restaurants: Restaurant[], keywords: string[]): Restaurant[] {
  if (keywords.length === 0) return restaurants;
  return restaurants.filter((restaurant) => {
    const haystack = `${restaurant.name} ${restaurant.cuisine} ${restaurant.description}`.toLowerCase();
    return keywords.some((keyword) => haystack.includes(keyword));
  });
}
