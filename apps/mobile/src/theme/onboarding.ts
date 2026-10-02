/**
 * Onboarding tokens — a verbatim mirror of the Figma variables and measured
 * values on page "09 — Onboarding" of file PAuqq5xMI0yQtx8POz4TUL.
 *
 * These sit beside `semantic.ts` rather than inside it, deliberately. The two
 * onboarding boards were drawn against their own palette and type ramp —
 * `offer/green` #1BAC4B and Urbanist — which is not the app's brand ramp
 * (`brand.600` #0A7D53, Poppins + Inter). Re-pointing the semantic tokens at
 * the Figma values would re-skin every screen in the app and break the
 * guarantees `contrast.test.ts` enforces, so the Figma palette is scoped here:
 * the onboarding renders exactly as drawn and nothing else moves.
 *
 * Literal hex is allowed in this file for the same reason it is allowed in
 * `palette.ts` — this file *is* a token source. Components reach it only
 * through `theme.onboarding`.
 *
 * CONTRAST NOTE: white-on-`offerGreen` measures 2.98:1, below the 4.5:1 WCAG
 * AA threshold for body text and below the 3:1 large-text threshold. That is a
 * property of the design as drawn, not of this translation. It is why these
 * tokens are not wired into `contrast.test.ts`, which would (correctly) fail
 * them. See the handover notes.
 */

/** Figma variables, named as the file names them. */
const color = {
  /** `text/primary` */
  textPrimary: '#212121',
  /** `text/secondary` */
  textSecondary: '#616161',
  /** `text/muted` — address-form placeholders. */
  textMuted: '#9E9E9E',
  /** `offer/green` — the onboarding accent: fills, active progress, links. */
  offerGreen: '#1BAC4B',
  /** `surface/background` */
  surfaceBackground: '#FFFFFF',
  /** `surface/subtle` — the symbol panel and unselected category cards. */
  surfaceSubtle: '#FAFAFA',
  /** `border/subtle` — field borders, idle progress segments, idle dots. */
  borderSubtle: '#EEEEEE',
  /** `brand/primary-light` — the round symbol field behind a permission icon. */
  brandPrimaryLight: '#E8F7ED',
  /** `brand/primary-soft` — the border of a selected category card. */
  brandPrimarySoft: '#A4DDB7',
  /**
   * The splash's idle loading dot. One value off `brandPrimaryLight` in the
   * file (#E8F8ED vs #E8F7ED) and kept distinct rather than merged, because
   * merging them would be a change to the design rather than a translation.
   */
  splashDotIdle: '#E8F8ED',
} as const;

/**
 * Font faces. The two boards use different families: "01 · Onboarding" is set
 * in Urbanist, "10 — Onboarding" in Inter.
 *
 * Weight travels through `fontFamily`, never `fontWeight` — the same rule
 * `typography.ts` follows, and for the same reason: with static font files
 * iOS synthesizes a faux weight when `fontWeight` disagrees with the file.
 */
const font = {
  /** Urbanist — board "01 · Onboarding". */
  display: {
    regular: 'Urbanist_400Regular',
    semibold: 'Urbanist_600SemiBold',
    bold: 'Urbanist_700Bold',
    extrabold: 'Urbanist_800ExtraBold',
  },
  /** Inter — board "10 — Onboarding". */
  text: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
} as const;

/**
 * Type steps, transcribed per node.
 *
 * Where Figma says `leading-[normal]` the step carries no `lineHeight` and the
 * platform default applies — that is the faithful reading of "normal", and
 * pinning an invented number there would be a change, not a translation.
 * Where Figma gives a unitless multiplier it is resolved against the font size
 * and rounded to the nearest pixel (e.g. 28 x 1.15 = 32.2 -> 32).
 */
const type = {
  // --- Board "01 · Onboarding" (Urbanist) -------------------------------
  /** Splash wordmark — node 45:32. */
  wordmark: { fontFamily: font.display.extrabold, fontSize: 31 },
  /** Welcome title — node 45:49, 34 x 1.15. */
  welcomeTitle: { fontFamily: font.display.extrabold, fontSize: 34, lineHeight: 39 },
  /** Welcome body — node 45:50, 13 x 1.55. */
  welcomeBody: { fontFamily: font.display.regular, fontSize: 13, lineHeight: 20 },
  /** Value-slide title — node 45:61. */
  slideTitle: { fontFamily: font.display.bold, fontSize: 24 },
  /** Value-slide body — node 45:62, 13 x 1.55. */
  slideBody: { fontFamily: font.display.regular, fontSize: 13, lineHeight: 20 },
  /** Value-slide button label — node 45:68. */
  slideAction: { fontFamily: font.display.bold, fontSize: 15 },

  // --- Board "10 — Onboarding" (Inter) ----------------------------------
  /** Left-aligned step title — node 44:22397, 28 x 1.15. */
  stepTitle: { fontFamily: font.text.bold, fontSize: 28, lineHeight: 32 },
  /** Left-aligned step body — node 44:22398, 15 x 1.45. */
  stepBody: { fontFamily: font.text.regular, fontSize: 15, lineHeight: 22 },
  /** Centred permission title — node 44:22426. */
  permissionTitle: { fontFamily: font.text.bold, fontSize: 28 },
  /** Centred permission body — node 44:22427, 14 x 1.5. */
  permissionBody: { fontFamily: font.text.regular, fontSize: 14, lineHeight: 21 },
  /** Address-field label — node 44:22456. */
  fieldLabel: { fontFamily: font.text.medium, fontSize: 13 },
  /** Address-field value and placeholder — node 44:22458. */
  fieldValue: { fontFamily: font.text.regular, fontSize: 15 },
  /** Action-button label — node 44:22407. */
  action: { fontFamily: font.text.semibold, fontSize: 15 },
  /** Category-card label — node 44:22536. */
  categoryLabel: { fontFamily: font.text.semibold, fontSize: 12 },
} as const;

/**
 * Measured geometry. Named per the Figma layer that carries each value so a
 * later design change can be traced back to the node it came from.
 */
const metrics = {
  /** `Screen content` horizontal padding — 24 on both boards. */
  screenPadding: 24,
  /** `Screen content` top / bottom padding — board 10. */
  stepPaddingTop: 12,
  stepPaddingBottom: 28,
  /** Gap between the blocks of a board-10 screen. */
  stepGap: 20,
  /** `Screen header` internal gap. */
  headerGap: 12,

  /** `Button` — identical across both boards. */
  actionHeight: 54,
  actionRadius: 14,
  actionGap: 8,
  /** Gap between a leading icon and its label inside a button (node 44:22405). */
  actionIconGap: 10,
  actionIconSize: 19,

  /** `Progress` — board 10. */
  progressHeight: 4,
  progressGap: 6,

  /** `Location symbol` panel — node 44:22400. */
  symbolPanelHeight: 210,
  symbolPanelRadius: 20,
  /** `Pin field` / `Notification symbol` — the round field behind the icon. */
  symbolFieldSize: 88,
  symbolIconSize: 38,

  /** `Back action` — node 44:22450. */
  backActionSize: 40,
  backActionIconSize: 20,

  /** `Address form`. */
  formGap: 12,
  fieldStackGap: 7,
  fieldHeight: 54,
  fieldRadius: 14,
  fieldPaddingHorizontal: 16,
  fieldBorderWidth: 1,
  fieldFocusBorderWidth: 1.5,

  /** `Category grid` — node 44:22533. */
  categoryGap: 10,
  categoryHeight: 86,
  categoryRadius: 14,
  categoryPadding: 12,
  categoryIconSize: 22,

  /** `Onboarding content` — board 01 value slides. */
  slidePaddingTop: 24,
  slidePaddingBottom: 18,
  slideGap: 18,
  illustrationHeight: 380,
  illustrationRadius: 24,

  /** `Pagination` — node 45:63. */
  pagerDotSize: 8,
  pagerDotActiveWidth: 28,
  pagerDotGap: 7,

  /** `Dots loader` — node 45:33. */
  splashDotSize: 7,
  splashDotActiveWidth: 18,
  splashDotGap: 6,
  /** Gap between the wordmark and the loader — node 45:23. */
  splashGap: 170,
  /** `Cometa logo` — node 45:24. */
  splashMarkSize: 48,
  splashMarkGap: 10,

  /** `Welcome hero` — node 45:48. */
  welcomePaddingBottom: 44,
  welcomeGap: 16,
} as const;

/**
 * The `Photo gradient` over the welcome photograph — node 45:42.
 * Transparent until 25% of the height, then down to 85% black.
 */
const welcomeScrim = {
  colors: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.85)'] as const,
  locations: [0.25, 1] as const,
};

export const onboarding = { color, font, type, metrics, welcomeScrim } as const;

export type OnboardingTokens = typeof onboarding;
export type OnboardingTypeStep = keyof typeof type;
