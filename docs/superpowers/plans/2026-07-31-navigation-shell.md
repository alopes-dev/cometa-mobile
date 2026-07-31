# Navigation Shell — Phase 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the app's navigation shell — onboarding, an auth gate, and a 4-tab main app — using placeholder screens only, gated with Expo Router's `Stack.Protected`.

**Architecture:** A root `Stack` in `src/app/_layout.tsx` wraps three `Stack.Protected` groups (`onboarding`, `(auth)`, `(tabs)`), gated by two hooks: `useOnboarding()` (AsyncStorage-backed) and `useAuth()` (in-memory `React.Context`, mock only). `(tabs)` uses `NativeTabs` with one nested `Stack` per tab (Home, Orders, Wallet, Profile). Every screen renders a shared `PlaceholderScreen` component — no real product content yet.

**Tech Stack:** Expo SDK 57, expo-router ~57.0.8 (`Stack.Protected`, `expo-router/unstable-native-tabs`), React Native 0.86, TypeScript, `styled-components/native`, `@react-native-async-storage/async-storage`, Jest + `jest-expo` + `@testing-library/react-native`. No new dependencies — everything used here is already installed.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-31-navigation-shell-design.md` — this plan implements it exactly; consult it for anything not repeated here.
- No real screen content anywhere — every screen renders just its name via the shared `PlaceholderScreen` component, plus (only where noted) one minimal `Button` that drives a state transition (`completeOnboarding`/`signIn`) so the gating flow is actually reachable end-to-end. No forms, lists, or business logic.
- Gating uses `Stack.Protected` (`guard: boolean` prop) exclusively — no manual `useEffect` + `router.replace` redirects.
- Tab bar is `NativeTabs` from `expo-router/unstable-native-tabs` (SDK 55+ syntax: `NativeTabs.Trigger`, `.Trigger.Icon`, `.Trigger.Label`) — not the legacy `Tabs` component.
- Tab tint color is `theme.colors.primary`, read via `useTheme()` from the existing `styled-components` `ThemeProvider` — no separate color source.
- Hooks live in `src/hooks/`. Shared placeholder UI lives in `src/components/`. Never co-locate components/hooks/tests inside `src/app/` — route files there are thin pass-throughs only.
- Path alias `@/*` → `./src/*` (already configured in `tsconfig.json`).
- `tsc --noEmit` and `npx jest` must be clean after every task.
- `typedRoutes` is enabled (`app.json`), so `tsc` validates route hrefs against `.expo/types/router.d.ts`, which is only regenerated when Expo scans `src/app/`. Whenever a task adds a new route file, run `npx expo export --platform ios --output-dir /tmp/cometa-export-check && rm -rf /tmp/cometa-export-check` **before** `npx tsc --noEmit`, so the new route's typed href exists before type-checking.
- Test files are colocated next to the file they test, named `<Name>.test.ts`/`.test.tsx` (matches existing `testMatch` in `package.json`). Route files under `src/app/` are the one exception — they're untested directly (see per-task notes); overall correctness is verified via `tsc` + `expo export` + one manual run-through in Task 8.

---

### Task 1: `useOnboarding` hook

**Files:**
- Create: `src/hooks/useOnboarding.ts`
- Create: `src/hooks/useOnboarding.test.ts`

**Interfaces:**
- Consumes: `AsyncStorage` from `@react-native-async-storage/async-storage` (already installed).
- Produces: `useOnboarding(): { hasSeenOnboarding: boolean; isLoading: boolean; completeOnboarding: () => Promise<void> }`. Used by Task 4 (onboarding screen) and Task 8 (root layout gating).

- [ ] **Step 1: Write the failing test**

`src/hooks/useOnboarding.test.ts`:

```ts
import { renderHook, waitFor, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useOnboarding } from './useOnboarding';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('useOnboarding', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('starts loading and resolves hasSeenOnboarding to false when nothing is stored', async () => {
    const { result } = renderHook(() => useOnboarding());
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.hasSeenOnboarding).toBe(false);
  });

  it('resolves hasSeenOnboarding to true when already stored', async () => {
    await AsyncStorage.setItem('cometa:hasSeenOnboarding', 'true');
    const { result } = renderHook(() => useOnboarding());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.hasSeenOnboarding).toBe(true);
  });

  it('completeOnboarding persists the flag and updates state', async () => {
    const { result } = renderHook(() => useOnboarding());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.completeOnboarding();
    });

    expect(result.current.hasSeenOnboarding).toBe(true);
    expect(await AsyncStorage.getItem('cometa:hasSeenOnboarding')).toBe('true');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/hooks/useOnboarding.test.ts`
Expected: FAIL — `Cannot find module './useOnboarding'`.

- [ ] **Step 3: Write `useOnboarding.ts`**

`src/hooks/useOnboarding.ts`:

```ts
import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'cometa:hasSeenOnboarding';

export type UseOnboardingResult = {
  hasSeenOnboarding: boolean;
  isLoading: boolean;
  completeOnboarding: () => Promise<void>;
};

export function useOnboarding(): UseOnboardingResult {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      setHasSeenOnboarding(value === 'true');
      setIsLoading(false);
    });
  }, []);

  const completeOnboarding = useCallback(async () => {
    await AsyncStorage.setItem(STORAGE_KEY, 'true');
    setHasSeenOnboarding(true);
  }, []);

  return { hasSeenOnboarding, isLoading, completeOnboarding };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/hooks/useOnboarding.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Verify types**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useOnboarding.ts src/hooks/useOnboarding.test.ts
git commit -m "feat(navigation): add useOnboarding hook"
```

---

### Task 2: `AuthProvider` and `useAuth` hook

**Files:**
- Create: `src/hooks/AuthProvider.tsx`
- Create: `src/hooks/useAuth.ts`
- Create: `src/hooks/useAuth.test.tsx`

**Interfaces:**
- Consumes: nothing (in-memory mock only — no backend, no persistence).
- Produces: `AuthProvider` (React component, wraps children); `useAuth(): { isAuthenticated: boolean; isLoading: boolean; signIn: () => void; signOut: () => void }`. Used by Task 5 (login screen) and Task 8 (root layout gating). `isLoading` is always `false` here (mock has no async work) — kept in the shape so a future real-auth implementation is a drop-in replacement.

- [ ] **Step 1: Write the failing test**

`src/hooks/useAuth.test.tsx`:

```tsx
import type { ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { AuthProvider } from './AuthProvider';
import { useAuth } from './useAuth';

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('useAuth', () => {
  it('starts signed out and not loading', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('signIn sets isAuthenticated to true', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    act(() => result.current.signIn());
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('signOut sets isAuthenticated back to false', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    act(() => result.current.signIn());
    act(() => result.current.signOut());
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('throws when used outside an AuthProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth must be used within an AuthProvider'
    );
    consoleError.mockRestore();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/hooks/useAuth.test.tsx`
Expected: FAIL — `Cannot find module './AuthProvider'`.

- [ ] **Step 3: Write `AuthProvider.tsx`**

`src/hooks/AuthProvider.tsx`:

```tsx
import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';

export type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: () => void;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signIn = useCallback(() => setIsAuthenticated(true), []);
  const signOut = useCallback(() => setIsAuthenticated(false), []);

  const value = useMemo<AuthContextValue>(
    () => ({ isAuthenticated, isLoading: false, signIn, signOut }),
    [isAuthenticated, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

- [ ] **Step 4: Write `useAuth.ts`**

`src/hooks/useAuth.ts`:

```ts
import { useContext } from 'react';
import { AuthContext, type AuthContextValue } from './AuthProvider';

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx jest src/hooks/useAuth.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 6: Verify types**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 7: Commit**

```bash
git add src/hooks/AuthProvider.tsx src/hooks/useAuth.ts src/hooks/useAuth.test.tsx
git commit -m "feat(navigation): add mock AuthProvider and useAuth hook"
```

---

### Task 3: `PlaceholderScreen` shared component

**Files:**
- Create: `src/components/PlaceholderScreen.tsx`
- Create: `src/components/PlaceholderScreen.test.tsx`

**Interfaces:**
- Consumes: `Text` from `@/design-system/atoms` (Phase 2).
- Produces: `PlaceholderScreen({ label: string; children?: ReactNode })`. Used by every route in Tasks 4–6. `children` is for the one-off navigation-driving `Button` (onboarding "Get Started", login "Log In") — most call sites pass none.

- [ ] **Step 1: Write the test**

`src/components/PlaceholderScreen.test.tsx`:

```tsx
import { Text as RNText } from 'react-native';
import { render } from '@testing-library/react-native';
import { PlaceholderScreen } from './PlaceholderScreen';
import { ThemeProvider } from '@/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('PlaceholderScreen', () => {
  it('renders the given label', () => {
    const { getByText } = renderWithTheme(<PlaceholderScreen label="Home" />);
    expect(getByText('Home')).toBeTruthy();
  });

  it('renders optional children below the label', () => {
    const { getByText } = renderWithTheme(
      <PlaceholderScreen label="Welcome">
        <RNText>Get Started</RNText>
      </PlaceholderScreen>
    );
    expect(getByText('Get Started')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/components/PlaceholderScreen.test.tsx`
Expected: FAIL — `Cannot find module './PlaceholderScreen'`.

- [ ] **Step 3: Write `PlaceholderScreen.tsx`**

`src/components/PlaceholderScreen.tsx`:

```tsx
import type { ReactNode } from 'react';
import styled from 'styled-components/native';
import { Text } from '@/design-system/atoms';

export type PlaceholderScreenProps = {
  label: string;
  children?: ReactNode;
};

const Screen = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 24px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export function PlaceholderScreen({ label, children }: PlaceholderScreenProps) {
  return (
    <Screen>
      <Text variant="headlineMobile">{label}</Text>
      {children}
    </Screen>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/components/PlaceholderScreen.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Verify types**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 6: Commit**

```bash
git add src/components/PlaceholderScreen.tsx src/components/PlaceholderScreen.test.tsx
git commit -m "feat(navigation): add shared PlaceholderScreen component"
```

---

### Task 4: Onboarding route

**Files:**
- Create: `src/app/onboarding.tsx`

**Interfaces:**
- Consumes: `useOnboarding` (Task 1), `PlaceholderScreen` (Task 3), `Button` from `@/design-system/atoms` (Phase 2).
- Produces: the `/onboarding` route. Consumed by Task 8's `Stack.Protected` gating.

- [ ] **Step 1: Write `onboarding.tsx`**

`src/app/onboarding.tsx`:

```tsx
import { Button } from '@/design-system/atoms';
import { PlaceholderScreen } from '@/components/PlaceholderScreen';
import { useOnboarding } from '@/hooks/useOnboarding';

export default function Onboarding() {
  const { completeOnboarding } = useOnboarding();

  return (
    <PlaceholderScreen label="Welcome">
      <Button onPress={completeOnboarding}>Get Started</Button>
    </PlaceholderScreen>
  );
}
```

- [ ] **Step 2: Regenerate typed routes and verify the bundle**

Run: `npx expo export --platform ios --output-dir /tmp/cometa-export-check && rm -rf /tmp/cometa-export-check`
Expected: exports successfully (this also regenerates `.expo/types/router.d.ts` to include `/onboarding`).

- [ ] **Step 3: Verify types**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 4: Commit**

```bash
git add src/app/onboarding.tsx
git commit -m "feat(navigation): add onboarding placeholder route"
```

---

### Task 5: Auth stack

**Files:**
- Create: `src/app/(auth)/_layout.tsx`
- Create: `src/app/(auth)/login.tsx`
- Create: `src/app/(auth)/signup.tsx`

**Interfaces:**
- Consumes: `useAuth` (Task 2), `PlaceholderScreen` (Task 3), `Button` from `@/design-system/atoms`, `useRouter` from `expo-router`.
- Produces: the `(auth)` route group (`/login`, `/signup`). Consumed by Task 8's `Stack.Protected` gating.

- [ ] **Step 1: Write `(auth)/_layout.tsx`**

`src/app/(auth)/_layout.tsx`:

```tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}
```

- [ ] **Step 2: Write `(auth)/login.tsx`**

`src/app/(auth)/login.tsx`:

```tsx
import { Button } from '@/design-system/atoms';
import { PlaceholderScreen } from '@/components/PlaceholderScreen';
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const { signIn } = useAuth();

  return (
    <PlaceholderScreen label="Login">
      <Button onPress={signIn}>Log In</Button>
    </PlaceholderScreen>
  );
}
```

- [ ] **Step 3: Write `(auth)/signup.tsx`**

`src/app/(auth)/signup.tsx`:

```tsx
import { useRouter } from 'expo-router';
import { Button } from '@/design-system/atoms';
import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function Signup() {
  const router = useRouter();

  return (
    <PlaceholderScreen label="Sign Up">
      <Button variant="text" onPress={() => router.push('/login')}>
        Already have an account? Log in
      </Button>
    </PlaceholderScreen>
  );
}
```

- [ ] **Step 4: Regenerate typed routes and verify the bundle**

Run: `npx expo export --platform ios --output-dir /tmp/cometa-export-check && rm -rf /tmp/cometa-export-check`
Expected: exports successfully (regenerates `.expo/types/router.d.ts` to include `/login` and `/signup`).

- [ ] **Step 5: Verify types**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 6: Commit**

```bash
git add "src/app/(auth)"
git commit -m "feat(navigation): add auth stack (login, signup placeholders)"
```

---

### Task 6: Tab route placeholders (Home, Orders, Wallet, Profile)

**Files:**
- Create: `src/app/(tabs)/(home)/_layout.tsx`
- Create: `src/app/(tabs)/(home)/index.tsx`
- Create: `src/app/(tabs)/(orders)/_layout.tsx`
- Create: `src/app/(tabs)/(orders)/index.tsx`
- Create: `src/app/(tabs)/(wallet)/_layout.tsx`
- Create: `src/app/(tabs)/(wallet)/index.tsx`
- Create: `src/app/(tabs)/(profile)/_layout.tsx`
- Create: `src/app/(tabs)/(profile)/index.tsx`

**Interfaces:**
- Consumes: `PlaceholderScreen` (Task 3).
- Produces: the four tab route groups (`(home)`, `(orders)`, `(wallet)`, `(profile)`), each with its own `Stack` and one `index` screen. Consumed by Task 7's `NativeTabs` triggers (the `name` prop on each `NativeTabs.Trigger` must match these exact folder names).

- [ ] **Step 1: Write `(tabs)/(home)/_layout.tsx`**

```tsx
import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
```

- [ ] **Step 2: Write `(tabs)/(home)/index.tsx`**

```tsx
import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function Home() {
  return <PlaceholderScreen label="Home" />;
}
```

- [ ] **Step 3: Write `(tabs)/(orders)/_layout.tsx`**

```tsx
import { Stack } from 'expo-router';

export default function OrdersLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
```

- [ ] **Step 4: Write `(tabs)/(orders)/index.tsx`**

```tsx
import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function Orders() {
  return <PlaceholderScreen label="Orders" />;
}
```

- [ ] **Step 5: Write `(tabs)/(wallet)/_layout.tsx`**

```tsx
import { Stack } from 'expo-router';

export default function WalletLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
```

- [ ] **Step 6: Write `(tabs)/(wallet)/index.tsx`**

```tsx
import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function Wallet() {
  return <PlaceholderScreen label="Wallet" />;
}
```

- [ ] **Step 7: Write `(tabs)/(profile)/_layout.tsx`**

```tsx
import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
```

- [ ] **Step 8: Write `(tabs)/(profile)/index.tsx`**

```tsx
import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function Profile() {
  return <PlaceholderScreen label="Profile" />;
}
```

- [ ] **Step 9: Regenerate typed routes and verify the bundle**

Run: `npx expo export --platform ios --output-dir /tmp/cometa-export-check && rm -rf /tmp/cometa-export-check`
Expected: exports successfully.

- [ ] **Step 10: Verify types**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 11: Commit**

```bash
git add "src/app/(tabs)/(home)" "src/app/(tabs)/(orders)" "src/app/(tabs)/(wallet)" "src/app/(tabs)/(profile)"
git commit -m "feat(navigation): add Home, Orders, Wallet, Profile tab placeholders"
```

---

### Task 7: Tabs navigator

**Files:**
- Create: `src/app/(tabs)/_layout.tsx`

**Interfaces:**
- Consumes: the four route groups from Task 6 (`(home)`, `(orders)`, `(wallet)`, `(profile)`); `useTheme` from `styled-components/native`.
- Produces: the `(tabs)` route group's `NativeTabs` navigator. Consumed by Task 8's `Stack.Protected` gating (`<Stack.Screen name="(tabs)" />`).

- [ ] **Step 1: Write `(tabs)/_layout.tsx`**

`src/app/(tabs)/_layout.tsx`:

```tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useTheme } from 'styled-components/native';

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <NativeTabs tintColor={theme.colors.primary}>
      <NativeTabs.Trigger name="(home)">
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(orders)">
        <NativeTabs.Trigger.Icon sf="bag.fill" md="shopping_bag" />
        <NativeTabs.Trigger.Label>Orders</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(wallet)">
        <NativeTabs.Trigger.Icon sf="creditcard.fill" md="credit_card" />
        <NativeTabs.Trigger.Label>Wallet</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(profile)">
        <NativeTabs.Trigger.Icon sf="person.fill" md="person" />
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

- [ ] **Step 2: Regenerate typed routes and verify the bundle**

Run: `npx expo export --platform ios --output-dir /tmp/cometa-export-check && rm -rf /tmp/cometa-export-check`
Expected: exports successfully.

- [ ] **Step 3: Verify types**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 4: Commit**

```bash
git add "src/app/(tabs)/_layout.tsx"
git commit -m "feat(navigation): add NativeTabs navigator for the main app shell"
```

---

### Task 8: Root layout gating

**Files:**
- Modify: `src/app/_layout.tsx`
- Delete: `src/app/index.tsx` (its route conflicts with the new `(tabs)/(home)/index.tsx`, which now serves `/`)

**Interfaces:**
- Consumes: `ThemeProvider` (existing), `AuthProvider`/`useAuth` (Task 2), `useOnboarding` (Task 1), `Stack.Protected` from `expo-router`.
- Produces: nothing for later tasks — this is the final integration point that makes the whole shell navigable.

- [ ] **Step 1: Check git status of the existing `index.tsx`**

Run: `git status src/app/index.tsx`

This file currently has uncommitted local changes (an atoms showcase screen used to manually verify Phase 2). This task replaces its route, so preserve that work in history first rather than discarding it.

- [ ] **Step 2: Snapshot the existing `index.tsx` before replacing it**

```bash
git add src/app/index.tsx
git commit -m "chore: snapshot atoms showcase screen before navigation shell restructure"
```

- [ ] **Step 3: Delete `index.tsx`**

```bash
rm src/app/index.tsx
```

Home now lives at `src/app/(tabs)/(home)/index.tsx` (Task 6), which resolves to the same `/` route once a user is authenticated.

- [ ] **Step 4: Rewrite `_layout.tsx` to gate onboarding → auth → tabs**

`src/app/_layout.tsx`:

```tsx
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
import { ThemeProvider } from "@/design-system/ThemeProvider";
import { AuthProvider } from "@/hooks/AuthProvider";
import { useAuth } from "@/hooks/useAuth";
import { useOnboarding } from "@/hooks/useOnboarding";

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

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const { hasSeenOnboarding, isLoading: onboardingLoading } = useOnboarding();

  useEffect(() => {
    if ((fontsLoaded || fontError) && !onboardingLoading) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError, onboardingLoading]);

  if ((!fontsLoaded && !fontError) || onboardingLoading) return null;

  return (
    <ThemeProvider>
      <AuthProvider>
        <SafeAreaProvider>
          <StatusBar hidden />
          <Navigation hasSeenOnboarding={hasSeenOnboarding} />
        </SafeAreaProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
```

(`useOnboarding` is called once, in `RootLayout`, and its resolved `hasSeenOnboarding` is passed down as a prop — `Navigation` only reads `useAuth()` itself, since that hook's `isLoading` is always `false` and needs no gating.)

- [ ] **Step 5: Verify types**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 6: Verify the bundle still exports**

Run: `npx expo export --platform ios --output-dir /tmp/cometa-export-check && rm -rf /tmp/cometa-export-check`
Expected: exports successfully.

- [ ] **Step 7: Run the full test suite**

Run: `npx jest`
Expected: all suites pass (existing atom/theme suites + the new hook and `PlaceholderScreen` suites from Tasks 1–3).

- [ ] **Step 8: Manually verify the full gating flow**

Run `npx expo start`, open in the iOS simulator, and confirm:
1. App boots straight to the "Welcome" onboarding screen with a "Get Started" button.
2. Tapping "Get Started" navigates to the "Login" placeholder (onboarding is complete, not yet authenticated).
3. Tapping "Log In" navigates into the main app, landing on the "Home" tab with a 4-tab bar (Home, Orders, Wallet, Profile) visible at the bottom.
4. Tapping each tab shows that tab's own placeholder label.
5. Reload the app (press `r` in the Metro terminal). Confirm it skips onboarding this time (persisted via AsyncStorage) but lands back on "Login" (auth state is in-memory only and resets on reload) — this confirms the two gates are independent, as designed.

- [ ] **Step 9: Commit**

```bash
git add src/app/_layout.tsx
git rm src/app/index.tsx
git commit -m "feat(navigation): gate app with onboarding -> auth -> tabs via Stack.Protected"
```
