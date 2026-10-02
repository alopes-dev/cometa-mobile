import { useLocalSearchParams, useRouter } from 'expo-router';
import { SearchResultsScreen } from '../SearchResultsScreen';

/**
 * The results screen's router wiring, shared by both stacks.
 *
 * Takes no destination, unlike `SearchRoute`: everything it does goes back,
 * and back is wherever it was pushed from.
 */
export function SearchResultsRoute() {
  const router = useRouter();
  const { q } = useLocalSearchParams<{ q?: string }>();

  return (
    <SearchResultsScreen
      query={q ?? ''}
      onBack={() => router.back()}
      // Back to the screen that takes a query, with this one still in it.
      // `back` rather than a push: the search screen is already underneath,
      // and pushing a second copy would put two of them in the stack.
      onEditQuery={() => router.back()}
    />
  );
}
