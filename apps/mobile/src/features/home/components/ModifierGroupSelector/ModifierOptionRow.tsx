import { useEffect, useRef } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from 'styled-components/native';
import { Icon } from '@/components/design-system/atoms';
import { useBounceAnimation } from '@/hooks/useBounceAnimation';
import { usePressScale } from '@/hooks/usePressScale';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { formatKwanza } from '../../format';
import type { ModifierOption } from '../../types';
import { OptionLabel, OptionRow, circleShape, squareShape } from './ModifierGroupSelector.styles';

export type ModifierOptionRowProps = {
  option: ModifierOption;
  type: 'single' | 'multiple';
  selected: boolean;
  onToggle: () => void;
};

const TRANSITION_DURATION = 160;

export function ModifierOptionRow({ option, type, selected, onToggle }: ModifierOptionRowProps) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const { style: bounceStyle, bounce } = useBounceAnimation(1.15);
  const { style: pressStyle, onPressIn, onPressOut } = usePressScale(0.97);
  const progress = useSharedValue(selected ? 1 : 0);
  const previousSelected = useRef(selected);

  useEffect(() => {
    if (selected === previousSelected.current) return;
    if (reducedMotion) {
      progress.value = selected ? 1 : 0;
    } else {
      progress.value = withTiming(selected ? 1 : 0, { duration: TRANSITION_DURATION });
    }
    if (selected && !previousSelected.current) {
      bounce();
    }
    previousSelected.current = selected;
  }, [selected]);

  const colorStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], ['transparent', theme.colors.brand.base]),
    // The board draws the resting box as a 1px hairline in `border/subtle`
    // (nodes 48:20716 onwards); the fill replaces it rather than sitting
    // inside it, so the stroke goes to 0 as the brand fill arrives.
    borderWidth: interpolate(progress.value, [0, 1], [1, 0]),
    borderColor: theme.colors.border.subtle,
  }));

  const shape = type === 'single' ? circleShape : squareShape;

  return (
    <Pressable
      onPress={onToggle}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole={type === 'single' ? 'radio' : 'checkbox'}
      accessibilityState={{ checked: selected }}
      accessibilityLabel={option.label}
    >
      <Animated.View style={pressStyle}>
        <OptionRow>
          {/*
            The board carries the surcharge inside the name, separated by a
            middot — "Queijo extra · +800 Kz" (node 48:20718) — rather than in
            a column of its own, so the row is one label and one control.
          */}
          <OptionLabel numberOfLines={1}>
            {option.priceDelta > 0
              ? `${option.label} · +${formatKwanza(option.priceDelta)}`
              : option.label}
          </OptionLabel>
          <Animated.View style={bounceStyle}>
            <Animated.View style={[shape, colorStyle]}>
              {selected ? <Icon name="checkmark" sf="checkmark" size={12} color="onBrand" /> : null}
            </Animated.View>
          </Animated.View>
        </OptionRow>
      </Animated.View>
    </Pressable>
  );
}
