/**
 * The photographs the Search board renders, exported from Figma file
 * PAuqq5xMI0yQtx8POz4TUL (frame 48:20156) and committed under
 * `assets/search/`.
 *
 * A set of its own, for the reason `features/discovery/assets.ts` gives: the
 * board casts a different photograph even where the merchant is the same —
 * its Burger House (node 48:20198) is not Home's (node 48:19833), and its Bun
 * Lab Luanda (node 48:20210) is not Discovery's (node 48:20293) — so sharing
 * one file would quietly redraw one of the three screens.
 */

/** Restaurant media, 1584x672 full width. */
export const restaurantPhoto = {
  /** Node 48:20198 — first result. */
  burgerHouse: require('../../../assets/search/burger-house.jpg'),
  /** Node 48:20210 — second result. */
  bunLabLuanda: require('../../../assets/search/bun-lab-luanda.jpg'),
  /** Node 48:20220 — third result. */
  oPaoEBrasa: require('../../../assets/search/o-pao-e-brasa.jpg'),
} as const;
