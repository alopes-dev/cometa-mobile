import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'cometa:hasSeenOnboarding';

export type OnboardingContextValue = {
  hasSeenOnboarding: boolean;
  isLoading: boolean;
  completeOnboarding: () => Promise<void>;
};

export const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
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
    try {
      await AsyncStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // On storage failure, swallow it and keep going — the already-resolved
      // local state below is fine even if persistence failed; the user just
      // won't skip onboarding next launch, which is an acceptable degradation.
    }
    setHasSeenOnboarding(true);
  }, []);

  const value = useMemo<OnboardingContextValue>(
    () => ({ hasSeenOnboarding, isLoading, completeOnboarding }),
    [hasSeenOnboarding, isLoading, completeOnboarding]
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}
