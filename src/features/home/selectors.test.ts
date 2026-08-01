import { buildMenuSections, filterRestaurants, groupMenuItemsByCategory } from './selectors';
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
    description: 'The best pizza in town.',
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

describe('buildMenuSections', () => {
  it('cross-lists the first two items as a "Populares agora" section ahead of the category sections', () => {
    const items: MenuItem[] = [
      makeMenuItem({ id: '1', name: 'Margherita', category: 'Pizzas' }),
      makeMenuItem({ id: '2', name: 'Pepperoni', category: 'Pizzas' }),
      makeMenuItem({ id: '3', name: 'Coca-Cola', category: 'Bebidas' }),
    ];

    const sections = buildMenuSections(items);

    expect(sections.map((section) => section.key)).toEqual(['popular', 'Pizzas', 'Bebidas']);
    expect(sections[0].title).toBe('Populares agora');
    expect(sections[0].icon).toBe('🔥');
    expect(sections[0].layout).toBe('list');
    expect(sections[0].data.map((item) => item.id)).toEqual(['1', '2']);
    expect(sections[1].data.map((item) => item.id)).toEqual(['1', '2']);
    expect(sections[2].data.map((item) => item.id)).toEqual(['3']);
  });

  it('renders the "Entradas" category as a grid section and every other section as a list', () => {
    const items: MenuItem[] = [
      makeMenuItem({ id: '1', category: 'Pizzas' }),
      makeMenuItem({ id: '2', category: 'Entradas' }),
      makeMenuItem({ id: '3', category: 'Bebidas' }),
    ];

    const sections = buildMenuSections(items);
    const byKey = Object.fromEntries(sections.map((section) => [section.key, section.layout]));

    expect(byKey).toEqual({ popular: 'list', Pizzas: 'list', Entradas: 'grid', Bebidas: 'list' });
  });

  it('caps the popular section at two items even with a larger menu', () => {
    const items: MenuItem[] = [
      makeMenuItem({ id: '1', category: 'Pizzas' }),
      makeMenuItem({ id: '2', category: 'Pizzas' }),
      makeMenuItem({ id: '3', category: 'Pizzas' }),
    ];

    const sections = buildMenuSections(items);

    expect(sections[0].data.map((item) => item.id)).toEqual(['1', '2']);
  });

  it('still includes the popular section for a single-item menu', () => {
    const items: MenuItem[] = [makeMenuItem({ id: '1', category: 'Bebidas' })];

    const sections = buildMenuSections(items);

    expect(sections.map((section) => section.key)).toEqual(['popular', 'Bebidas']);
    expect(sections[0].data.map((item) => item.id)).toEqual(['1']);
  });

  it('returns an empty array for empty input', () => {
    expect(buildMenuSections([])).toEqual([]);
  });
});
