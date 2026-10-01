import { getCategories, getMenuItemById, getMenuItems, getRestaurantById, getRestaurants, searchMenuItems } from './data';

describe('data', () => {
  it('getRestaurants returns a non-empty array of restaurants with the expected shape', () => {
    const restaurants = getRestaurants();
    expect(restaurants.length).toBeGreaterThan(0);
    for (const restaurant of restaurants) {
      expect(typeof restaurant.id).toBe('string');
      expect(typeof restaurant.name).toBe('string');
      expect(typeof restaurant.imageUrl).toBe('string');
      expect(typeof restaurant.rating).toBe('number');
      expect(typeof restaurant.cuisine).toBe('string');
      expect(typeof restaurant.deliveryTimeMinutes).toBe('number');
      expect(typeof restaurant.deliveryFee).toBe('number');
    }
  });

  it('getRestaurantById returns the matching restaurant', () => {
    const [first] = getRestaurants();
    expect(getRestaurantById(first.id)).toEqual(first);
  });

  it('getRestaurantById returns undefined for an unknown id', () => {
    expect(getRestaurantById('does-not-exist')).toBeUndefined();
  });

  it('getMenuItems returns only items belonging to the given restaurant', () => {
    const [first] = getRestaurants();
    const items = getMenuItems(first.id);
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(item.restaurantId).toBe(first.id);
    }
  });

  it('getMenuItemById returns the matching item', () => {
    const [firstRestaurant] = getRestaurants();
    const [firstItem] = getMenuItems(firstRestaurant.id);
    expect(getMenuItemById(firstItem.id)).toEqual(firstItem);
  });

  it('getMenuItemById returns undefined for an unknown id', () => {
    expect(getMenuItemById('does-not-exist')).toBeUndefined();
  });

  it('searchMenuItems matches by dish name across restaurants', () => {
    const results = searchMenuItems('burger');
    expect(results.length).toBeGreaterThan(0);
    for (const item of results) {
      expect(item.name.toLowerCase()).toContain('burger');
    }
  });

  it('searchMenuItems matches by category', () => {
    const results = searchMenuItems('sobremesas');
    expect(results.length).toBeGreaterThan(0);
    for (const item of results) {
      expect(item.category.toLowerCase()).toBe('sobremesas');
    }
  });

  it('searchMenuItems returns an empty array for a blank query', () => {
    expect(searchMenuItems('   ')).toEqual([]);
  });

  it('searchMenuItems returns an empty array when nothing matches', () => {
    expect(searchMenuItems('does-not-exist')).toEqual([]);
  });

  it('getCategories returns a deduped list of cuisines', () => {
    const categories = getCategories();
    const unique = new Set(categories);
    expect(categories.length).toBe(unique.size);
    expect(categories.length).toBeGreaterThan(0);
  });
});
