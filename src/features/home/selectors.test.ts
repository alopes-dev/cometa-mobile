import { filterRestaurants, groupMenuItemsByCategory } from './selectors';
import type { MenuItem, Restaurant } from './types';

function makeRestaurant(overrides: Partial<Restaurant>): Restaurant {
  return {
    id: 'r1',
    name: 'Pizza Place',
    imageUrl: 'https://example.com/pizza.jpg',
    rating: 4.5,
    cuisine: 'Italiana',
    deliveryTimeMinutes: 30,
    deliveryFee: 500,
    ...overrides,
  };
}

function makeMenuItem(overrides: Partial<MenuItem>): MenuItem {
  return {
    id: 'm1',
    restaurantId: 'r1',
    name: 'Margherita',
    description: 'Tomate, mozzarella e manjericão',
    price: 3500,
    imageUrl: 'https://example.com/margherita.jpg',
    category: 'Pizzas',
    ...overrides,
  };
}

describe('filterRestaurants', () => {
  const restaurants: Restaurant[] = [
    makeRestaurant({ id: '1', name: 'Pizza Place', cuisine: 'Italiana' }),
    makeRestaurant({ id: '2', name: 'Sushi House', cuisine: 'Japonesa' }),
    makeRestaurant({ id: '3', name: 'Taco Town', cuisine: 'Mexicana' }),
  ];

  it('returns all restaurants when no filter is applied', () => {
    expect(filterRestaurants(restaurants, { query: '', category: null })).toEqual(restaurants);
  });

  it('narrows to an exact cuisine match when a category filter is set', () => {
    const result = filterRestaurants(restaurants, { query: '', category: 'Japonesa' });
    expect(result).toEqual([restaurants[1]]);
  });

  it('matches by name case-insensitively', () => {
    const result = filterRestaurants(restaurants, { query: 'pizza', category: null });
    expect(result).toEqual([restaurants[0]]);
  });

  it('matches by cuisine case-insensitively', () => {
    const result = filterRestaurants(restaurants, { query: 'MEXICANA', category: null });
    expect(result).toEqual([restaurants[2]]);
  });

  it('combines category and query filters', () => {
    const result = filterRestaurants(restaurants, { query: 'sushi', category: 'Japonesa' });
    expect(result).toEqual([restaurants[1]]);

    const noMatch = filterRestaurants(restaurants, { query: 'sushi', category: 'Mexicana' });
    expect(noMatch).toEqual([]);
  });

  it('returns an empty array when nothing matches', () => {
    const result = filterRestaurants(restaurants, { query: 'burger', category: null });
    expect(result).toEqual([]);
  });
});

describe('groupMenuItemsByCategory', () => {
  it('groups items under their category preserving first-seen category order', () => {
    const items: MenuItem[] = [
      makeMenuItem({ id: '1', name: 'Margherita', category: 'Pizzas' }),
      makeMenuItem({ id: '2', name: 'Coca-Cola', category: 'Bebidas' }),
      makeMenuItem({ id: '3', name: 'Pepperoni', category: 'Pizzas' }),
      makeMenuItem({ id: '4', name: 'Água', category: 'Bebidas' }),
    ];

    const sections = groupMenuItemsByCategory(items);

    expect(sections.map((section) => section.title)).toEqual(['Pizzas', 'Bebidas']);
    expect(sections[0].data.map((item) => item.id)).toEqual(['1', '3']);
    expect(sections[1].data.map((item) => item.id)).toEqual(['2', '4']);
  });

  it('returns an empty array for empty input', () => {
    expect(groupMenuItemsByCategory([])).toEqual([]);
  });

  it('groups a single category with multiple items into one section', () => {
    const items: MenuItem[] = [
      makeMenuItem({ id: '1', category: 'Sobremesas' }),
      makeMenuItem({ id: '2', category: 'Sobremesas' }),
      makeMenuItem({ id: '3', category: 'Sobremesas' }),
    ];

    const sections = groupMenuItemsByCategory(items);

    expect(sections).toHaveLength(1);
    expect(sections[0].title).toBe('Sobremesas');
    expect(sections[0].data).toHaveLength(3);
  });
});
