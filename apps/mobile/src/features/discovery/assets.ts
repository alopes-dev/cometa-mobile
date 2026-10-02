/**
 * Every photograph the Discovery board renders, exported from Figma file
 * PAuqq5xMI0yQtx8POz4TUL (frame 48:20245) and committed under
 * `assets/discovery/`.
 *
 * Bundled rather than fetched, for the same reason as
 * `features/home/assets.ts`: the board's images *are* the design here, and a
 * placeholder service can be slow or unreachable, which leaves the feed
 * looking like it failed to load.
 *
 * Deliberately a separate set from Home's. The board casts a different
 * photograph even where the restaurant is the same — its Forno 27 (node
 * 48:20333) is not Home's (node 48:19860) — so sharing one file would quietly
 * redraw one of the two screens.
 */

/** Restaurant media, 1376x768 in a carousel slot and 1584x672 full width. */
export const restaurantPhoto = {
  /** Node 48:20293 — "Trending", first card. */
  bunLabLuanda: require('../../../assets/discovery/bun-lab-luanda.jpg'),
  /** Node 48:20303 — "Trending", second card. */
  nori244: require('../../../assets/discovery/nori-244.jpg'),
  /** Node 48:20319 — "Popular", full width. */
  forno27: require('../../../assets/discovery/forno-27.jpg'),
  /** Node 48:20333 — "New on Cometa", full width. */
  kwanzaBowl: require('../../../assets/discovery/kwanza-bowl.jpg'),
  /** Node 48:20347 — "Offers", full width. */
  doceKilamba: require('../../../assets/discovery/doce-kilamba.jpg'),
} as const;

/**
 * Node 48:20362 — the map behind the "Nearby" card.
 *
 * A still, not a live `MapView`: the card is a doorway to the map screen, and
 * spinning up the Mapbox renderer for a 180pt preview the customer scrolls
 * past costs a tile download and a GL context for no interaction. "Ver mapa"
 * is where the real map belongs.
 */
export const nearbyMapPhoto = require('../../../assets/discovery/nearby-map.jpg');
