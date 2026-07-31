# Navigation Shell — Phase 3 Design

**Goal:** Stand up the app's navigation shell — route structure, onboarding/auth gating, and a 4-tab main app bar — with placeholder screens only. Real screen content (Home feed, checkout, tracking, etc.) is out of scope and comes in later phases.

**Status:** Phase 1 (design tokens) and Phase 2 (atoms) are complete. This is the first phase to touch `src/app/` routing beyond the single `index.tsx` screen.

## Scope

In scope:
- Route tree: onboarding → auth → main tabs, gated with Expo Router's `Stack.Protected`.
- A placeholder onboarding screen, gated by an AsyncStorage flag.
- Placeholder login/signup screens under an `(auth)` group.
- A 4-tab main app shell (Home, Orders, Wallet, Profile) using `NativeTabs`, each tab with its own nested `Stack` and one placeholder index screen.
- Two small mock hooks (`useOnboarding`, `useAuth`) that back the gating logic — no real backend/session integration.
- Unit tests for the two hooks and smoke-render tests for each placeholder screen.

Out of scope (future phases):
- Real screen content (product browsing, cart, checkout, order tracking, wallet, profile settings).
- Real authentication (backend calls, token storage, session refresh).
- Deep linking configuration beyond what Expo Router provides by default.
- Navigation-transition/integration tests (tapping through `Stack.Protected` boundaries) — needs test harness work not yet in this repo.

## Route tree

```
src/app/
  _layout.tsx              — root Stack with Stack.Protected gating; wraps AuthProvider + existing ThemeProvider
  onboarding.tsx            — placeholder "welcome" screen
  (auth)/
    _layout.tsx             — Stack
    login.tsx               — placeholder
    signup.tsx              — placeholder
  (tabs)/
    _layout.tsx             — NativeTabs (Home, Orders, Wallet, Profile)
    (home)/
      _layout.tsx           — Stack
      index.tsx             — placeholder
    (orders)/
      _layout.tsx           — Stack
      index.tsx             — placeholder
    (wallet)/
      _layout.tsx           — Stack
      index.tsx             — placeholder
    (profile)/
      _layout.tsx           — Stack
      index.tsx             — placeholder
```

Every route file is kebab-case/single-word per Expo Router conventions. No components, types, or utilities are co-located in `src/app/` — hooks live in `src/hooks/`.

## Gating mechanism

Uses Expo Router's `Stack.Protected` (the SDK 53+ recommended pattern for conditional routes — avoids manual `useEffect` + `router.replace` redirect juggling):

```tsx
<Stack>
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
```

Two hooks back this state, both mock/placeholder:

- **`useOnboarding()`** (`src/hooks/useOnboarding.ts`) — reads/writes a `hasSeenOnboarding` boolean via `@react-native-async-storage/async-storage`. Exposes `{ hasSeenOnboarding, isLoading, completeOnboarding }`.
- **`useAuth()`** (`src/hooks/useAuth.ts` + `src/hooks/AuthProvider.tsx`) — in-memory React Context (no persistence, no backend). Exposes `{ isAuthenticated, isLoading, signIn, signOut }`. `signIn`/`signOut` just flip the in-memory flag — real session logic is a future phase.

The root layout holds `null` until fonts, `useOnboarding`, and `useAuth` have all resolved (`isLoading` false) — same "wait before rendering" pattern the existing `_layout.tsx` already uses for font loading — so there's no flash of the wrong screen on boot.

## Tab bar

`NativeTabs` from `expo-router/unstable-native-tabs` (SDK 55+ component syntax — `NativeTabs.Trigger.Icon`/`.Label`, matches the installed `expo-router ~57.0.8`). Gets native iOS 26 liquid-glass / Material 3 bottom nav automatically, satisfying the DESIGN-SYSTEM.md glassmorphism requirement for tab bars without a hand-rolled `BlurView`. Each tab nests its own `Stack` so it has an independent header and back-stack, per Expo Router's tabs-with-stacks convention.

| Tab | Route | SF Symbol | Material (`md`) |
|---|---|---|---|
| Home | `(home)` | `house.fill` | `home` |
| Orders | `(orders)` | `bag.fill` | `shopping_bag` |
| Wallet | `(wallet)` | `creditcard.fill` | `credit_card` |
| Profile | `(profile)` | `person.fill` | `person` |

Tint color is `theme.colors.primary`, read via `useTheme()` from the existing `styled-components` `ThemeProvider` (same theme source the atoms already use — no separate color source for navigation).

## Placeholder screens

Every route (`onboarding`, `login`, `signup`, and the 4 tab `index.tsx` files) renders a centered `Text` atom naming the screen (e.g. "Home", "Login") on a themed `Screen` background — the same minimal styled-components pattern the current `src/app/index.tsx` uses, built from the Phase 2 atoms (`Text`, themed `styled.View`). No forms, lists, or real content.

## Testing

Per the repo's existing TDD/colocated-test convention:

- `useOnboarding` and `useAuth` — unit tests for their state transitions (`useOnboarding.test.ts`, `useAuth.test.ts`), mocking `AsyncStorage` where needed.
- Each placeholder screen — smoke-render test: renders without crashing and shows the expected screen name text.
- Full `tsc --noEmit` and `npx jest` must stay clean, matching the existing plan convention.
- Out of scope: integration tests that navigate across `Stack.Protected` boundaries (tapping from onboarding → auth → tabs) — this repo doesn't yet have the `react-navigation`/`jest-expo` test harness setup that would require, and building that harness is not part of this phase.

## Open questions / risks

None — all prior open questions (phase scope, tab set, auth gate, onboarding) were resolved during brainstorming.
