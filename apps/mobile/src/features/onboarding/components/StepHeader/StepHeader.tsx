import { Pressable } from 'react-native';
import { useTheme } from 'styled-components/native';
import { icon } from '../../assets';
import { OnboardingIcon } from '../OnboardingIcon';
import { Block, Title, Description, BackTarget } from './StepHeader.styles';

export type StepHeaderProps = {
  title: string;
  description: string;
  /** Draws the circular back target above the title — node 44:22450. */
  onBack?: () => void;
};

/**
 * The left-aligned title block used by steps 1, 2 and 4 — node 44:22396.
 *
 * The title is the screen's heading for assistive tech, so a user landing on
 * the step hears what it is before the progress bar or the form.
 */
export function StepHeader({ title, description, onBack }: StepHeaderProps) {
  const theme = useTheme();

  return (
    <Block>
      {onBack ? (
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          hitSlop={8}
          style={({ pressed }) => ({ opacity: pressed ? theme.pressed.opacity : 1 })}
        >
          <BackTarget>
            <OnboardingIcon
              source={icon.arrowLeft}
              size={theme.onboarding.metrics.backActionIconSize}
            />
          </BackTarget>
        </Pressable>
      ) : null}
      <Title accessibilityRole="header">{title}</Title>
      <Description>{description}</Description>
    </Block>
  );
}
