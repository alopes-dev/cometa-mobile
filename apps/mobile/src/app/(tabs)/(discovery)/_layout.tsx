import { Stack } from 'expo-router';

export default function DiscoveryLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      {/*
        Search lives in Discovery's stack because that is where the board
        enters it (node 48:20261), and because a route under `(tabs)` with no
        trigger of its own is a navigator error. Both screens keep the native
        push, so the edge swipe goes back the way iOS expects.
      */}
      <Stack.Screen name="search/index" />
      <Stack.Screen name="search/results" />
    </Stack>
  );
}
