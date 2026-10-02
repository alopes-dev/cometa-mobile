import { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ActionStack,
  OnboardingAction,
  PermissionMessage,
  Spacer,
  StepScreen,
  icon,
  notifications as copy,
  requestNotifications,
  setupStep,
} from '@/features/onboarding';
import { useSetup } from '@/hooks/useSetup';

/**
 * Step 3 of 4 — "Queres receber atualizações dos teus pedidos?", node 44:22490.
 *
 * Same contract as the location step: the system dialog is raised from the
 * button, never on mount, and every outcome moves forward rather than blocking.
 */
export default function NotificationsStep() {
  const router = useRouter();
  const { recordNotifications } = useSetup();
  const [requesting, setRequesting] = useState(false);

  const handleAllow = async () => {
    setRequesting(true);
    await recordNotifications(await requestNotifications());
    setRequesting(false);
    router.push('/(setup)/preferences');
  };

  const handleSkip = async () => {
    await recordNotifications('skipped');
    router.push('/(setup)/preferences');
  };

  return (
    <StepScreen step={setupStep.notifications}>
      <Spacer />
      <PermissionMessage
        glyph={icon.bellRing}
        title={copy.title}
        description={copy.description}
      />
      <Spacer />
      <ActionStack>
        <OnboardingAction label={copy.allow} loading={requesting} onPress={handleAllow} />
        <OnboardingAction
          label={copy.skip}
          tone="tertiary"
          disabled={requesting}
          onPress={handleSkip}
        />
      </ActionStack>
    </StepScreen>
  );
}
