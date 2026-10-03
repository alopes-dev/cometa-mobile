import { ActivityIndicator, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from 'styled-components/native';
import { Label, Surface, type AuthActionVariant } from './AuthAction.styles';

export type AuthActionProps = {
  label: string;
  onPress: () => void;
  variant?: AuthActionVariant;
  disabled?: boolean;
  /** Swaps the label for a spinner — frames "Phone · Loading", "OTP · Filled / verifying". */
  loading?: boolean;
};

/**
 * The 56px action button the authentication boards draw — node 74:24642.
 *
 * Separate from the design-system `Button` on purpose: these boards use the
 * onboarding palette and their own geometry (56 high at radius 16, against the
 * app's 54 at radius 14), so reusing `Button` would mean adding a variant that
 * exists only behind the sign-in wall.
 *
 * A loading button stays pressable-looking but is inert — `disabled` covers
 * both states so a double tap cannot send two codes.
 */
export function AuthAction({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}: AuthActionProps) {
  const theme = useTheme();
  const inert = disabled || loading;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={inert}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inert, busy: loading }}
      style={({ pressed }) => ({ opacity: pressed && !inert ? theme.pressed.opacity : 1 })}
    >
      <Surface variant={variant} disabled={inert}>
        {loading ? (
          <ActivityIndicator
            color={
              variant === 'primary' && !disabled
                ? theme.auth.color.surfaceBackground
                : theme.auth.color.textMuted
            }
          />
        ) : (
          <Label variant={variant} disabled={inert}>
            {label}
          </Label>
        )}
      </Surface>
    </Pressable>
  );
}
