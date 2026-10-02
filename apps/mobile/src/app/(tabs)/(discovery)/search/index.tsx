import { useCallback } from 'react';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { SearchScreen } from '@/features/search/components/SearchScreen';
import { useTabBarVisibility } from '@/hooks/useTabBarVisibility';

export default function Search() {
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

  return (
    <SearchScreen
      initialQuery={q ?? ''}
      onBack={() => router.back()}
      onSubmit={(query) =>
        router.push({ pathname: '/(tabs)/(discovery)/search/results', params: { q: query } })
      }
    />
  );
}
