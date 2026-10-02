/**
 * Raw color ramps — the single place literal hex values are allowed to live.
 *
 * Components must never import this file. They consume the semantic tokens in
 * `semantic.ts` through the styled-components theme, so that a value can be
 * re-pointed (or re-pointed per color scheme) without touching a component.
 *
 * Ramps are tuned so that every step a token maps to a *text* role clears
 * WCAG AA against the surfaces it is actually used on. See DESIGN-SYSTEM.md
 * for the measured contrast table.
 */

/**
 * Cometa brand — deep jade green, hue ~158°.
 *
 * Deliberately deeper and slightly cooler than a stock "delivery green": the
 * 600 step hosts white text at 5.16:1 and the 700 step reads as text on white
 * at 7.31:1, which is what lets the brand act as an accent instead of a
 * flood fill. 300/400 exist for dark mode, where light steps carry the brand.
 */
export const brand = {
  50: '#EBFAF2',
  100: '#CFF3E1',
  200: '#A3E6C6',
  300: '#66D2A4',
  400: '#2DB880',
  500: '#109B68',
  600: '#0A7D53',
  700: '#096341',
  800: '#084E34',
  900: '#06402B',
} as const;

/**
 * Neutrals — carry 70–80% of the interface.
 *
 * A faint cool cast (~215° at 4–6% saturation) keeps them from reading flat
 * grey without tipping green. 950 is the dark-mode base: near-black rather
 * than #000 so elevated surfaces have somewhere to go.
 */
export const neutral = {
  0: '#FFFFFF',
  50: '#FAFAFB',
  100: '#F4F5F6',
  200: '#E8EAEC',
  300: '#D7DADE',
  400: '#AEB4BA',
  500: '#848B93',
  600: '#5F666E',
  700: '#454B52',
  800: '#2C3137',
  900: '#1A1D21',
  950: '#0E1013',
} as const;

/** Error / destructive. 600 hosts white at 5.59:1; 300 is the dark-mode text step. */
export const red = {
  50: '#FEF0EF',
  100: '#FCD9D6',
  200: '#F8ADA6',
  300: '#F2766B',
  400: '#E85042',
  500: '#E0352B',
  600: '#C62A21',
  700: '#9F211A',
  800: '#7A1914',
  900: '#5C1310',
} as const;

/**
 * Warning / "preparing" / limited-time urgency.
 *
 * Note 500 (#F2960B) is a *fill only* — at 2.30:1 on white it can never carry
 * text. Warning text always uses 700. This is the defect the old
 * `warning: '#FFCC00'` token had: 1.51:1, used as if it were a text color.
 */
export const amber = {
  50: '#FFF8EB',
  100: '#FDEBC8',
  200: '#FBD68E',
  300: '#F8BC4F',
  400: '#F5A623',
  500: '#F2960B',
  600: '#B86E05',
  700: '#8F5604',
  800: '#6B4003',
  900: '#4D2E02',
} as const;

/** Info / courier-assigned / in-transit. */
export const blue = {
  50: '#EDF4FF',
  100: '#D7E6FF',
  200: '#AECCFF',
  300: '#7FB0FF',
  400: '#4C92FA',
  500: '#2E7CF6',
  600: '#1760D4',
  700: '#1049A6',
  800: '#0C3677',
  900: '#082651',
} as const;

/**
 * Promotional "featured" accent.
 *
 * Intentionally a violet: it carries forward a trace of the outgoing
 * #6E5DE7 primary, so the palette change reads as an evolution of Cometa
 * rather than an erasure of it. Reserved for editorial/featured placement —
 * never for interactive state, which is the brand's job.
 */
export const violet = {
  50: '#F4F0FF',
  100: '#E7DEFF',
  200: '#CFBEFF',
  300: '#B9A6FF',
  400: '#8E74F5',
  500: '#7857EF',
  600: '#6938EF',
  700: '#5325C4',
  800: '#3F1C94',
  900: '#2C1369',
} as const;

/** Composites an `rgba()` string from a 6-digit hex and an 0–1 alpha. */
export const withAlpha = (hex: string, alpha: number): string => {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
