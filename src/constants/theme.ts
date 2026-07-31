export const colors = {
  primary: '#FF9500',
  onPrimary: '#000000',
  secondary: '#007AFF',
  onSecondary: '#FFFFFF',
  success: '#34C759',
  warning: '#FFCC00',
  error: '#FF3B30',
  background: '#FFFFFF',
  surface: '#F2F2F7',
  textPrimary: '#000000',
  textSecondary: '#8E8E93',
  border: '#E5E5EA',
  divider: '#E5E5EA',
  overlay: 'rgba(0, 0, 0, 0.4)',
} as const;

export const colorsDark = {
  primary: '#FF9F0A',
  onPrimary: '#000000',
  secondary: '#0A84FF',
  onSecondary: '#FFFFFF',
  success: '#30D158',
  warning: '#FFD60A',
  error: '#FF453A',
  background: '#000000',
  surface: '#1C1C1E',
  surfaceElevated: '#2C2C2E',
  textPrimary: '#FFFFFF',
  textSecondary: '#98989D',
  border: '#38383A',
  divider: '#38383A',
  overlay: 'rgba(0, 0, 0, 0.6)',
} as const;

export const font = {
  regular: 'Inter_400Regular',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const typography = {
  display: { fontFamily: font.bold, fontSize: 34, lineHeight: 41, letterSpacing: 0.37 },
  headline: { fontFamily: font.bold, fontSize: 28, lineHeight: 34, letterSpacing: 0.36 },
  title1: { fontFamily: font.semibold, fontSize: 22, lineHeight: 28, letterSpacing: 0.35 },
  title2: { fontFamily: font.semibold, fontSize: 20, lineHeight: 25, letterSpacing: 0.38 },
  body: { fontFamily: font.regular, fontSize: 17, lineHeight: 22, letterSpacing: -0.41 },
  bodyEmphasized: { fontFamily: font.semibold, fontSize: 17, lineHeight: 22, letterSpacing: -0.41 },
  callout: { fontFamily: font.regular, fontSize: 16, lineHeight: 21, letterSpacing: -0.32 },
  subheadline: { fontFamily: font.regular, fontSize: 15, lineHeight: 20, letterSpacing: -0.24 },
  footnote: { fontFamily: font.regular, fontSize: 13, lineHeight: 18, letterSpacing: -0.08 },
  caption: { fontFamily: font.regular, fontSize: 12, lineHeight: 16, letterSpacing: 0 },
  headlineMobile: { fontFamily: font.bold, fontSize: 24, lineHeight: 30 },
} as const;

export const spacing = {
  unit: 8,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  marginMobile: 16,
  marginDesktop: 32,
  gutter: 16,
  maxContainerDesktop: 1200,
} as const;

export const radius = {
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 9999,
  full: 9999,
} as const;

const shadow = (offsetY: number, shadowRadius: number, shadowOpacity: number, elevation: number) => ({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: offsetY },
    shadowOpacity,
    shadowRadius,
  },
  android: { elevation },
});

export const elevation = {
  level0: { ios: { shadowOpacity: 0 }, android: { elevation: 0 } },
  level1: shadow(1, 3, 0.04, 1),
  level2: shadow(4, 20, 0.08, 8),
  level2Dark: shadow(4, 20, 0.2, 8),
} as const;

export const opacity = {
  0: 0,
  10: 0.1,
  20: 0.2,
  40: 0.4,
  60: 0.6,
  80: 0.8,
  100: 1,
} as const;

export const pressed = { opacity: 0.85, scale: 0.98 } as const;

export const motion = {
  duration: { instant: 120, quick: 200, base: 280, slow: 420, hero: 600 },
  spring: { damping: 0.8, response: 0.4 },
  stagger: 60,
} as const;

export type Colors = typeof colors;
export type Font = typeof font;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type Radius = typeof radius;
export type Elevation = typeof elevation;
export type Opacity = typeof opacity;
