import type { ReactNode } from 'react';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { usePressScale } from '@/hooks/usePressScale';
import { Text } from '../Text';
import { Container } from './Chip.styles';

export type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: ReactNode;
};

export function Chip({ label, selected = false, onPress, icon }: ChipProps) {
  const { style: pressStyle, onPressIn, onPressOut } = usePressScale(0.96);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      hitSlop={6}
    >
      <Animated.View style={pressStyle}>
        <Container selected={selected}>
          {icon}
          <Text variant="footnote" color={selected ? 'categorySelected' : 'textPrimary'}>
            {label}
          </Text>
        </Container>
      </Animated.View>
    </Pressable>
  );
}
