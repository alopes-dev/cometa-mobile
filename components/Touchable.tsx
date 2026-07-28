import React from 'react';
import { Animated, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { pressed } from '@/constants/theme';
import { usePressScale } from '@/hooks/usePressScale';

type Props = {
  onPress?: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  hitSlop?: PressableProps['hitSlop'];
  accessibilityRole?: PressableProps['accessibilityRole'];
  accessibilityLabel: string;
  disabled?: boolean;
};

export function Touchable({
  onPress,
  children,
  style,
  hitSlop,
  accessibilityRole = 'button',
  accessibilityLabel,
  disabled,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={hitSlop}
      disabled={disabled}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
    >
      {({ pressed: isPressed }) => (
        <Animated.View
          style={[
            { transform: [{ scale }], opacity: isPressed ? pressed.opacity : 1 },
            style,
          ]}
        >
          {children}
        </Animated.View>
      )}
    </Pressable>
  );
}
