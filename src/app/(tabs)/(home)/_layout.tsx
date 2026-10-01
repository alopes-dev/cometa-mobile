import { Stack } from "expo-router";
import { HeroTransitionProvider } from "@/features/home/components/HeroTransition";

export default function HomeLayout() {
  return (
    <HeroTransitionProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </HeroTransitionProvider>
  );
}
