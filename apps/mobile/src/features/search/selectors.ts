import { applyRestaurantSort } from '@/features/home/selectors';
import type { Restaurant } from '@/features/home/types';
import type { SearchEntry, SearchQuickFilter, SearchScope } from './types';

/**
 * How long the screen waits before answering a keystroke — node 48:20154,
 * "sugestões aparecem em 150 ms".
 *
 * Long enough that a fast typist is not re-filtering the catalogue on every
 * character, short enough that the list feels like it is keeping up.
 */
export const SEARCH_DEBOUNCE_MS = 150;

/** The threshold behind the "4.5+" chip (node 48:20192). */
export const HIGHLY_RATED_THRESHOLD = 4.5;

/**
 * Lowercases and strips accents, so "hamburguer" finds "Hambúrgueres" and
 * "Hambúrguer" finds a keyword written plain.
 *
 * Guarded rather than assumed: `normalize` is ECMAScript, not `Intl`, but
 * this codebase has already been bitten by a Hermes build without the latter
 * (see `home/format.ts`), and falling back to the unfolded string degrades
 * accent-insensitivity instead of throwing mid-keystroke.
 */
export function foldQuery(value: string): string {
  const lowered = value.trim().toLowerCase();
  return typeof lowered.normalize === 'function'
    ? lowered.normalize('NFD').replace(/[̀-ͯ]/g, '')
    : lowered;
}

function haystack(entry: SearchEntry): string {
  const { restaurant, keywords } = entry;
  return foldQuery(
    [
      restaurant.name,
      restaurant.cuisine,
      restaurant.neighbourhood ?? '',
      restaurant.description,
      ...keywords,
    ].join(' ')
  );
}

/**
 * The merchants a query returns, in catalogue order.
 *
 * Order is the catalogue's, not a relevance score: the board draws its three
 * burger places in a fixed sequence (nodes 48:20196, 48:20208, 48:20218) and
 * every one of them carries a rating within 0,2 of the others, so a score
 * would reorder them on noise. The quick filters below are where a customer
 * says what "best" means.
 */
export function searchRestaurants(catalogue: SearchEntry[], query: string): Restaurant[] {
  const needle = foldQuery(query);
  if (!needle) return [];
  return catalogue.filter((entry) => haystack(entry).includes(needle)).map((entry) => entry.restaurant);
}

/**
 * Narrows results to a scope tab (node 48:20176).
 *
 * `products` returns nothing today: the catalogue holds merchants, and the
 * board draws no card for a dish, so inventing one would put UI on screen the
 * design never specified. The empty state says so rather than the tab lying.
 */
export function applyScope(restaurants: Restaurant[], scope: SearchScope): Restaurant[] {
  switch (scope) {
    case 'all':
    case 'restaurants':
      return restaurants;
    case 'offers':
      return restaurants.filter((restaurant) => restaurant.hasPromotion);
    case 'products':
      return [];
  }
}

/**
 * Applies the quick filters (node 48:20185), which combine: "Mais rápidos"
 * orders what "4.5+" has already narrowed.
 */
export function applyQuickFilters(
  restaurants: Restaurant[],
  filters: ReadonlySet<SearchQuickFilter>
): Restaurant[] {
  const narrowed = filters.has('highlyRated')
    ? restaurants.filter((restaurant) => restaurant.rating >= HIGHLY_RATED_THRESHOLD)
    : restaurants;
  return filters.has('fastest') ? applyRestaurantSort(narrowed, 'fastest') : narrowed;
}

/**
 * The terms a half-typed query suggests, out of the ones the screen already
 * knows — what node 48:20154 promises appears "em 150 ms".
 *
 * A term that *is* the query is dropped: offering "Pizza" to someone who has
 * typed "Pizza" is a row that cannot do anything for them.
 */
export function suggestTerms(terms: string[], query: string): string[] {
  const needle = foldQuery(query);
  if (!needle) return terms;
  return terms.filter((term) => {
    const folded = foldQuery(term);
    return folded !== needle && folded.includes(needle);
  });
}
