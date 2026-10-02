import { Stack } from "expo-router";
import { HeroTransitionProvider } from "@/features/home/components/HeroTransition";

export default function HomeLayout() {
  return (
    <HeroTransitionProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        {/*
          Home pushes its own copy of the search screens rather than sending
          the customer to Discovery's: a tab that switches tabs under you loses
          the stack you were in, and the back gesture then leaves the app
          somewhere you never were. Both copies are the same two components.
        */}
        <Stack.Screen name="search/index" />
        <Stack.Screen name="search/results" />
      </Stack>
    </HeroTransitionProvider>
  );
}
