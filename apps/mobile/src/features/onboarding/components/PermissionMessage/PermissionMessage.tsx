import { useTheme } from 'styled-components/native';
import { OnboardingIcon } from '../OnboardingIcon';
import { Block, SymbolField, Title, Description } from './PermissionMessage.styles';

export type PermissionMessageProps = {
  /** A `require`d SVG from `features/onboarding/assets`, drawn at 38px. */
  glyph: number;
  title: string;
  description: string;
};

/**
 * The centred symbol-and-copy block the two permission screens share — nodes
 * 44:22423 (location) and 44:22504 (notifications).
 *
 * This is the "explain before you ask" half of the pattern the board's own
 * notes call for: the system dialog is only raised from the action below it,
 * never on mount, so the user reads why before anything is requested.
 */
export function PermissionMessage({ glyph, title, description }: PermissionMessageProps) {
  const theme = useTheme();

  return (
    <Block>
      <SymbolField>
        <OnboardingIcon source={glyph} size={theme.onboarding.metrics.symbolIconSize} />
      </SymbolField>
      <Title accessibilityRole="header">{title}</Title>
      <Description>{description}</Description>
    </Block>
  );
}
