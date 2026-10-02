import { useLocalSearchParams, useRouter } from 'expo-router';
import { SearchResultsScreen } from '@/features/search/components/SearchResultsScreen';

export default function SearchResults() {
  const router = useRouter();
  const { q } = useLocalSearchParams<{ q?: string }>();
  const query = q ?? '';

  return (
    <SearchResultsScreen
      query={query}
      onBack={() => router.back()}
      // Back to the screen that takes a query, with this one loaded. `back`
      // rather than a push: the search screen is already underneath, and
      // pushing a second copy would put two of them in the stack.
      onEditQuery={() => router.back()}
    />
  );
}
