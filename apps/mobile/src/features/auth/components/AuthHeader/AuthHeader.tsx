import { Pressable } from 'react-native';
import { useTheme } from 'styled-components/native';
import { OnboardingIcon } from '@/features/onboarding/components/OnboardingIcon';
import { icon } from '../../assets';
import { BackTarget, Block, Description, Navigation, Title } from './AuthHeader.styles';

export type AuthHeaderProps = {
  title: string;
  description: string;
  /** Draws the circular back target in the navigation row — node 74:24713. */
  onBack?: () => void;
};

/**
 * The navigation row and title block shared by every authentication screen —
 * nodes 74:24712 and 74:24715.
 *
 * The navigation row keeps its 44px height even when there is nothing to go
 * back to (the Welcome screen puts the logo there instead), so the title sits
 * at the same height on every screen in the flow rather than jumping on the
 * first push.
 *
 * The title is the screen's heading for assistive tech, so someone landing
 * here hears what the screen is before reaching the field.
 */
export function AuthHeader({ title, description, onBack }: AuthHeaderProps) {
  const theme = useTheme();

  return (
    <>
      <Navigation>
        {onBack ? (
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            hitSlop={8}
            style={({ pressed }) => ({ opacity: pressed ? theme.pressed.opacity : 1 })}
          >
            <BackTarget>
              <OnboardingIcon source={icon.arrowLeft} size={theme.auth.metrics.backIconSize} />
            </BackTarget>
          </Pressable>
        ) : null}
      </Navigation>
      <Block>
        <Title accessibilityRole="header">{title}</Title>
        <Description>{description}</Description>
      </Block>
    </>
  );
}
