import { mockMenuItems, mockRestaurants } from './mockData';
import type { MenuItem, Restaurant } from './types';

export function getRestaurants(): Restaurant[] {
  return mockRestaurants;
}

export function getRestaurantById(id: string): Restaurant | undefined {
  return mockRestaurants.find((restaurant) => restaurant.id === id);
}

export function getMenuItems(restaurantId: string): MenuItem[] {
  return mockMenuItems.filter((item) => item.restaurantId === restaurantId);
}

export function getCategories(): string[] {
  return Array.from(new Set(mockRestaurants.map((restaurant) => restaurant.cuisine)));
}
