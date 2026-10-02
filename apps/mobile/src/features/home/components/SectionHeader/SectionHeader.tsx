import { Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/design-system/atoms';
import { layout, spacing, typography } from '@/theme';
import { Container } from './SectionHeader.styles';

/**
 * The action is a bare label, so its own box is only one line tall. Rather
 * than padding it — which would push the header off the board's 24pt row —
 * the target is grown outward with hitSlop until it clears the HIG minimum.
 * Derived from the type token so a change of variant cannot silently shrink it.
 */
const ACTION_SLOP_Y = Math.ceil((layout.minHitTarget - typography.label.lineHeight) / 2);

export type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onPressAction?: () => void;
};

export function SectionHeader({ title, actionLabel, onPressAction }: SectionHeaderProps) {
  const handlePressAction = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPressAction?.();
  };

  return (
    <Container>
      <Text variant="h5">{title}</Text>
      {actionLabel ? (
        <Pressable
          onPress={handlePressAction}
          accessibilityRole="button"
          hitSlop={{ top: ACTION_SLOP_Y, bottom: ACTION_SLOP_Y, left: spacing[8], right: spacing[8] }}
        >
          <Text variant="label" color="brand">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </Container>
  );
}
