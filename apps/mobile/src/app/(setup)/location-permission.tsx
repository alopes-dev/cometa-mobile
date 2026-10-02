import { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ActionStack,
  OnboardingAction,
  PermissionMessage,
  Spacer,
  StepScreen,
  icon,
  locationPermission,
  requestLocation,
} from '@/features/onboarding';
import { useSetup } from '@/hooks/useSetup';

/**
 * The location pre-permission explainer — node 44:22414.
 *
 * Carries no progress bar, as drawn: it sits between steps 1 and 2 as context
 * for the system dialog rather than as a step of its own. The dialog is raised
 * only from the button, never on mount, so the reason is on screen before
 * anything is asked — which is the whole point of the screen existing.
 *
 * Every outcome moves forward. A grant has the delivery location covered, so it
 * goes on to notifications; anything else routes to the address form, which is
 * how you say where you are without granting location.
 */
export default function LocationPermissionStep() {
  const router = useRouter();
  const { recordLocation } = useSetup();
  const [requesting, setRequesting] = useState(false);

  const handleAllow = async () => {
    setRequesting(true);
    const outcome = await requestLocation();
    await recordLocation(outcome);
    setRequesting(false);
    router.push(outcome === 'granted' ? '/(setup)/notifications' : '/(setup)/address');
  };

  const handleSkip = async () => {
    await recordLocation('skipped');
    router.push('/(setup)/address');
  };

  return (
    <StepScreen>
      <Spacer />
      <PermissionMessage
        glyph={icon.locateFixed}
        title={locationPermission.title}
        description={locationPermission.description}
      />
      <Spacer />
      <ActionStack>
        <OnboardingAction
          label={locationPermission.allow}
          loading={requesting}
          onPress={handleAllow}
        />
        <OnboardingAction
          label={locationPermission.skip}
          tone="tertiary"
          disabled={requesting}
          onPress={handleSkip}
        />
      </ActionStack>
    </StepScreen>
  );
}
