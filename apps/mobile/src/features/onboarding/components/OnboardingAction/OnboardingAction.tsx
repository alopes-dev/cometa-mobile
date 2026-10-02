import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import * as Haptics from 'expo-haptics';
import {
  Container,
  Label,
  type ActionTone,
  type ActionFamily,
} from './OnboardingAction.styles';

export type { ActionTone, ActionFamily };

export type OnboardingActionProps = {
  label: string;
  tone?: ActionTone;
  family?: ActionFamily;
  /** The leading glyph drawn inside the button — node 44:23950 on step 1. */
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
};

/**
 * The onboarding's action button — nodes 44:22405 / 44:22408 / 44:22410 on
 * board "10 — Onboarding" and node 45:67 on board "01 · Onboarding".
 *
 * Not `design-system/atoms/Button`: that atom resolves its fill from the app's
 * brand ramp and its label from the `Text` type ramp, and its tallest size is
 * 52px. The onboarding draws a 54px control in the Figma palette, so expressing
 * it through the atom would mean overriding the fill, the border, the radius,
 * the height and the label style — i.e. the atom would contribute nothing but
 * its press handling. The press behaviour it does contribute is kept: the same
 * light haptic and the same `theme.pressed.opacity` the atom uses, so onboarding
 * buttons feel identical to every other button in the app.
 */
export function OnboardingAction({
  label,
  tone = 'primary',
  family = 'text',
  icon,
  loading = false,
  disabled = false,
  onPress,
}: OnboardingActionProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress?.();
  };

  return (
    <Pressable
      onPress={isDisabled ? undefined : handlePress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => ({
        opacity: isDisabled
          ? theme.opacity[40]
          : pressed
            ? theme.pressed.opacity
            : theme.opacity[100],
      })}
    >
      <Container tone={tone} family={family}>
        {loading ? (
          <ActivityIndicator
            color={
              tone === 'primary'
                ? theme.onboarding.color.surfaceBackground
                : theme.onboarding.color.offerGreen
            }
          />
        ) : (
          <>
            {icon ? <View>{icon}</View> : null}
            <Label tone={tone} family={family}>
              {label}
            </Label>
          </>
        )}
      </Container>
    </Pressable>
  );
}
