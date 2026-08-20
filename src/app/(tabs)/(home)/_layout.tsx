import { Stack } from 'expo-router';
import { HeroTransitionProvider } from '@/features/home/components/HeroTransition';

export default function HomeLayout() {
  return (
    <HeroTransitionProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        {/* Fade instead of slide-from-right — the ghost image morphing from the
            tapped card into the hero (see HeroTransitionProvider) reads as one
            continuous shape, which a directional slide would fight against. */}
        <Stack.Screen name="restaurant/[id]" options={{ headerShown: false, animation: 'fade' }} />
        {/* Fade instead of the default slide-from-right — closer to "the search
            bar continues into this screen" than an obvious screen swap (§7). */}
        <Stack.Screen name="search" options={{ headerShown: false, animation: 'fade' }} />
      </Stack>
    </HeroTransitionProvider>
  );
}
