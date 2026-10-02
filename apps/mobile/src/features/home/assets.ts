/**
 * Every photograph the Home board renders, exported from Figma file
 * PAuqq5xMI0yQtx8POz4TUL (frame 48:19762) and committed under `assets/home/`.
 *
 * Bundled rather than fetched: the board's images *are* the design here, and
 * a placeholder service can be slow or unreachable, which leaves the feed
 * looking like it failed to load. Follows the same shape as
 * `features/onboarding/assets.ts` so the hop out of `src/` is written once.
 */

/** Restaurant media, 1376x768 in a carousel slot and 1584x672 full width. */
export const restaurantPhoto = {
  /** Node 48:19833 — "Para ti", first card. */
  burgerHouse: require('../../../assets/home/burger-house.jpg'),
  /** Node 48:19845 — "Para ti", second card; reused for Brasa do Sul (48:19870). */
  saboresDaBanda: require('../../../assets/home/sabores-da-banda.jpg'),
  /** Node 48:19860 — "Popular perto de ti", first card. */
  forno27: require('../../../assets/home/forno-27.jpg'),
  /** Node 48:19898 — "Perto de ti", full width. */
  cantinhoDaKianda: require('../../../assets/home/cantinho-da-kianda.jpg'),
  /** Node 48:19912 — "Pedir novamente", full width. */
  frangoECompanhia: require('../../../assets/home/frango-e-companhia.jpg'),
} as const;

/** Node 48:19787 — the 52px thumbnail on the in-flight order card. */
export const activeOrderPhoto = require('../../../assets/home/order-burger-house.jpg');

/**
 * Nodes 48:19825 and 48:19891 — the 112px cut-out beside a banner's message.
 * One file: the board uses the same artwork in both banners.
 */
export const promotionPhoto = require('../../../assets/home/promo-combo.png');
