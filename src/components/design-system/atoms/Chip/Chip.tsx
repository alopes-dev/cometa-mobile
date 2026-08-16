import type { ReactNode } from 'react';
import { Pressable } from 'react-native';
import { Text } from '../Text';
import { Container } from './Chip.styles';

export type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: ReactNode;
};

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
