import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'cometa:hasSeenOnboarding';

export type UseOnboardingResult = {
  hasSeenOnboarding: boolean;
  isLoading: boolean;
  completeOnboarding: () => Promise<void>;
};

export function useOnboarding(): UseOnboardingResult {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        setHasSeenOnboarding(value === 'true');
        setIsLoading(false);
      })
      .catch(() => {
        // On storage failure, fall back to hasSeenOnboarding: false
        // to show onboarding instead of hanging the app
        setHasSeenOnboarding(false);
        setIsLoading(false);
      });
  }, []);

  const completeOnboarding = useCallback(async () => {
    await AsyncStorage.setItem(STORAGE_KEY, 'true');
    setHasSeenOnboarding(true);
  }, []);

  return { hasSeenOnboarding, isLoading, completeOnboarding };
}
