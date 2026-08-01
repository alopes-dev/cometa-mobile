import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import styled, { useTheme } from "styled-components/native";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { ThemeProvider } from "@/components/design-system/ThemeProvider";
import { AuthProvider } from "@/hooks/AuthProvider";
import { useAuth } from "@/hooks/useAuth";
import { OnboardingProvider } from "@/hooks/OnboardingProvider";
import { useOnboarding } from "@/hooks/useOnboarding";
import { TabBarVisibilityProvider } from "@/hooks/TabBarVisibilityProvider";

const Root = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore — the splash may have already hidden if a prior boot failed.
});

function Navigation({ hasSeenOnboarding }: { hasSeenOnboarding: boolean }) {
  const theme = useTheme();
  const { isAuthenticated } = useAuth();

  return (
    <Root>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Protected guard={!hasSeenOnboarding}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>
        <Stack.Protected guard={hasSeenOnboarding && !isAuthenticated}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        <Stack.Protected guard={hasSeenOnboarding && isAuthenticated}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
      </Stack>
    </Root>
  );
}

// Rendered inside both OnboardingProvider and AuthProvider so it can read
// both hooks' isLoading flags. Holds null until neither is loading, then
// mounts the rest of the tree (SafeAreaProvider + Navigation). This is the
// "wait before rendering" gate the design calls for once fonts are ready —
// it can't live in RootLayout because the providers it depends on are
// mounted BY RootLayout, so useAuth()/useOnboarding() aren't callable there.
function Gate({ onReady }: { onReady: () => void }) {
  const { hasSeenOnboarding, isLoading: onboardingLoading } = useOnboarding();
  const { isLoading: authLoading } = useAuth();
  const ready = !onboardingLoading && !authLoading;

  useEffect(() => {
    if (ready) onReady();
  }, [ready, onReady]);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <StatusBar hidden />
      <TabBarVisibilityProvider>
        <Navigation hasSeenOnboarding={hasSeenOnboarding} />
      </TabBarVisibilityProvider>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const fontsReady = fontsLoaded || fontError;

  // Gate only mounts once fontsReady is true (see the early return below),
  // so by the time its onReady fires, fonts are already resolved — this
  // callback is the single point where "everything is ready" becomes true.
  const handleReady = () => {
    SplashScreen.hideAsync().catch(() => {});
  };

  if (!fontsReady) return null;

  return (
    <ThemeProvider>
      <OnboardingProvider>
        <AuthProvider>
          <Gate onReady={handleReady} />
        </AuthProvider>
      </OnboardingProvider>
    </ThemeProvider>
  );
}
