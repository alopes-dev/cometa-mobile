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
