import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, type GestureResponderEvent } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import * as Haptics from 'expo-haptics';
import type { Theme } from '@/design-system/ThemeProvider';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'text' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonShape = 'default' | 'pill' | 'circle';

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

type ColorKey = keyof Theme['colors'];

const VARIANT_STYLE: Record<
  ButtonVariant,
  { background: ColorKey | 'transparent'; label: ColorKey; border: ColorKey | 'transparent' }
> = {
  primary: { background: 'primary', label: 'onPrimary', border: 'transparent' },
  secondary: { background: 'secondary', label: 'onSecondary', border: 'transparent' },
  success: { background: 'success', label: 'onPrimary', border: 'transparent' },
  danger: { background: 'error', label: 'onPrimary', border: 'transparent' },
  outline: { background: 'transparent', label: 'primary', border: 'primary' },
  ghost: { background: 'surface', label: 'textPrimary', border: 'transparent' },
  text: { background: 'transparent', label: 'primary', border: 'transparent' },
};

const SIZE_STYLE: Record<ButtonSize, { height: number; paddingHorizontal: number }> = {
  sm: { height: 36, paddingHorizontal: 12 },
  md: { height: 44, paddingHorizontal: 16 },
  lg: { height: 52, paddingHorizontal: 20 },
};

const Container = styled.View<{
  variant: ButtonVariant;
  size: ButtonSize;
  shape: ButtonShape;
  disabled: boolean;
}>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: ${({ size }) => Math.max(SIZE_STYLE[size].height, 44)}px;
  min-width: ${({ shape, size }) => (shape === 'circle' ? Math.max(SIZE_STYLE[size].height, 44) : 44)}px;
  padding-horizontal: ${({ shape, size }) => (shape === 'circle' ? 0 : SIZE_STYLE[size].paddingHorizontal)}px;
  border-radius: ${({ shape, theme }) => (shape === 'default' ? theme.radius.md : theme.radius.pill)}px;
  background-color: ${({ theme, variant }) => {
    const bg = VARIANT_STYLE[variant].background;
    return bg === 'transparent' ? 'transparent' : theme.colors[bg];
  }};
  border-width: ${({ variant }) => (VARIANT_STYLE[variant].border === 'transparent' ? 0 : 1)}px;
  border-color: ${({ theme, variant }) => {
    const border = VARIANT_STYLE[variant].border;
    return border === 'transparent' ? 'transparent' : theme.colors[border];
  }};
  opacity: ${({ theme, disabled }) => (disabled ? theme.opacity[40] : theme.opacity[100])};
`;

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
              <Text variant="bodyEmphasized" color={labelColor}>
                {children}
              </Text>
            ) : null}
          </>
        )}
      </Container>
    </Pressable>
  );
}
