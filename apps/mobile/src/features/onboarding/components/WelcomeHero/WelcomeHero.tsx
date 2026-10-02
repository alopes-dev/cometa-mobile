import { Pressable } from 'react-native';
import { useTheme } from 'styled-components/native';
import { illustration } from '../../assets';
import { welcome } from '../../content';
import { Root, Photo, Scrim, Hero, Title, Description } from './WelcomeHero.styles';

export type WelcomeHeroProps = {
  onAdvance: () => void;
};

/**
 * The brand arrival screen — node 45:40.
 *
 * The board draws no button here, so the screen is advanced by swiping to the
 * next page or by tapping anywhere on it. The tap target is the whole screen
 * rather than a control, which keeps the composition exactly as drawn while
 * still giving the screen a way forward that does not depend on discovering
 * the swipe.
 *
 * The title is drawn as two explicit lines; they are rendered as written
 * rather than left to wrap, so "Kometa! 👋" always breaks where the design
 * breaks it.
 */
export function WelcomeHero({ onAdvance }: WelcomeHeroProps) {
  const theme = useTheme();

  return (
    <Root>
      <Photo
        source={illustration.welcomePizza}
        contentFit="cover"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
      <Scrim
        colors={[...theme.onboarding.welcomeScrim.colors]}
        locations={[...theme.onboarding.welcomeScrim.locations]}
        pointerEvents="none"
      />
      <Pressable
        onPress={onAdvance}
        accessibilityRole="button"
        accessibilityLabel={`${welcome.titleLines.join(' ')}. ${welcome.description}`}
        accessibilityHint="Toca para continuar"
        style={{ flex: 1 }}
      >
        <Hero edges={['top', 'bottom']}>
          <Title accessibilityRole="header">{welcome.titleLines.join('\n')}</Title>
          <Description>{welcome.description}</Description>
        </Hero>
      </Pressable>
    </Root>
  );
}
