import { useRouter } from 'expo-router';
import { SearchRoute } from '@/features/search/components/SearchRoute';

export default function Search() {
  const router = useRouter();

  return (
    <SearchRoute
      onSubmit={(query) =>
        router.push({ pathname: '/(tabs)/(home)/search/results', params: { q: query } })
      }
    />
  );
}
