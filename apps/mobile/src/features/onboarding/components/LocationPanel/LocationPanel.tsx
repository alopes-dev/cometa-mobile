import { useTheme } from 'styled-components/native';
import { icon } from '../../assets';
import { OnboardingIcon } from '../OnboardingIcon';
import { Panel, PinField } from './LocationPanel.styles';

/**
 * The 210px symbol panel on the location step — node 44:22400.
 *
 * Deliberately not a live map. The board draws a flat panel holding a pin, and
 * the step runs *before* the location permission is asked for, so there is
 * nothing a map could legitimately centre on yet. Hidden from assistive tech
 * because it carries no information the heading above it does not.
 */
export function LocationPanel() {
  const theme = useTheme();

  return (
    <Panel accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <PinField>
        <OnboardingIcon source={icon.mapPin} size={theme.onboarding.metrics.symbolIconSize} />
      </PinField>
    </Panel>
  );
}
