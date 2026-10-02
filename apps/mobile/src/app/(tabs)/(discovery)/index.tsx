import { useRouter } from 'expo-router';
import { DiscoveryScreen } from '@/features/discovery/components/DiscoveryScreen';

export default function Discovery() {
  const router = useRouter();

  return <DiscoveryScreen onPressSearch={() => router.push('/(tabs)/(discovery)/search')} />;
}
