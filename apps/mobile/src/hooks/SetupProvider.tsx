import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  emptySetupState,
  type DeliveryAddress,
  type PermissionOutcome,
  type SetupState,
} from '@/features/onboarding/types';

const COMPLETED_KEY = 'cometa:hasCompletedSetup';
const STATE_KEY = 'cometa:setupState';

export type SetupContextValue = SetupState & {
  hasCompletedSetup: boolean;
  isLoading: boolean;
  saveAddress: (address: DeliveryAddress) => Promise<void>;
  saveCategories: (categories: readonly string[]) => Promise<void>;
  recordLocation: (outcome: PermissionOutcome) => Promise<void>;
  recordNotifications: (outcome: PermissionOutcome) => Promise<void>;
  completeSetup: () => Promise<void>;
};

export const SetupContext = createContext<SetupContextValue | null>(null);

/**
 * The post-authentication setup from board "10 — Onboarding": the address,
 * taste categories and the two permission answers.
 *
 * Kept separate from `OnboardingProvider` because the two run at different
 * points in the app's life and must be able to disagree. The board says so
 * outright — "Localização, endereço, notificações e preferências surgem apenas
 * quando a identidade já está confirmada" — so a user who has seen the brand
 * onboarding but not yet signed in has finished one and not started the other.
 * One shared flag would either send a returning signed-in user back through the
 * value slides, or drop a new signed-in user straight past setup.
 *
 * Storage failures degrade the way `OnboardingProvider` degrades: in-memory
 * state still advances so the user is never stuck, and the worst case is being
 * asked again next launch.
 */
export function SetupProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SetupState>(emptySetupState);
  const [hasCompletedSetup, setHasCompletedSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([AsyncStorage.getItem(COMPLETED_KEY), AsyncStorage.getItem(STATE_KEY)])
      .then(([completed, stored]) => {
        setHasCompletedSetup(completed === 'true');
        if (stored) {
          // A malformed blob is treated as no blob: the setup is re-collected
          // rather than crashing the gate every signed-in launch passes through.
          try {
            setState({ ...emptySetupState, ...(JSON.parse(stored) as Partial<SetupState>) });
          } catch {
            setState(emptySetupState);
          }
        }
      })
      .catch(() => {
        setHasCompletedSetup(false);
        setState(emptySetupState);
      })
      .finally(() => setIsLoading(false));
  }, []);

  /**
   * Writes one patch to both memory and storage.
   *
   * Takes the current `state` from the closure rather than a ref: every caller
   * is a button press at the end of a step, not a keystroke — the address form
   * holds its own draft and submits once — so the identity churn this costs is
   * never on a hot path.
   */
  const persist = useCallback(
    async (patch: Partial<SetupState>) => {
      const next = { ...state, ...patch };
      setState(next);
      try {
        await AsyncStorage.setItem(STATE_KEY, JSON.stringify(next));
      } catch {
        // See the class note: local state has already advanced.
      }
    },
    [state]
  );

  const saveAddress = useCallback(
    (address: DeliveryAddress) => persist({ address }),
    [persist]
  );

  const saveCategories = useCallback(
    (categories: readonly string[]) => persist({ categories }),
    [persist]
  );

  const recordLocation = useCallback(
    (location: PermissionOutcome) => persist({ location }),
    [persist]
  );

  const recordNotifications = useCallback(
    (notifications: PermissionOutcome) => persist({ notifications }),
    [persist]
  );

  const completeSetup = useCallback(async () => {
    try {
      await AsyncStorage.setItem(COMPLETED_KEY, 'true');
    } catch {
      // See the class note.
    }
    setHasCompletedSetup(true);
  }, []);

  const value = useMemo<SetupContextValue>(
    () => ({
      ...state,
      hasCompletedSetup,
      isLoading,
      saveAddress,
      saveCategories,
      recordLocation,
      recordNotifications,
      completeSetup,
    }),
    [
      state,
      hasCompletedSetup,
      isLoading,
      saveAddress,
      saveCategories,
      recordLocation,
      recordNotifications,
      completeSetup,
    ]
  );

  return <SetupContext.Provider value={value}>{children}</SetupContext.Provider>;
}
