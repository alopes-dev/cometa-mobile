import { getSearchCatalogue } from './data';
import {
  applyQuickFilters,
  applyScope,
  foldQuery,
  HIGHLY_RATED_THRESHOLD,
  searchRestaurants,
  suggestTerms,
} from './selectors';
import type { SearchQuickFilter } from './types';

const catalogue = getSearchCatalogue();

describe('foldQuery', () => {
  it('folds case and accents, so a plain query finds an accented record', () => {
    expect(foldQuery('  Hambúrguer ')).toBe('hamburguer');
  });
});

describe('searchRestaurants', () => {
  it('returns the three merchants the board casts for "hambúrguer", in its order', () => {
    const names = searchRestaurants(catalogue, 'hambúrguer').map((restaurant) => restaurant.name);
    expect(names).toEqual(['Burger House', 'Bun Lab Luanda', 'O Pão & Brasa']);
  });

  it('finds a merchant whose own record never says the word', () => {
    // "Smash burgers" is what Bun Lab sells; "hamburguer" is what gets typed.
    const names = searchRestaurants(catalogue, 'hamburguer').map((restaurant) => restaurant.name);
    expect(names).toContain('Bun Lab Luanda');
  });

  it('searches across the feeds, not just its own cast', () => {
    const names = searchRestaurants(catalogue, 'pizza').map((restaurant) => restaurant.name);
    expect(names).toContain('Forno 27');
  });

  it('answers an empty query with nothing rather than everything', () => {
    expect(searchRestaurants(catalogue, '   ')).toEqual([]);
  });

  it('lists a merchant once when two catalogues describe it', () => {
    const names = searchRestaurants(catalogue, 'burger house').map((restaurant) => restaurant.name);
    expect(names).toEqual(['Burger House']);
  });

  it('renders the board card for a merchant two catalogues share', () => {
    const [burgerHouse] = searchRestaurants(catalogue, 'burger house');
    // Search's own record (node 48:20196), not Home's `r4`.
    expect(burgerHouse.id).toBe('s1');
  });
});

describe('applyScope', () => {
  const results = searchRestaurants(catalogue, 'hambúrguer');

  it('leaves the results alone under "Tudo" and "Restaurantes"', () => {
    expect(applyScope(results, 'all')).toEqual(results);
    expect(applyScope(results, 'restaurants')).toEqual(results);
  });

  it('keeps only what carries a promotion under "Ofertas"', () => {
    const names = applyScope(results, 'offers').map((restaurant) => restaurant.name);
    expect(names).toEqual(['Burger House']);
  });

  it('returns nothing under "Produtos", which the catalogue does not hold yet', () => {
    expect(applyScope(results, 'products')).toEqual([]);
  });
});

describe('applyQuickFilters', () => {
  const results = searchRestaurants(catalogue, 'hambúrguer');

  it('leaves the order alone when nothing is selected', () => {
    expect(applyQuickFilters(results, new Set())).toEqual(results);
  });

  it('drops anything below 4.5 stars', () => {
    const filtered = applyQuickFilters(results, new Set<SearchQuickFilter>(['highlyRated']));
    for (const restaurant of filtered) {
      expect(restaurant.rating).toBeGreaterThanOrEqual(HIGHLY_RATED_THRESHOLD);
    }
  });

  it('puts the quickest first', () => {
    const minutes = applyQuickFilters(results, new Set<SearchQuickFilter>(['fastest'])).map(
      (restaurant) => restaurant.deliveryTimeMinutes
    );
    expect(minutes).toEqual([...minutes].sort((a, b) => a - b));
  });

  it('narrows first and orders second, so both chips hold together', () => {
    const both = applyQuickFilters(
      results,
      new Set<SearchQuickFilter>(['fastest', 'highlyRated'])
    );
    for (const restaurant of both) {
      expect(restaurant.rating).toBeGreaterThanOrEqual(HIGHLY_RATED_THRESHOLD);
    }
    const minutes = both.map((restaurant) => restaurant.deliveryTimeMinutes);
    expect(minutes).toEqual([...minutes].sort((a, b) => a - b));
  });
});

describe('suggestTerms', () => {
  const terms = ['Hambúrguer', 'KFC', 'Pizza', 'Supermercado'];

  it('offers everything before anything is typed', () => {
    expect(suggestTerms(terms, '')).toEqual(terms);
  });

  it('narrows to what matches, ignoring accents', () => {
    expect(suggestTerms(terms, 'hamb')).toEqual(['Hambúrguer']);
  });

  it('drops a term that is already the query, which could not do anything', () => {
    expect(suggestTerms(terms, 'Pizza')).toEqual([]);
  });
});
