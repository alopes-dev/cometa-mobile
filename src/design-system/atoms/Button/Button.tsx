import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, type GestureResponderEvent } from 'react-native';
import { useTheme } from 'styled-components/native';
import * as Haptics from 'expo-haptics';
import { Text } from '../Text';
import {
  Container,
  VARIANT_STYLE,
  SIZE_TEXT_VARIANT,
  SIZE_HIT_SLOP,
  type ButtonVariant,
  type ButtonSize,
  type ButtonShape,
} from './Button.styles';

export type { ButtonVariant, ButtonSize, ButtonShape };

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  children?: ReactNode;
};

export function Button({
  variant = 'primary',
  size = 'md',
  shape = 'default',
  loading = false,
  disabled = false,
  icon,
  onPress,
  children,
}: ButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;
  const labelColor = VARIANT_STYLE[variant].label;

  const handlePress = (event: GestureResponderEvent) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress?.(event);
  };

  return (
    <Pressable
      onPress={isDisabled ? undefined : handlePress}
      disabled={isDisabled}
      accessibilityRole="button"
      hitSlop={SIZE_HIT_SLOP[size]}
      style={({ pressed: isPressed }) => ({
        opacity: isPressed && !isDisabled ? theme.pressed.opacity : 1,
      })}
    >
      <Container variant={variant} size={size} shape={shape} disabled={isDisabled}>
        {loading ? (
          <ActivityIndicator color={theme.colors[labelColor]} />
        ) : (
          <>
            {icon}
            {children ? (
              <Text variant={SIZE_TEXT_VARIANT[size]} color={labelColor}>
                {children}
              </Text>
            ) : null}
          </>
        )}
      </Container>
    </Pressable>
  );
}
