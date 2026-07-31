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

const lightTheme = {
  scheme: 'light' as const,
  colors,
  typography,
  spacing,
  radius,
  elevation,
  opacity,
  motion,
  pressed,
};

const darkTheme = {
  scheme: 'dark' as const,
  colors: colorsDark,
  typography,
  spacing,
  radius,
  elevation: { ...elevation, level2: elevation.level2Dark },
  opacity,
  motion,
  pressed,
};

export type Theme = typeof lightTheme;

export function ThemeProvider({ children }: { children: ReactNode }) {
  const scheme = useColorScheme();
  const theme = (scheme === 'dark' ? darkTheme : lightTheme) as unknown as Theme;
  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>;
}
