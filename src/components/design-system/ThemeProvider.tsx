import type { ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import {
  colors,
  colorsDark,
  typography,
  spacing,
  radius,
  elevation,
  opacity,
  motion,
  pressed,
} from '@/constants/theme';

interface ThemeShape {
  scheme: 'light' | 'dark';
  colors: Record<keyof typeof colors, string>;
  typography: typeof typography;
  spacing: typeof spacing;
  radius: typeof radius;
  elevation: typeof elevation;
  opacity: typeof opacity;
  motion: typeof motion;
  pressed: typeof pressed;
}

const lightTheme: ThemeShape = {
  scheme: 'light',
  colors,
  typography,
  spacing,
  radius,
  elevation,
  opacity,
  motion,
  pressed,
};

const darkTheme: ThemeShape = {
  scheme: 'dark',
  colors: colorsDark,
  typography,
  spacing,
  radius,
  elevation: { ...elevation, level2: elevation.level2Dark },
  opacity,
  motion,
  pressed,
};

export type Theme = ThemeShape;

export function ThemeProvider({ children }: { children: ReactNode }) {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;
  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>;
}
