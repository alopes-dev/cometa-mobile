import { Stack } from 'expo-router';
import { useTheme } from 'styled-components/native';

/**
 * The post-authentication setup — board "10 — Onboarding".
 *
 * A stack rather than a pager: these steps branch (the location choice leads to
 * the permission explainer, the address form, or straight past both), and the
 * address step draws its own back control, so each needs a real entry on the
 * history rather than a scroll offset.
 */
export default function SetupLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.onboarding.color.surfaceBackground },
      }}
    />
  );
}
