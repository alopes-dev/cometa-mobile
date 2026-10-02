/**
 * Type system.
 *
 * Poppins carries display and heading levels — it gives Cometa a voice at the
 * top of a screen. Inter carries everything functional: body, labels,
 * buttons, inputs, metadata and all numerals, where its narrower forms and
 * tabular figures read better at small sizes.
 *
 * The pixel values are the Apple HIG Dynamic Type ramp, unchanged from the
 * previous system on purpose: renaming the ramp should not reflow a single
 * screen. Only the names and the font families changed.
 */

/**
 * Weight is expressed through `fontFamily`, never `fontWeight`: with static
 * font files loaded by name, iOS synthesizes a faux weight (or silently
 * falls back to San Francisco) when `fontWeight` disagrees with the file.
 */
export const fontFamily = {
  display: {
    semibold: 'Poppins_600SemiBold',
    bold: 'Poppins_700Bold',
  },
  text: {
    regular: 'Inter_400Regular',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
} as const;

export const typography = {
  /** Hero moments only — one per screen at most. Avoid on dense mobile views. */
  display: {
    fontFamily: fontFamily.display.bold,
    fontSize: 34,
    lineHeight: 41,
    letterSpacing: 0.37,
  },
  h1: {
    fontFamily: fontFamily.display.bold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: 0.36,
  },
  h2: {
    fontFamily: fontFamily.display.bold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: 0.2,
  },
  h3: {
    fontFamily: fontFamily.display.semibold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0.35,
  },
  h4: {
    fontFamily: fontFamily.display.semibold,
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: 0.38,
  },
  /** Section and row titles. The heaviest step still set in Inter. */
  title: {
    fontFamily: fontFamily.text.semibold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
  },
  bodyLarge: {
    fontFamily: fontFamily.text.regular,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
  },
  body: {
    fontFamily: fontFamily.text.regular,
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: -0.32,
  },
  /** Emphasis at body size — button labels, totals. */
  bodyStrong: {
    fontFamily: fontFamily.text.semibold,
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: -0.32,
  },
  bodySmall: {
    fontFamily: fontFamily.text.regular,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
  },
  /** Emphasis at 15px — summary-bar labels, prices in a row. */
  labelLarge: {
    fontFamily: fontFamily.text.semibold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
  },
  /** Buttons, field labels, chips, and any 13px text that must read as UI. */
  label: {
    fontFamily: fontFamily.text.semibold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
  },
  caption: {
    fontFamily: fontFamily.text.regular,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
  },
  /** Emphasis at the smallest step — overline labels above a value. */
  labelSmall: {
    fontFamily: fontFamily.text.semibold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
  },
  /** Smallest permitted step. Never for anything a user must act on. */
  micro: {
    fontFamily: fontFamily.text.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
  },
} as const;

export type TypographyVariant = keyof typeof typography;
export type Typography = typeof typography;
