import {
  getCategories,
  getForYouRestaurants,
  getHomeCategories,
  getLastOrder,
  getMenuItemById,
  getMenuItems,
  getNearestRestaurant,
  getPopularNearbyRestaurants,
  getPromotions,
  getRestaurantById,
  getRestaurants,
  searchMenuItems,
} from './data';

describe('data', () => {
  it('getRestaurants returns a non-empty array of restaurants with the expected shape', () => {
    const restaurants = getRestaurants();
    expect(restaurants.length).toBeGreaterThan(0);
    for (const restaurant of restaurants) {
      expect(typeof restaurant.id).toBe('string');
      expect(typeof restaurant.name).toBe('string');
      // Board photography is bundled, so this is a module ref, not a URL.
      expect(restaurant.imageUrl).toBeDefined();
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

// The Home board casts each section explicitly (frame 48:19762). These pin the
// cast, because deriving it by rating or distance is what previously put
// restaurants on Home that the design never shows.
describe('home sections', () => {
  it('casts "Para ti" as the board does', () => {
    expect(getForYouRestaurants().map((r) => r.name)).toEqual(['Burger House', 'Sabores da Banda']);
  });

  it('casts "Popular perto de ti" as the board does', () => {
    expect(getPopularNearbyRestaurants().map((r) => r.name)).toEqual(['Forno 27', 'Brasa do Sul']);
  });

  it('casts "Perto de ti" and "Pedir novamente" as the board does', () => {
    expect(getNearestRestaurant()?.name).toBe('Cantinho da Kianda');
    expect(getLastOrder()?.restaurant.name).toBe('Frango & Companhia');
    expect(getLastOrder()?.total).toBe(12000);
  });

  it('gives the board its two banners, one per tone', () => {
    expect(getPromotions().map((p) => [p.title, p.tone])).toEqual([
      ['20% no almoço', 'featured'],
      ['Combos desde 7.500 Kz', 'limited'],
    ]);
  });

  it('gives the board its four cravings', () => {
    expect(getHomeCategories().map((c) => c.label)).toEqual(['Hambúrguer', 'Pizza', 'Frango', 'Sushi']);
  });
});
