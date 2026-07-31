import { Button } from '@/components/design-system/atoms';
import { PlaceholderScreen } from '@/components/PlaceholderScreen';
import { useOnboarding } from '@/hooks/useOnboarding';

export default function Onboarding() {
  const { completeOnboarding } = useOnboarding();

  return (
    <PlaceholderScreen label="Welcome">
      <Button onPress={completeOnboarding}>Get Started</Button>
    </PlaceholderScreen>
  );
}
