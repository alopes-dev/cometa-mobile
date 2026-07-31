import type { ReactNode } from 'react';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';
import { Text } from './Text';

export type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: ReactNode;
};

const withAlpha = (hex: string, alphaHex: string) => `${hex}${alphaHex}`;

const Container = styled.View<{ selected: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding-horizontal: 12px;
  border-radius: ${({ theme }) => theme.radius.pill}px;
  background-color: ${({ theme, selected }) =>
    selected ? withAlpha(theme.colors.primary, '1A') : theme.colors.surface};
  border-width: 1px;
  border-color: ${({ theme, selected }) => (selected ? theme.colors.primary : theme.colors.border)};
`;

export function Chip({ label, selected = false, onPress, icon }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      hitSlop={6}
    >
      <Container selected={selected}>
        {icon}
        <Text variant="footnote" color={selected ? 'primary' : 'textPrimary'}>
          {label}
        </Text>
      </Container>
    </Pressable>
  );
}
