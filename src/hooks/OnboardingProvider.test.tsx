import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Pressable } from 'react-native';
import { OnboardingProvider } from './OnboardingProvider';
import { useOnboarding } from './useOnboarding';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Simulates the root layout's gate, which only reads hasSeenOnboarding.
function GateConsumer() {
  const { hasSeenOnboarding, isLoading } = useOnboarding();
  if (isLoading) return <Text testID="gate-value">loading</Text>;
  return <Text testID="gate-value">{String(hasSeenOnboarding)}</Text>;
}

// Simulates the onboarding screen, which completes onboarding.
function ScreenConsumer() {
  const { completeOnboarding } = useOnboarding();
  return (
    <Pressable testID="get-started" onPress={() => completeOnboarding()}>
      <Text>Get Started</Text>
    </Pressable>
  );
}

describe('OnboardingProvider', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('shares state across two separate consumers, so completing onboarding in one updates the other', async () => {
    const { getByTestId } = render(
      <OnboardingProvider>
        <GateConsumer />
        <ScreenConsumer />
      </OnboardingProvider>
    );

    await waitFor(() => expect(getByTestId('gate-value').props.children).toBe('false'));

    fireEvent.press(getByTestId('get-started'));

    // The gate consumer — a completely separate component instance — must
    // observe the same update, proving the state lives in one shared
    // provider instance rather than being duplicated per-hook-call.
    await waitFor(() => expect(getByTestId('gate-value').props.children).toBe('true'));
  });
});
