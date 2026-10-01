import { mockMenuItems, mockOffers, mockRestaurants } from './mockData';
import type { MenuItem, Offer, Restaurant } from './types';

export function getRestaurants(): Restaurant[] {
  return mockRestaurants;
}

export function getRestaurantById(id: string): Restaurant | undefined {
  return mockRestaurants.find((restaurant) => restaurant.id === id);
}

export function getMenuItems(restaurantId: string): MenuItem[] {
  return mockMenuItems.filter((item) => item.restaurantId === restaurantId);
}

export function getMenuItemById(id: string): MenuItem | undefined {
  return mockMenuItems.find((item) => item.id === id);
}

export function searchMenuItems(query: string): MenuItem[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  return mockMenuItems.filter(
    (item) => item.name.toLowerCase().includes(normalized) || item.category.toLowerCase().includes(normalized)
  );
}

export function getCategories(): string[] {
  return Array.from(new Set(mockRestaurants.map((restaurant) => restaurant.cuisine)));
}

export function getOffers(): Offer[] {
  return mockOffers;
}
