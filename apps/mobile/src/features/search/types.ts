import type { IconProps } from '@/components/design-system/atoms';
import type { Restaurant } from '@/features/home/types';

/**
 * A merchant in the search catalogue, with the terms that find it.
 *
 * The keywords exist because a query is not a field: the board returns Bun
 * Lab Luanda for "hambúrguer" (node 48:20208) although neither its name nor
 * its cuisine — "Smash burgers" — contains the word. Matching on the record
 * alone would drop it, so each entry carries the vocabulary a customer
 * actually types, the way `HomeCategory.keywords` does for a craving.
 */
export type SearchEntry = {
  restaurant: Restaurant;
  /** Lowercase, already normalised. */
  keywords: string[];
};

/**
 * The four tabs above the results (node 48:20176).
 *
 * A scope, not a sort: it says what kind of thing the query is looking for.
 */
export type SearchScope = 'all' | 'restaurants' | 'products' | 'offers';

/**
 * The toggles below the tabs (node 48:20185), excluding "Filtros" itself —
 * that one opens a sheet the board does not draw.
 */
export type SearchQuickFilter = 'fastest' | 'highlyRated';

/** One tile in "Categorias sugeridas" (node 48:20137). */
export type SuggestedCategory = {
  id: string;
  label: string;
  icon: { name: IconProps['name']; sf: IconProps['sf'] };
};
