import { Stack } from 'expo-router';

/**
 * The sign-in flow — page "AUTHENTICATION" of the Figma file.
 *
 * One linear path: welcome → number → code, and then name only when the
 * verified number has no account yet. There is no separate sign-up branch
 * because the number is what distinguishes the two, and that is not known
 * until the code is confirmed.
 *
 * Nothing routes out of here on success. Opening a session flips
 * `isAuthenticated`, and the root navigator's `Stack.Protected` guards swap
 * this group for `(setup)` on the next render.
 */
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="phone" />
      <Stack.Screen name="otp" />
      <Stack.Screen name="name" />
    </Stack>
  );
}
