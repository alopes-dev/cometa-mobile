import { Easing } from 'react-native';

export const colors = {
  canvas: '#E9E9E9',
  surfaceDark: '#131313',
  surfaceDark2: '#292929',
  surfaceLight: '#FFFFFF',
  surfaceLight2: '#F2F2F2',
  accentLime: '#CBF83E',
  textPrimary: '#111111',
  textSecondary: '#9A9A9A',
  textOnDark: '#FFFFFF',
  textOnDarkMuted: '#8B8B8B',
  divider: '#EDEDED',
  border: '#EFEFEF',
  iconVegan: '#2ECC71',
  iconCoffee: '#D97B3A',
  iconDonut: '#E8347A',
  iconSpicy: '#F5A623',
} as const;

export const font = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semibold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
} as const;

export const radius = {
  header: 28,
  sheet: 28,
  card: 20,
  image: 16,
  search: 16,
  cartButton: 12,
  pill: 999,
} as const;

export const layout = {
  screenPadding: 20,
  sectionGap: 24,
  gridGap: 12,
  navHeight: 76,
  navBottomOffset: 16,
  navSideMargin: 20,
  navInnerPadding: 12,
  navActiveCircle: 64,
  navIconSize: 26,
  navIconStroke: 1.75,
  ctaHeight: 60,
  ctaGap: 12,
  scrollBottomPadding: 180,
} as const;

export const navShadow = {
  ios: {
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
  },
  android: { elevation: 12 },
} as const;

export const pressed = { opacity: 0.85, scale: 0.98 } as const;

export const motion = {
  duration: { instant: 120, quick: 200, base: 280, slow: 420, hero: 600 },
  easing: {
    standard: Easing.out(Easing.quad),
    emphasized: Easing.out(Easing.exp),
    accelerate: Easing.in(Easing.quad),
    spring: { tension: 180, friction: 14 },
    springBouncy: { tension: 220, friction: 10 },
  },
  stagger: 60,
} as const;

export type Colors = typeof colors;
export type Font = typeof font;
export type Radius = typeof radius;
export type Layout = typeof layout;
