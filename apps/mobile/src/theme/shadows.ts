/**
 * Elevation.
 *
 * Four levels, per §28. Depth is meant to come from surface contrast and
 * hairline borders first; shadow is the last resort, which is why `sm` is
 * almost imperceptible and there is no level above `lg`.
 *
 * Stored as geometry rather than as a `box-shadow` string on purpose:
 * `css-to-react-native` compiles `box-shadow` down to the legacy iOS shadow
 * props and emits no Android `elevation`, so authoring shadows that way
 * would silently drop every shadow on Android. Apply these through the
 * `elevate()` mixin in `mixins.ts`.
 */
export type ShadowGeometry = {
  readonly offsetY: number;
  readonly radius: number;
  readonly opacity: number;
  readonly elevation: number;
};

export type ShadowLevel = 'none' | 'sm' | 'md' | 'lg';

/** Light scheme. `sm` and `md` reproduce the previous level1/level2 exactly. */
const lightShadows = {
  none: { offsetY: 0, radius: 0, opacity: 0, elevation: 0 },
  /** Resting cards. A hairline border usually reads better than this. */
  sm: { offsetY: 1, radius: 3, opacity: 0.04, elevation: 1 },
  /** Floating bars, pressed-forward surfaces. */
  md: { offsetY: 4, radius: 20, opacity: 0.08, elevation: 8 },
  /** Sheets and modals only. */
  lg: { offsetY: 8, radius: 28, opacity: 0.14, elevation: 16 },
} as const satisfies Record<ShadowLevel, ShadowGeometry>;

/**
 * Dark scheme. Same geometry, higher opacity — a black shadow over a
 * near-black surface needs more alpha to register at all. Kept restrained so
 * depth still comes mainly from `surface.elevated` against `background`,
 * which is what §22 asks for.
 */
const darkShadows = {
  none: { offsetY: 0, radius: 0, opacity: 0, elevation: 0 },
  sm: { offsetY: 1, radius: 3, opacity: 0.2, elevation: 1 },
  md: { offsetY: 4, radius: 20, opacity: 0.3, elevation: 8 },
  lg: { offsetY: 8, radius: 28, opacity: 0.4, elevation: 16 },
} as const satisfies Record<ShadowLevel, ShadowGeometry>;

export const shadows = {
  light: lightShadows,
  dark: darkShadows,
} as const;
