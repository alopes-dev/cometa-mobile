import type { ReactNode } from 'react';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { usePressScale } from '@/hooks/usePressScale';
import { Text } from '../Text';
import { Container, type ChipSize, type ChipVariant } from './Chip.styles';

export type { ChipSize, ChipVariant };

export type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: ReactNode;
  /** `md` (40pt) by default; Search draws 34 (nodes 48:20177, 48:20186). */
  size?: ChipSize;
  /**
   * `filled` by default — a grey chip on a white page, the way Home's filter
   * bar reads. `outlined` is Search's white chip, which needs a hairline to
   * separate it from the page it sits on (node 48:20179).
   */
  variant?: ChipVariant;
};

export function Chip({
  label,
  selected = false,
  onPress,
  icon,
  size = 'md',
  variant = 'filled',
}: ChipProps) {
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
        <Container selected={selected} size={size} variant={variant}>
          {icon}
          {/*
            The smaller chip carries a label one step down the ramp, and set
            in the semibold face: at 34pt the regular 13px step reads as body
            copy that happens to sit in a pill rather than as a control.
          */}
          <Text variant={size === 'sm' ? 'labelSmall' : 'caption'} color={selected ? 'brand' : 'primary'}>
            {label}
          </Text>
        </Container>
      </Animated.View>
    </Pressable>
  );
}
