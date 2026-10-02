/**
 * Every static asset the onboarding renders, exported from Figma file
 * PAuqq5xMI0yQtx8POz4TUL and committed under `assets/onboarding/`.
 *
 * The requires live in this one module so the relative hop out of `src/` is
 * written once, and so a missing export fails at build time rather than at the
 * callsite that needed the image.
 *
 * The icons are stroke-only Lucide SVGs with the design's colour baked in.
 * Callsites that need a different state colour pass `tintColor` to `Image`
 * rather than swapping the file — the asset itself is used exactly as exported.
 */

/** Board "01 · Onboarding" — the splash wordmark's two marks (nodes 45:30, 45:31). */
export const brandMark = {
  /** 34.56 x 34.56, `#1BAC4B`. */
  plate: require('../../../assets/onboarding/brand/logo-plate.svg'),
  /** 10.56 x 10.56, `#FF981F`. */
  food: require('../../../assets/onboarding/brand/logo-food.svg'),
} as const;

/** Board "01 · Onboarding" — the photograph and the three value illustrations. */
export const illustration = {
  /** Node 45:41 — full-bleed, 768 x 1376. */
  welcomePizza: require('../../../assets/onboarding/illustrations/welcome-pizza.png'),
  /** Node 45:60 — 928 x 1152. */
  orderForFood: require('../../../assets/onboarding/illustrations/order-for-food.png'),
  /** Node 45:78 — 928 x 1152. */
  easyPayment: require('../../../assets/onboarding/illustrations/easy-payment.png'),
  /** Node 45:96 — 928 x 1152. */
  fastDelivery: require('../../../assets/onboarding/illustrations/fast-delivery.png'),
} as const;

/**
 * Board "10 — Onboarding" — Lucide icons at their design sizes.
 *
 * Sizes are intrinsic to each file and match the slot it fills in the design,
 * so they are rendered at their natural dimensions rather than stretched.
 */
export const icon = {
  /** 38 x 38 — node 44:23947. */
  mapPin: require('../../../assets/onboarding/icons/map-pin.svg'),
  /** 38 x 38 — node 44:23962. */
  locateFixed: require('../../../assets/onboarding/icons/locate-fixed.svg'),
  /** 38 x 38 — node 44:23986. */
  bellRing: require('../../../assets/onboarding/icons/bell-ring.svg'),
  /** 19 x 19 — node 44:23950, inside the primary action. */
  navigation: require('../../../assets/onboarding/icons/navigation.svg'),
  /** 20 x 20 — node 44:23974. */
  arrowLeft: require('../../../assets/onboarding/icons/arrow-left.svg'),
} as const;

/** Board "10 — Onboarding" — the eight category icons, 22 x 22 each. */
export const categoryIcon = {
  sandwich: require('../../../assets/onboarding/icons/sandwich.svg'),
  pizza: require('../../../assets/onboarding/icons/pizza.svg'),
  beef: require('../../../assets/onboarding/icons/beef.svg'),
  shoppingBasket: require('../../../assets/onboarding/icons/shopping-basket.svg'),
  pill: require('../../../assets/onboarding/icons/pill.svg'),
  cupSoda: require('../../../assets/onboarding/icons/cup-soda.svg'),
  cakeSlice: require('../../../assets/onboarding/icons/cake-slice.svg'),
  salad: require('../../../assets/onboarding/icons/salad.svg'),
} as const;

export type CategoryIconName = keyof typeof categoryIcon;
