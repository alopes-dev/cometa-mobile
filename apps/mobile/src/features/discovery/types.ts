import type { IconProps } from '@/components/design-system/atoms';

/**
 * One tile in "Comida e compras" (node 48:20268).
 *
 * Broader than Home's `HomeCategory`, which is a craving inside the food
 * catalogue: these are the verticals Kometa delivers at all — food, groceries,
 * pharmacy — so a tile names a destination rather than a filter over the feed.
 *
 * The icon travels with the category rather than being guessed from the label,
 * the way `home/categoryIcons.ts` does: there are six fixed tiles here and a
 * keyword table would be indirection with nothing to resolve.
 */
export type BroadCategory = {
  id: string;
  label: string;
  icon: { name: IconProps['name']; sf: IconProps['sf'] };
};

/**
 * A merchant marker on the "Nearby" preview (node 48:20363).
 *
 * Positioned in fractions of the card rather than in points. The board places
 * the three pins at fixed offsets inside a 390x180 card, which is exactly the
 * width it never has on a real device; fractions keep the composition the
 * board drew on every screen size.
 */
export type NearbyPin = {
  id: string;
  /** 0 at the card's left edge, 1 at its right. */
  x: number;
  /** 0 at the card's top edge, 1 at its bottom. */
  y: number;
};
