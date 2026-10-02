import { useCallback } from 'react';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useTabBarVisibility } from '@/hooks/useTabBarVisibility';
import { SearchScreen } from '../SearchScreen';

export type SearchRouteProps = {
  /**
   * Opens the results, in the stack the route belongs to. Passed in rather
   * than built here: Home and Discovery each push their own copy of these two
   * screens, so that searching from a tab stays inside it instead of throwing
   * the customer into another one.
   */
  onSubmit: (query: string) => void;
};

/**
 * Everything the focused search screen needs from the router, in one place —
 * both stacks mount this, so the behaviour cannot drift between them.
 */
export function SearchRoute({ onSubmit }: SearchRouteProps) {
  const router = useRouter();
  const { q } = useLocalSearchParams<{ q?: string }>();
  const { setIsTabBarHidden } = useTabBarVisibility();

  /*
    The board draws this screen without the tab bar (frame 48:20081): the
    keyboard is up and the screen has one job. Tied to focus rather than to
    mount so the bar comes back when the results screen pushes over this one,
    which is where the board does draw it (frame 48:20156).
  */
  useFocusEffect(
    useCallback(() => {
      setIsTabBarHidden(true);
      return () => setIsTabBarHidden(false);
    }, [setIsTabBarHidden])
  );

  return <SearchScreen initialQuery={q ?? ''} onBack={() => router.back()} onSubmit={onSubmit} />;
}
