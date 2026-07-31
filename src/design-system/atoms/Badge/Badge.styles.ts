import styled from 'styled-components/native';
import type { Theme } from '@/design-system/ThemeProvider';

export type BadgeVariant = 'primary' | 'error' | 'success' | 'neutral';
export type ColorKey = keyof Theme['colors'];

export const VARIANT_COLOR: Record<BadgeVariant, ColorKey> = {
  primary: 'primary',
  error: 'error',
  success: 'success',
  neutral: 'textSecondary',
};

export const NumberBadge = styled.View<{ color: ColorKey }>`
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  padding-horizontal: 6px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, color }) => theme.colors[color]};
`;

export const DotBadge = styled.View<{ color: ColorKey }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ theme, color }) => theme.colors[color]};
`;
