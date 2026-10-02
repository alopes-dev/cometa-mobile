/**
 * Spacing — a 4-point grid.
 *
 * Keyed by its own pixel value rather than by t-shirt size, deliberately.
 * The previous scale had no step for 12 or 20, which is why style files
 * accumulated bare `12px` / `20px` literals; inserting those steps into a
 * named scale would have shifted what `sm` and `md` meant and silently
 * re-spaced every screen that used them. Numeric keys cannot drift: a step
 * either exists at the value it is named after, or it is a compile error.
 *
 * Rhythm conventions:
 *   4   icon-to-label, tight inline gaps
 *   8   label to control, chip internals
 *   12  list row internals
 *   16  screen edge padding, default gap between elements
 *   24  between sibling sections
 *   32  between major sections
 *   48  above a terminal CTA, around empty states
 */
export const spacing = {
  0: 0,
  /**
   * Sub-grid. 2 and 6 exist for tight text stacks (a label directly above its
   * value) and icon-to-label pairings, where the 4-point step is visibly too
   * loose. They are the only two steps off the grid; prefer 4 and 8 in new
   * code and reach for these only when 4 demonstrably over-separates.
   */
  2: 2,
  4: 4,
  6: 6,
  8: 8,
  12: 12,
  16: 16,
  20: 20,
  24: 24,
  32: 32,
  40: 40,
  48: 48,
  64: 64,
} as const;

/**
 * Layout constants. Deliberately not part of `spacing`: these are container
 * measurements, not rhythm steps, and should not be reachable from a context
 * that expects a gap or a padding value.
 */
export const layout = {
  screenPadding: 16,
  screenPaddingWide: 32,
  gutter: 16,
  maxContentWidth: 1200,
  /** iOS HIG minimum tappable edge. */
  minHitTarget: 44,
} as const;
