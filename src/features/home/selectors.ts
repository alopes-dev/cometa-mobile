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
  icon?: string;
  data: MenuItem[];
};

// Popular items are cross-listed here and in their own category section below, not excluded from it.
export function buildMenuSections(items: MenuItem[]): MenuDetailSection[] {
  const sections: MenuDetailSection[] = [];
  const popular = items.slice(0, POPULAR_ITEM_COUNT);

  if (popular.length > 0) {
    sections.push({ key: POPULAR_SECTION_KEY, title: 'Populares agora', icon: '🔥', data: popular });
  }

  for (const { title, data } of groupMenuItemsByCategory(items)) {
    sections.push({ key: title, title, data });
  }

  return sections;
}
