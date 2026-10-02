import type { Restaurant } from '@/features/home/types';
import { restaurantPhoto } from './assets';
import type { SuggestedCategory } from './types';

/**
 * The four terms the board remembers (nodes 48:20101, 48:20105, 48:20109,
 * 48:20113), newest first.
 *
 * Seeds for in-memory state, not a store: nothing in the app persists yet,
 * and a recents list that outlives the session needs somewhere to live that
 * the mock data layer is not.
 */
export const mockRecentSearches: string[] = ['Hambúrguer', 'KFC', 'Pizza', 'Supermercado'];

/** What everyone else is searching (nodes 48:20120, 48:20123, 48:20126, 48:20129, 48:20132). */
export const mockPopularSearches: string[] = ['Hambúrguer', 'Pizza', 'Frango', 'Sushi', 'Farmácia'];

/**
 * "Categorias sugeridas" — node 48:20136.
 *
 * Each icon is the closest SF Symbol to the Lucide glyph the board draws,
 * with an Ionicon beside it for Android, which is the pairing `Icon` expects
 * and the mapping `home/categoryIcons.ts` already settled for these four
 * cravings.
 */
export const mockSuggestedCategories: SuggestedCategory[] = [
  {
    id: 'hamburguer',
    label: 'Hambúrguer',
    icon: { name: 'fast-food-outline', sf: 'takeoutbag.and.cup.and.straw.fill' },
  },
  { id: 'pizza', label: 'Pizza', icon: { name: 'pizza-outline', sf: 'fork.knife' } },
  { id: 'sushi', label: 'Sushi', icon: { name: 'fish-outline', sf: 'fish' } },
  { id: 'farmacia', label: 'Farmácia', icon: { name: 'medkit-outline', sf: 'cross.case.fill' } },
];

/**
 * The three merchants the board casts for "hambúrguer" (nodes 48:20196,
 * 48:20208, 48:20218), in its order.
 *
 * Two of them already exist in other catalogues under the same name — Burger
 * House on Home, Bun Lab Luanda on Discovery — and the board redraws both
 * with a different photograph here, so these records win over those when a
 * query matches both (see `data.ts`). The third, O Pão & Brasa, Search casts
 * alone.
 *
 * The delivery windows read "25–35", "20–25" and "30–40 min" on the board;
 * `formatDeliveryWindow` widens a single number by a fixed ten minutes, which
 * reproduces the first and the third exactly and renders the second as
 * "20–30". The board's own middle card is the odd one out — every other
 * window it draws, on every screen, is a ten-minute spread — so the fixed
 * spread stays and this card gains five minutes rather than the formatter
 * gaining a special case.
 */
export const mockSearchRestaurants: Restaurant[] = [
  {
    id: 's1',
    name: 'Burger House',
    imageUrl: restaurantPhoto.burgerHouse,
    rating: 4.8,
    cuisine: 'Hambúrgueres',
    deliveryTimeMinutes: 25,
    deliveryFee: 1000,
    description: 'Hambúrgueres suculentos e batatas crocantes em Talatona.',
    distanceKm: 1.2,
    neighbourhood: 'Talatona',
    hasPromotion: true,
    promotionLabel: '-20%',
  },
  {
    id: 's2',
    name: 'Bun Lab Luanda',
    imageUrl: restaurantPhoto.bunLabLuanda,
    rating: 4.7,
    cuisine: 'Smash burgers',
    deliveryTimeMinutes: 20,
    deliveryFee: 1000,
    description: 'Smash burgers prensados na chapa, no Morro Bento.',
    distanceKm: 1.5,
    neighbourhood: 'Morro Bento',
  },
  {
    id: 's3',
    name: 'O Pão & Brasa',
    imageUrl: restaurantPhoto.oPaoEBrasa,
    rating: 4.6,
    cuisine: 'Hambúrgueres',
    deliveryTimeMinutes: 30,
    deliveryFee: 1500,
    description: 'Hambúrgueres na brasa e pão do dia, no Kilamba.',
    distanceKm: 2.8,
    neighbourhood: 'Kilamba',
  },
];

/**
 * The vocabulary that finds a merchant beyond its own record, keyed by id.
 *
 * Only where the record genuinely does not contain the word. "Smash burgers"
 * is what Bun Lab sells and "hambúrguer" is what the customer types, which is
 * the one gap the board demonstrates by returning that card for that query
 * (node 48:20208); every other merchant in the catalogue is already found by
 * its name, cuisine, locality or description.
 */
export const mockSearchKeywords: Record<string, string[]> = {
  s2: ['hamburguer', 'burger', 'smash'],
  /** Discovery's record for the same merchant, which answers the same query. */
  d1: ['hamburguer', 'burger', 'smash'],
};
