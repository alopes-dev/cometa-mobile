import styled from 'styled-components/native';
import type { Theme } from '@/design-system/ThemeProvider';
import { Text } from './Text';

type BadgeVariant = 'primary' | 'error' | 'success' | 'neutral';
type ColorKey = keyof Theme['colors'];

export type BadgeProps = {
  count?: number;
  variant?: BadgeVariant;
};

const VARIANT_COLOR: Record<BadgeVariant, ColorKey> = {
  primary: 'primary',
  error: 'error',
  success: 'success',
  neutral: 'textSecondary',
};

const NumberBadge = styled.View<{ color: ColorKey }>`
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  padding-horizontal: 6px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, color }) => theme.colors[color]};
`;

const DotBadge = styled.View<{ color: ColorKey }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ theme, color }) => theme.colors[color]};
`;

export function Badge({ count, variant = 'error' }: BadgeProps) {
  if (count === 0) return null;

  const color = VARIANT_COLOR[variant];

  if (count === undefined) {
    return <DotBadge color={color} />;
  }

  return (
    <NumberBadge color={color}>
      <Text variant="caption" color="onPrimary">
        {count > 99 ? '99+' : String(count)}
      </Text>
    </NumberBadge>
  );
}
