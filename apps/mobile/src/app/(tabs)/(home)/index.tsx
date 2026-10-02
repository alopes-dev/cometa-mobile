import { useRouter } from 'expo-router';
import { HomeScreen } from '@/features/home/components/HomeScreen';

export default function Home() {
  const router = useRouter();

  return <HomeScreen onPressSearch={() => router.push('/(tabs)/(home)/search')} />;
}
