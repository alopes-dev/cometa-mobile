import { useRouter } from 'expo-router';
import { useTheme } from 'styled-components/native';
import {
  ActionStack,
  LocationPanel,
  OnboardingAction,
  OnboardingIcon,
  Spacer,
  StepHeader,
  StepScreen,
  icon,
  locationChoice,
  setupStep,
} from '@/features/onboarding';
import { useSetup } from '@/hooks/useSetup';

/**
 * Step 1 of 4 — "Onde queres receber os teus pedidos?", node 44:22383.
 *
 * Offers the three ways forward the board draws and nothing else. Declining is
 * one of them: the board's rule is that no permission blocks the account, so
 * "Agora não" is recorded as a real answer and the flow continues to step 3
 * rather than looping back here.
 */
export default function LocationChoiceStep() {
  const router = useRouter();
  const theme = useTheme();
  const { recordLocation } = useSetup();

  const handleSkip = async () => {
    await recordLocation('skipped');
    router.push('/(setup)/notifications');
  };

  return (
    <StepScreen step={setupStep.location}>
      <StepHeader title={locationChoice.title} description={locationChoice.description} />
      <Spacer />
      <LocationPanel />
      <Spacer />
      <ActionStack>
        <OnboardingAction
          label={locationChoice.useCurrent}
          icon={
            <OnboardingIcon
              source={icon.navigation}
              size={theme.onboarding.metrics.actionIconSize}
            />
          }
          onPress={() => router.push('/(setup)/location-permission')}
        />
        <OnboardingAction
          label={locationChoice.addAddress}
          tone="secondary"
          onPress={() => router.push('/(setup)/address')}
        />
        <OnboardingAction label={locationChoice.skip} tone="tertiary" onPress={handleSkip} />
      </ActionStack>
    </StepScreen>
  );
}
