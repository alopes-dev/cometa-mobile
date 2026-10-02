/**
 * Corner radii.
 *
 * Pair every non-`full` radius with `border-curve: continuous` so the corner
 * reads as an iOS squircle rather than a circular arc.
 *
 * `full` is the only capsule token. It is for genuinely pill-shaped controls
 * — filter chips, count badges — not for every container; §56 treats a screen
 * of pills as overdesign.
 */
export const radius = {
  /** 4 — inline tags, the smallest visible rounding. */
  xs: 4,
  /** 8 — inputs, small buttons. */
  sm: 8,
  /** 12 — buttons, inputs, thumbnails. */
  md: 12,
  /** 16 — cards and content containers. */
  lg: 16,
  /** 20 — hero cards, bottom sheets. */
  xl: 20,
  /** 24 — large media containers. */
  xxl: 24,
  /** Capsule. */
  full: 9999,
} as const;
