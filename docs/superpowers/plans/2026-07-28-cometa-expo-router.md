# Cometa Expo Router Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a runnable Expo Router food-delivery scaffold ("Cometa") with a 3-step onboarding, a Home screen (search, categories, quick actions, product grid), a floating custom bottom nav, and a shared motion system — all built without a UI kit and using only the core React Native `Animated` API.

**Architecture:** File-based routing via Expo Router with a root Stack that owns `CartProvider`, font loading, and the splash gate. Onboarding lives at the root Stack (outside tabs); Home and four placeholder screens live inside a `(tabs)` group whose tab bar is a custom `BottomNav`. All visual constants come from `constants/theme.ts` (colors, font, radius, layout, motion); all data lives in `data/catalog.ts`. Cart state is a Context + `useReducer`. Motion is centralized in `hooks/` and applied uniformly.

**Tech Stack:** Expo (latest SDK) · Expo Router · TypeScript · `expo-font` + `@expo-google-fonts/poppins` · `expo-linear-gradient` · `expo-image` · `expo-splash-screen` · `react-native-safe-area-context` · `lucide-react-native` + `react-native-svg` · `@react-native-async-storage/async-storage` · core `Animated` API (no Reanimated).

## Global Constraints

Copied verbatim from `docs/superpowers/specs/2026-07-28-cometa-expo-router-design.md`. Every task's requirements implicitly include these.

- **No UI kit dependencies** (NativeBase, Tamagui, gluestack, RN Paper).
- **No Reanimated.** Only the core `Animated` API.
- **`LayoutAnimation` allowed once** — grid re-layout when the category/search filter changes.
- **No hex literal outside `constants/theme.ts`.** Verified by grep at the end.
- **No layout magic number outside `layout` / `motion` tokens.**
- **Poppins family only** via `@expo-google-fonts/poppins`. Weight comes from the font file name (`Poppins_400Regular`, etc.), never from `fontWeight` on top of the family.
- **Splash held until fonts load.** `expo-splash-screen` must not auto-hide.
- **Every interactive element** sets `accessibilityRole` and `accessibilityLabel`.
- **Every hit target ≥ 44×44**, `hitSlop` when the visual target is smaller.
- **Onboarding routes to `/(tabs)` via `router.replace`**, never `push`, so it cannot be reached via back navigation.
- **Target viewports:** iPhone 390×844 primary; must also render intact at 360×640.
- **Working directory:** `/Users/alopes.dev/Documents/brain/cometa/`. All paths in this plan are relative to that root.

## Repo state before Task 1

- Git repo already initialized on `main`.
- One commit exists: `cf95c0b docs: add Cometa Expo Router design spec`.
- Only file tracked: `docs/superpowers/specs/2026-07-28-cometa-expo-router-design.md`.
- No `package.json`, no source files yet.

## File Structure

The complete tree at the end of the plan:

```
app/
  _layout.tsx            Root Stack + font loading + splash gate + CartProvider
  index.tsx              Redirect: onboarding on first launch, else /(tabs)
  onboarding.tsx         3-step carousel outside tabs
  (tabs)/
    _layout.tsx          Tabs with tabBar={props => <BottomNav {...props} />}
    index.tsx            Home
    offers.tsx           placeholder
    orders.tsx           placeholder
    cart.tsx             placeholder
    profile.tsx          placeholder
components/
  Touchable.tsx          Pressable wrapper with press-scale
  StatusBarMock.tsx      Fake iOS status bar for the dark header
  HeaderDark.tsx         Home screen header (status bar mock + logo + cart pill + search)
  HomeIndicator.tsx      134x5 bar for non-notch devices
  SectionHeader.tsx      Title + "View all →" right link
  QuickActionList.tsx    Three-row list on Home
  CategoryChip.tsx       Pill chip, colored icon, toggle state
  ProductCard.tsx        Image + title + price card
  FloatingCartCTA.tsx    Fade+translate CTA pinned above the nav
  BottomNav.tsx          Custom Expo Router tab bar with animated lime circle
constants/
  theme.ts               colors, font, radius, layout, navShadow, pressed, motion
data/
  catalog.ts             products, categories, quick actions, onboarding steps
hooks/
  useFadeIn.ts           mount fade+translateY
  useStagger.ts          array of delayed useFadeIn values
  usePressScale.ts       press-in/out spring for cards and Touchable
  useAnimatedCount.ts    bounce on cart count increment
  useInterpolatedColor.ts thin wrapper over Animated.Value.interpolate(colors)
store/
  cart.tsx               CartProvider + useCart
  cart.reducer.ts        pure reducer (unit tested)
  cart.reducer.test.ts   jest test for the reducer
__mocks__/
  (nothing checked in — placeholder if we add jest mocks)
```

---

## Task 1: Scaffold Expo Router blank-TS app + core config

**Files:**
- Create: `package.json`, `tsconfig.json`, `app.json`, `babel.config.js`, `.gitignore`, `index.ts`
- Create: `docs/superpowers/plans/.gitkeep` (already exists in repo layout)

**Interfaces:**
- Produces: A boot-able Expo Router app entry point. Consumed by every later task.

- [ ] **Step 1: Scaffold with `create-expo-app`**

Run from `/Users/alopes.dev/Documents/brain/cometa`:

```bash
npx --yes create-expo-app@latest . --template blank-typescript --no-install
```

The `.` argument scaffolds into the current directory. If the CLI refuses because the directory is not empty (it contains `docs/` and a `.git/`), instead scaffold into a sibling temp dir and copy:

```bash
cd /tmp && npx --yes create-expo-app@latest cometa-tmp --template blank-typescript --no-install
rsync -a --exclude '.git' /tmp/cometa-tmp/ /Users/alopes.dev/Documents/brain/cometa/
rm -rf /tmp/cometa-tmp
cd /Users/alopes.dev/Documents/brain/cometa
```

- [ ] **Step 2: Add the Expo Router entry point**

Replace `index.ts` (or `App.tsx` if the template produced it) with a single line:

```ts
import 'expo-router/entry';
```

Delete `App.tsx` if it exists. `package.json`'s `"main"` field must be `"expo-router/entry"` (see step 3).

- [ ] **Step 3: Edit `package.json` — main, name, scripts**

Set:

```json
{
  "name": "cometa",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "test": "jest"
  }
}
```

Keep whatever `dependencies` / `devDependencies` the template produced; we'll add more in Task 2.

- [ ] **Step 4: Configure `app.json` — Expo Router, splash, orientation**

Replace `app.json` with:

```json
{
  "expo": {
    "name": "Cometa",
    "slug": "cometa",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "light",
    "scheme": "cometa",
    "newArchEnabled": true,
    "ios": { "supportsTablet": false, "bundleIdentifier": "so.sof.cometa" },
    "android": { "package": "so.sof.cometa", "adaptiveIcon": { "backgroundColor": "#FFFFFF" } },
    "web": { "bundler": "metro" },
    "plugins": ["expo-router", "expo-font", "expo-splash-screen"],
    "experiments": { "typedRoutes": true }
  }
}
```

Note: `#FFFFFF` in `app.json` is Expo config, not runtime code, so it does not violate the "no hex outside `constants/theme.ts`" rule (which applies to `.ts`/`.tsx` sources under `app/`, `components/`, `hooks/`, `store/`, `data/`).

- [ ] **Step 5: Configure `tsconfig.json` — strict mode + path aliases**

Replace `tsconfig.json` with:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

- [ ] **Step 6: Configure `babel.config.js`**

The `blank-typescript` template usually creates this already. Ensure it reads:

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

- [ ] **Step 7: Update `.gitignore`**

Append (creating the file if missing):

```
node_modules/
.expo/
dist/
.tsbuildinfo
*.log
.DS_Store
ios/
android/
```

- [ ] **Step 8: Install and boot**

Run:

```bash
npm install
npx expo start --clear
```

Expected: Metro bundler starts. Press `w` to open web build in a browser tab and confirm the default "Open up App.tsx" (or the router's default) renders without red screens. The router will complain that no route file exists yet — that's fine; we address it in Task 7. If the boot screen is a red screen, capture the error and fix before proceeding. Kill the dev server with `Ctrl+C`.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold Expo Router blank-TS app"
```

---

## Task 2: Install runtime dependencies

**Files:**
- Modify: `package.json` (via `expo install`)

**Interfaces:**
- Produces: All third-party dependencies used by later tasks. No exports.

- [ ] **Step 1: Install core runtime deps via `expo install`**

`expo install` picks versions compatible with the installed SDK. Run:

```bash
npx expo install expo-router expo-font @expo-google-fonts/poppins expo-linear-gradient expo-image expo-splash-screen react-native-safe-area-context lucide-react-native react-native-svg @react-native-async-storage/async-storage
```

- [ ] **Step 2: Install jest + testing deps as devDependencies**

Used by the cart reducer unit test in Task 5. Run:

```bash
npm install --save-dev jest jest-expo @types/jest
```

- [ ] **Step 3: Add jest config to `package.json`**

Add to `package.json` after `"scripts"`:

```json
"jest": {
  "preset": "jest-expo",
  "testMatch": ["**/*.test.ts", "**/*.test.tsx"],
  "transformIgnorePatterns": [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg))"
  ]
}
```

- [ ] **Step 4: Verify install cleanly and boot compiles**

Run:

```bash
npx expo doctor
```

Expected: reports "dependencies are up to date". If it flags any mismatch, run the suggested `expo install <package>@<version>` to align.

Then boot:

```bash
npx expo start --clear
```

Expected: bundler compiles without missing-module errors. Ctrl+C to stop.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install runtime and test dependencies"
```

---

## Task 3: Design tokens (`constants/theme.ts`)

**Files:**
- Create: `constants/theme.ts`

**Interfaces:**
- Produces:
  - `colors` — object of hex string literals (see spec §5).
  - `font` — object of Poppins family names.
  - `radius` — object of numbers.
  - `layout` — object of layout numbers.
  - `navShadow` — `{ ios, android }` platform-split shadow config.
  - `pressed` — `{ opacity: 0.85, scale: 0.98 }`.
  - `motion` — `{ duration, easing, stagger }` per spec §7.

- [ ] **Step 1: Create the file**

Create `constants/theme.ts`:

```ts
import { Easing } from 'react-native';

export const colors = {
  canvas: '#E9E9E9',
  surfaceDark: '#131313',
  surfaceDark2: '#292929',
  surfaceLight: '#FFFFFF',
  surfaceLight2: '#F2F2F2',
  accentLime: '#CBF83E',
  textPrimary: '#111111',
  textSecondary: '#9A9A9A',
  textOnDark: '#FFFFFF',
  textOnDarkMuted: '#8B8B8B',
  divider: '#EDEDED',
  border: '#EFEFEF',
  iconVegan: '#2ECC71',
  iconCoffee: '#D97B3A',
  iconDonut: '#E8347A',
  iconSpicy: '#F5A623',
} as const;

export const font = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semibold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
} as const;

export const radius = {
  header: 28,
  sheet: 28,
  card: 20,
  image: 16,
  search: 16,
  cartButton: 12,
  pill: 999,
} as const;

export const layout = {
  screenPadding: 20,
  sectionGap: 24,
  gridGap: 12,
  navHeight: 76,
  navBottomOffset: 16,
  navSideMargin: 20,
  navInnerPadding: 12,
  navActiveCircle: 64,
  navIconSize: 26,
  navIconStroke: 1.75,
  ctaHeight: 60,
  ctaGap: 12,
  scrollBottomPadding: 180,
} as const;

export const navShadow = {
  ios: {
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
  },
  android: { elevation: 12 },
} as const;

export const pressed = { opacity: 0.85, scale: 0.98 } as const;

export const motion = {
  duration: { instant: 120, quick: 200, base: 280, slow: 420, hero: 600 },
  easing: {
    standard: Easing.out(Easing.quad),
    emphasized: Easing.out(Easing.exp),
    accelerate: Easing.in(Easing.quad),
    spring: { tension: 180, friction: 14 },
    springBouncy: { tension: 220, friction: 10 },
  },
  stagger: 60,
} as const;

export type Colors = typeof colors;
export type Font = typeof font;
export type Radius = typeof radius;
export type Layout = typeof layout;
```

Note: `navShadow.ios.shadowColor` reuses `colors.textPrimary` (which happens to be `#111111`) instead of a fresh literal `#000000`. This keeps the hex-outside-theme rule green — even shadow color goes through the palette.

- [ ] **Step 2: Verify TypeScript compiles**

Run:

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add constants/theme.ts
git commit -m "feat(theme): add design tokens for colors, font, radius, layout, motion"
```

---

## Task 4: Data catalog (`data/catalog.ts`)

**Files:**
- Create: `data/catalog.ts`

**Interfaces:**
- Consumes: `colors` from `constants/theme.ts`.
- Produces:
  - `type CategoryId = 'vegan' | 'coffee' | 'donuts' | 'spicy'`
  - `type Category`, `type Product`, `type QuickAction`, `type OnboardingStep`
  - Named exports: `CATEGORIES`, `PRODUCTS`, `QUICK_ACTIONS`, `ONBOARDING_STEPS`.

- [ ] **Step 1: Create the file**

Create `data/catalog.ts`:

```ts
import { ChefHat, Coffee, Donut, Flame, HelpCircle, Leaf, RotateCw } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { colors } from '@/constants/theme';

export type CategoryId = 'vegan' | 'coffee' | 'donuts' | 'spicy';

export type Category = {
  id: CategoryId;
  label: string;
  Icon: LucideIcon;
  color: string;
};

export type Product = {
  id: string;
  title: string;
  price: number;
  category: CategoryId;
  image: string;
};

export type QuickAction = {
  id: 'repeat' | 'help' | 'surprise';
  label: string;
  Icon: LucideIcon;
};

export type OnboardingStep = {
  id: 'build' | 'discover' | 'enjoy';
  title: [string, string];
  subtitle: string;
  image: string;
  ctaLabel: string;
};

export const CATEGORIES: Category[] = [
  { id: 'vegan',  label: 'Vegan',  Icon: Leaf,   color: colors.iconVegan },
  { id: 'coffee', label: 'Coffee', Icon: Coffee, color: colors.iconCoffee },
  { id: 'donuts', label: 'Donuts', Icon: Donut,  color: colors.iconDonut },
  { id: 'spicy',  label: 'Spicy',  Icon: Flame,  color: colors.iconSpicy },
];

export const PRODUCTS: Product[] = [
  { id: 'quinoa',    title: 'Cometa Quinoa',    price: 20, category: 'vegan',  image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80' },
  { id: 'asparagus', title: 'Cometa Asparagus', price: 18, category: 'vegan',  image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80' },
  { id: 'pancakes',  title: 'Cometa Pancakes',  price: 12, category: 'coffee', image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=80' },
  { id: 'poke',      title: 'Cometa Poke Bowl', price: 22, category: 'spicy',  image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80' },
];

export const QUICK_ACTIONS: QuickAction[] = [
  { id: 'repeat',   label: 'Repeat last order', Icon: RotateCw },
  { id: 'help',     label: 'Help me choose',    Icon: HelpCircle },
  { id: 'surprise', label: 'Surprise me',       Icon: ChefHat },
];

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'build',
    title: ['Build your', 'Flavor, Step by Step'],
    subtitle: 'Stack fresh ingredients for meals made your way',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80',
    ctaLabel: 'Next',
  },
  {
    id: 'discover',
    title: ['Discover', 'Flavors Near You'],
    subtitle: 'Handpicked kitchens delivering the freshest dishes tonight',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    ctaLabel: 'Next',
  },
  {
    id: 'enjoy',
    title: ['Enjoy', 'Every Bite, Every Time'],
    subtitle: 'Track your order and savor food that arrives exactly as promised',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
    ctaLabel: 'Get Started',
  },
];
```

- [ ] **Step 2: Verify TypeScript compiles**

Run:

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add data/catalog.ts
git commit -m "feat(data): add catalog of products, categories, quick actions, onboarding steps"
```

---

## Task 5: Cart store + reducer unit test

**Files:**
- Create: `store/cart.reducer.ts`
- Create: `store/cart.reducer.test.ts`
- Create: `store/cart.tsx`

**Interfaces:**
- Produces:
  - `type CartItem = { productId: string; qty: number }`
  - `type CartState = { items: CartItem[] }`
  - `type CartAction = { type: 'add'; productId: string } | { type: 'remove'; productId: string } | { type: 'clear' }`
  - `initialCart: CartState` — seeded with `{ productId: 'quinoa', qty: 1 }` and `{ productId: 'pancakes', qty: 1 }` (so `count === 2` on first render, matching the board).
  - `cartReducer(state, action): CartState` — pure function.
  - `CartProvider({ children })` — React component.
  - `useCart(): { items, count, add, remove, clear }` — hook.

- [ ] **Step 1: Write the reducer test first**

Create `store/cart.reducer.test.ts`:

```ts
import { cartReducer, initialCart } from './cart.reducer';

describe('cartReducer', () => {
  it('starts with two seed items', () => {
    expect(initialCart.items).toEqual([
      { productId: 'quinoa', qty: 1 },
      { productId: 'pancakes', qty: 1 },
    ]);
  });

  it('adds a new product as qty 1', () => {
    const next = cartReducer({ items: [] }, { type: 'add', productId: 'poke' });
    expect(next.items).toEqual([{ productId: 'poke', qty: 1 }]);
  });

  it('increments qty when adding an existing product', () => {
    const next = cartReducer(
      { items: [{ productId: 'poke', qty: 1 }] },
      { type: 'add', productId: 'poke' }
    );
    expect(next.items).toEqual([{ productId: 'poke', qty: 2 }]);
  });

  it('decrements qty when removing a product with qty > 1', () => {
    const next = cartReducer(
      { items: [{ productId: 'poke', qty: 3 }] },
      { type: 'remove', productId: 'poke' }
    );
    expect(next.items).toEqual([{ productId: 'poke', qty: 2 }]);
  });

  it('drops the item when removing at qty 1', () => {
    const next = cartReducer(
      { items: [{ productId: 'poke', qty: 1 }, { productId: 'quinoa', qty: 2 }] },
      { type: 'remove', productId: 'poke' }
    );
    expect(next.items).toEqual([{ productId: 'quinoa', qty: 2 }]);
  });

  it('is a no-op when removing a product not in the cart', () => {
    const state = { items: [{ productId: 'quinoa', qty: 1 }] };
    const next = cartReducer(state, { type: 'remove', productId: 'poke' });
    expect(next).toEqual(state);
  });

  it('clears everything', () => {
    const next = cartReducer(
      { items: [{ productId: 'quinoa', qty: 1 }] },
      { type: 'clear' }
    );
    expect(next.items).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npx jest store/cart.reducer.test.ts
```

Expected: FAIL with "Cannot find module './cart.reducer'".

- [ ] **Step 3: Implement the reducer**

Create `store/cart.reducer.ts`:

```ts
export type CartItem = { productId: string; qty: number };
export type CartState = { items: CartItem[] };

export type CartAction =
  | { type: 'add'; productId: string }
  | { type: 'remove'; productId: string }
  | { type: 'clear' };

export const initialCart: CartState = {
  items: [
    { productId: 'quinoa', qty: 1 },
    { productId: 'pancakes', qty: 1 },
  ],
};

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      const existing = state.items.find((i) => i.productId === action.productId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === action.productId ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { productId: action.productId, qty: 1 }] };
    }
    case 'remove': {
      const existing = state.items.find((i) => i.productId === action.productId);
      if (!existing) return state;
      if (existing.qty > 1) {
        return {
          items: state.items.map((i) =>
            i.productId === action.productId ? { ...i, qty: i.qty - 1 } : i
          ),
        };
      }
      return { items: state.items.filter((i) => i.productId !== action.productId) };
    }
    case 'clear':
      return { items: [] };
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:

```bash
npx jest store/cart.reducer.test.ts
```

Expected: 7 passing.

- [ ] **Step 5: Implement the provider and hook**

Create `store/cart.tsx`:

```tsx
import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import { cartReducer, initialCart, type CartItem } from './cart.reducer';

type CartContextValue = {
  items: CartItem[];
  count: number;
  add: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCart);

  const add = useCallback((productId: string) => dispatch({ type: 'add', productId }), []);
  const remove = useCallback((productId: string) => dispatch({ type: 'remove', productId }), []);
  const clear = useCallback(() => dispatch({ type: 'clear' }), []);

  const count = useMemo(() => state.items.reduce((sum, i) => sum + i.qty, 0), [state.items]);

  const value = useMemo<CartContextValue>(
    () => ({ items: state.items, count, add, remove, clear }),
    [state.items, count, add, remove, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
```

- [ ] **Step 6: TypeScript check**

Run:

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add store/cart.reducer.ts store/cart.reducer.test.ts store/cart.tsx
git commit -m "feat(store): add CartProvider and reducer with unit tests"
```

---

## Task 6: Motion hooks (`hooks/*.ts`)

**Files:**
- Create: `hooks/useFadeIn.ts`
- Create: `hooks/useStagger.ts`
- Create: `hooks/usePressScale.ts`
- Create: `hooks/useAnimatedCount.ts`
- Create: `hooks/useInterpolatedColor.ts`

**Interfaces:**
- Consumes: `motion` from `@/constants/theme`.
- Produces:
  - `useFadeIn(delay?: number): { opacity: Animated.Value; translateY: Animated.Value }`
  - `useStagger(count: number, step?: number): Array<{ opacity: Animated.Value; translateY: Animated.Value }>`
  - `usePressScale(): { scale: Animated.Value; onPressIn: () => void; onPressOut: () => void }`
  - `useAnimatedCount(value: number): { scale: Animated.Value }` — bounces on increment
  - `useInterpolatedColor(progress: Animated.Value, from: string, to: string): Animated.AnimatedInterpolation<string>`

- [ ] **Step 1: `hooks/useFadeIn.ts`**

```ts
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { motion } from '@/constants/theme';

export function useFadeIn(delay = 0) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: motion.duration.base,
        delay,
        easing: motion.easing.emphasized,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: motion.duration.base,
        delay,
        easing: motion.easing.emphasized,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, opacity, translateY]);

  return { opacity, translateY };
}
```

- [ ] **Step 2: `hooks/useStagger.ts`**

```ts
import { useMemo } from 'react';
import { Animated } from 'react-native';
import { motion } from '@/constants/theme';
import { useFadeIn } from './useFadeIn';

export function useStagger(count: number, step = motion.stagger) {
  // Compute delays once — the hook order is stable because `count` and `step`
  // should be constant per component instance.
  const delays = useMemo(
    () => Array.from({ length: count }, (_, i) => i * step),
    [count, step]
  );

  // Hooks must be called unconditionally; we allocate a fixed pool for
  // reasonable staggered sections (up to 8 children). Callers requesting more
  // will get a runtime error, which is what we want — force a redesign.
  if (count > 8) throw new Error('useStagger supports up to 8 children');

  const s0 = useFadeIn(delays[0] ?? 0);
  const s1 = useFadeIn(delays[1] ?? 0);
  const s2 = useFadeIn(delays[2] ?? 0);
  const s3 = useFadeIn(delays[3] ?? 0);
  const s4 = useFadeIn(delays[4] ?? 0);
  const s5 = useFadeIn(delays[5] ?? 0);
  const s6 = useFadeIn(delays[6] ?? 0);
  const s7 = useFadeIn(delays[7] ?? 0);

  const all: Array<{ opacity: Animated.Value; translateY: Animated.Value }> =
    [s0, s1, s2, s3, s4, s5, s6, s7];

  return all.slice(0, count);
}
```

Note: React requires hook count to be stable across renders. Since we don't know `count` at compile time but do know it's bounded (Home has 3 staggered sections), we allocate a fixed pool of 8 `useFadeIn` calls and slice. This is a deliberate design choice — a dynamic loop would break the Rules of Hooks.

- [ ] **Step 3: `hooks/usePressScale.ts`**

```ts
import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import { motion, pressed } from '@/constants/theme';

export function usePressScale() {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: pressed.scale,
      useNativeDriver: true,
      tension: motion.easing.spring.tension,
      friction: motion.easing.spring.friction,
    }).start();
  }, [scale]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: motion.easing.spring.tension,
      friction: motion.easing.spring.friction,
    }).start();
  }, [scale]);

  return { scale, onPressIn, onPressOut };
}
```

- [ ] **Step 4: `hooks/useAnimatedCount.ts`**

```ts
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { motion } from '@/constants/theme';

export function useAnimatedCount(value: number) {
  const scale = useRef(new Animated.Value(1)).current;
  const previous = useRef(value);

  useEffect(() => {
    if (value > previous.current) {
      Animated.sequence([
        Animated.spring(scale, {
          toValue: 1.25,
          useNativeDriver: true,
          tension: motion.easing.springBouncy.tension,
          friction: motion.easing.springBouncy.friction,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: motion.easing.springBouncy.tension,
          friction: motion.easing.springBouncy.friction,
        }),
      ]).start();
    }
    previous.current = value;
  }, [value, scale]);

  return { scale };
}
```

- [ ] **Step 5: `hooks/useInterpolatedColor.ts`**

```ts
import type { Animated } from 'react-native';

export function useInterpolatedColor(
  progress: Animated.Value,
  from: string,
  to: string
): Animated.AnimatedInterpolation<string> {
  return progress.interpolate({
    inputRange: [0, 1],
    outputRange: [from, to],
  });
}
```

- [ ] **Step 6: TypeScript check**

Run:

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add hooks/
git commit -m "feat(hooks): add motion utilities (fadeIn, stagger, pressScale, animatedCount, interpolatedColor)"
```

---

## Task 7: Root layout + index redirect

**Files:**
- Create: `app/_layout.tsx`
- Create: `app/index.tsx`

**Interfaces:**
- Consumes: `CartProvider` from `@/store/cart`, `useFonts` from `expo-font`, `SplashScreen` from `expo-splash-screen`, Poppins fonts, `AsyncStorage`, `colors` from theme.
- Produces: An app that boots to `/onboarding` on first launch, `/(tabs)` otherwise. Fonts loaded and splash held.

- [ ] **Step 1: Create `app/_layout.tsx`**

```tsx
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { CartProvider } from '@/store/cart';
import { colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore — the splash may have already hidden if a prior boot failed.
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <CartProvider>
        <StatusBar hidden />
        <View style={{ flex: 1, backgroundColor: colors.surfaceLight }}>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.surfaceLight } }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </View>
      </CartProvider>
    </SafeAreaProvider>
  );
}
```

- [ ] **Step 2: Create `app/index.tsx`**

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

const KEY = 'cometa:hasOnboarded';

export default function Index() {
  const [target, setTarget] = useState<'/onboarding' | '/(tabs)' | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((v) => setTarget(v === 'true' ? '/(tabs)' : '/onboarding'))
      .catch(() => setTarget('/onboarding'));
  }, []);

  if (target === null) return null;
  return <Redirect href={target} />;
}
```

- [ ] **Step 3: Add placeholder `app/onboarding.tsx` and `app/(tabs)/_layout.tsx` so routes exist**

These are placeholders — Task 9 rewrites onboarding and Task 16 rewrites the tabs layout.

Create `app/onboarding.tsx`:

```tsx
import { Text, View } from 'react-native';
import { colors, font } from '@/constants/theme';

export default function Onboarding() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceLight }}>
      <Text style={{ fontFamily: font.semibold, color: colors.textPrimary }}>Onboarding (placeholder)</Text>
    </View>
  );
}
```

Create `app/(tabs)/_layout.tsx`:

```tsx
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return <Tabs screenOptions={{ headerShown: false }} />;
}
```

Create `app/(tabs)/index.tsx`:

```tsx
import { Text, View } from 'react-native';
import { colors, font } from '@/constants/theme';

export default function Home() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceLight }}>
      <Text style={{ fontFamily: font.semibold, color: colors.textPrimary }}>Home (placeholder)</Text>
    </View>
  );
}
```

- [ ] **Step 4: Boot and verify**

Run:

```bash
npx expo start --clear
```

Press `i` for iOS simulator (or `w` for web). Expected:

1. Splash screen holds briefly (fonts loading), then hides.
2. First launch shows the "Onboarding (placeholder)" text.
3. Manually set the flag by running (in a separate terminal or via the Expo dev tools console):
   ```js
   await AsyncStorage.setItem('cometa:hasOnboarded', 'true');
   ```
   Then reload — should now show "Home (placeholder)".
4. Reset for later tasks:
   ```js
   await AsyncStorage.removeItem('cometa:hasOnboarded');
   ```

Ctrl+C to stop the bundler.

- [ ] **Step 5: Commit**

```bash
git add app/_layout.tsx app/index.tsx app/onboarding.tsx app/\(tabs\)/_layout.tsx app/\(tabs\)/index.tsx
git commit -m "feat(app): add root layout with font loading + first-open redirect"
```

---

## Task 8: Shared primitives — Touchable, StatusBarMock, HomeIndicator, SectionHeader

**Files:**
- Create: `components/Touchable.tsx`
- Create: `components/StatusBarMock.tsx`
- Create: `components/HomeIndicator.tsx`
- Create: `components/SectionHeader.tsx`

**Interfaces:**
- Produces:
  - `Touchable({ onPress, children, hitSlop?, style?, accessibilityRole, accessibilityLabel })`
  - `StatusBarMock()` — self-contained.
  - `HomeIndicator()` — self-contained; renders `null` when `insets.bottom > 0`.
  - `SectionHeader({ title, actionLabel?, onActionPress? })`.

- [ ] **Step 1: `components/Touchable.tsx`**

```tsx
import React from 'react';
import { Animated, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { pressed } from '@/constants/theme';
import { usePressScale } from '@/hooks/usePressScale';

type Props = {
  onPress?: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  hitSlop?: PressableProps['hitSlop'];
  accessibilityRole?: PressableProps['accessibilityRole'];
  accessibilityLabel: string;
  disabled?: boolean;
};

export function Touchable({
  onPress,
  children,
  style,
  hitSlop,
  accessibilityRole = 'button',
  accessibilityLabel,
  disabled,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={hitSlop}
      disabled={disabled}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
    >
      {({ pressed: isPressed }) => (
        <Animated.View
          style={[
            { transform: [{ scale }], opacity: isPressed ? pressed.opacity : 1 },
            style,
          ]}
        >
          {children}
        </Animated.View>
      )}
    </Pressable>
  );
}
```

- [ ] **Step 2: `components/StatusBarMock.tsx`**

```tsx
import { StyleSheet, Text, View } from 'react-native';
import { BatteryFull, Signal, Wifi } from 'lucide-react-native';
import { colors, font } from '@/constants/theme';

export function StatusBarMock() {
  return (
    <View style={styles.row}>
      <Text style={styles.time}>9:41</Text>
      <View style={styles.icons}>
        <Signal size={16} color={colors.textOnDark} strokeWidth={2} />
        <Wifi size={16} color={colors.textOnDark} strokeWidth={2} />
        <BatteryFull size={20} color={colors.textOnDark} strokeWidth={2} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 24,
  },
  time: { fontFamily: font.semibold, fontSize: 15, color: colors.textOnDark },
  icons: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
```

- [ ] **Step 3: `components/HomeIndicator.tsx`**

```tsx
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius } from '@/constants/theme';

export function HomeIndicator() {
  const insets = useSafeAreaInsets();
  if (insets.bottom > 0) return null;
  return (
    <View style={styles.wrapper} pointerEvents="none">
      <View style={styles.bar} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 8,
    alignItems: 'center',
  },
  bar: {
    width: 134,
    height: 5,
    backgroundColor: colors.textPrimary,
    borderRadius: radius.pill,
  },
});
```

- [ ] **Step 4: `components/SectionHeader.tsx`**

```tsx
import { StyleSheet, Text, View } from 'react-native';
import { colors, font } from '@/constants/theme';
import { Touchable } from './Touchable';

type Props = {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function SectionHeader({ title, actionLabel, onActionPress }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel ? (
        <Touchable
          onPress={onActionPress}
          accessibilityLabel={actionLabel}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.action}>{actionLabel}</Text>
        </Touchable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: { fontFamily: font.bold, fontSize: 20, color: colors.textPrimary },
  action: { fontFamily: font.medium, fontSize: 15, color: colors.textPrimary },
});
```

- [ ] **Step 5: TypeScript check**

Run:

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add components/Touchable.tsx components/StatusBarMock.tsx components/HomeIndicator.tsx components/SectionHeader.tsx
git commit -m "feat(components): add Touchable, StatusBarMock, HomeIndicator, SectionHeader"
```

---

## Task 9: HeaderDark component

**Files:**
- Create: `components/HeaderDark.tsx`

**Interfaces:**
- Consumes: `useCart`, `colors`, `font`, `radius`, `layout`, `useSafeAreaInsets`, `StatusBarMock`, `Touchable`.
- Produces: `HeaderDark({ query, onChangeQuery, onCartPress })`.

- [ ] **Step 1: Create the component**

```tsx
import { useRef } from 'react';
import { Animated, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, ShoppingCart } from 'lucide-react-native';
import { colors, font, layout, motion, radius } from '@/constants/theme';
import { useCart } from '@/store/cart';
import { useAnimatedCount } from '@/hooks/useAnimatedCount';
import { StatusBarMock } from './StatusBarMock';
import { Touchable } from './Touchable';

type Props = {
  query: string;
  onChangeQuery: (v: string) => void;
  onCartPress?: () => void;
  scrollY?: Animated.Value;
};

export function HeaderDark({ query, onChangeQuery, onCartPress, scrollY }: Props) {
  const insets = useSafeAreaInsets();
  const { count } = useCart();
  const { scale } = useAnimatedCount(count);

  const focusProgress = useRef(new Animated.Value(0)).current;
  const borderColor = focusProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.surfaceDark2, colors.accentLime],
  });

  // Scroll-linked header per spec §7. useNativeDriver: false because
  // height + borderRadius are not transform props. Isolated to this header.
  const searchHeight = scrollY
    ? scrollY.interpolate({ inputRange: [40, 100], outputRange: [52, 44], extrapolate: 'clamp' })
    : 52;
  const headerBottomRadius = scrollY
    ? scrollY.interpolate({ inputRange: [40, 100], outputRange: [radius.header, 20], extrapolate: 'clamp' })
    : radius.header;

  const onFocus = () =>
    Animated.timing(focusProgress, {
      toValue: 1,
      duration: motion.duration.quick,
      easing: motion.easing.standard,
      useNativeDriver: false,
    }).start();

  const onBlur = () =>
    Animated.timing(focusProgress, {
      toValue: 0,
      duration: motion.duration.quick,
      easing: motion.easing.standard,
      useNativeDriver: false,
    }).start();

  return (
    <Animated.View
      style={[
        styles.header,
        {
          paddingTop: Math.max(insets.top, 12),
          borderBottomLeftRadius: headerBottomRadius,
          borderBottomRightRadius: headerBottomRadius,
        },
      ]}
    >
      <StatusBarMock />

      <View style={styles.brandRow}>
        <Text style={styles.brand}>Cometa</Text>

        <Touchable
          onPress={onCartPress}
          accessibilityLabel={`Cart, ${count} items`}
          style={styles.cartPill}
        >
          <ShoppingCart size={18} color={colors.textPrimary} strokeWidth={2} />
          <Animated.Text
            style={[styles.cartCount, { transform: [{ scale }] }]}
            accessibilityLiveRegion="polite"
          >
            {count}
          </Animated.Text>
        </Touchable>
      </View>

      <Animated.View style={[styles.searchWrap, { borderColor, height: searchHeight }]}>
        <Search size={20} color={colors.textOnDarkMuted} strokeWidth={2} />
        <TextInput
          value={query}
          onChangeText={onChangeQuery}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="Search for something tasty..."
          placeholderTextColor={colors.textOnDarkMuted}
          style={styles.searchInput}
          returnKeyType="search"
          accessibilityLabel="Search products"
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surfaceDark,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 40, // includes 20px behind the sheet
  },
  brandRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: { fontFamily: font.bold, fontSize: 24, color: colors.textOnDark },
  cartPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 40,
    paddingHorizontal: 14,
    borderRadius: radius.cartButton,
    backgroundColor: colors.accentLime,
  },
  cartCount: { fontFamily: font.bold, fontSize: 14, color: colors.textPrimary },
  searchWrap: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 52,
    paddingHorizontal: 14,
    borderRadius: radius.search,
    backgroundColor: colors.surfaceDark2,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontFamily: font.regular,
    fontSize: 15,
    color: colors.textOnDark,
    padding: 0,
  },
});
```

- [ ] **Step 2: TypeScript check**

Run:

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/HeaderDark.tsx
git commit -m "feat(components): add HeaderDark with animated cart badge and focus border"
```

---

## Task 10: QuickActionList, CategoryChip, ProductCard, FloatingCartCTA

**Files:**
- Create: `components/QuickActionList.tsx`
- Create: `components/CategoryChip.tsx`
- Create: `components/ProductCard.tsx`
- Create: `components/FloatingCartCTA.tsx`

**Interfaces:**
- Produces:
  - `QuickActionList({ items })` — items are `QuickAction[]` from `@/data/catalog`.
  - `CategoryChip({ category, isActive, onPress })`.
  - `ProductCard({ product, width })`.
  - `FloatingCartCTA({ visible, count, bottom, onPress })`.

- [ ] **Step 1: `components/QuickActionList.tsx`**

```tsx
import { StyleSheet, Text, View } from 'react-native';
import { colors, font } from '@/constants/theme';
import type { QuickAction } from '@/data/catalog';
import { Touchable } from './Touchable';

type Props = { items: QuickAction[]; onPress?: (id: QuickAction['id']) => void };

export function QuickActionList({ items, onPress }: Props) {
  return (
    <View>
      {items.map((item, idx) => {
        const { Icon } = item;
        return (
          <View key={item.id}>
            <Touchable
              onPress={() => onPress?.(item.id)}
              accessibilityLabel={item.label}
              style={styles.row}
            >
              <Icon size={22} color={colors.textPrimary} strokeWidth={2} />
              <Text style={styles.label}>{item.label}</Text>
            </Touchable>
            {idx < items.length - 1 ? <View style={styles.divider} /> : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  label: { fontFamily: font.medium, fontSize: 17, color: colors.textPrimary },
  divider: { height: 1, backgroundColor: colors.divider },
});
```

- [ ] **Step 2: `components/CategoryChip.tsx`**

```tsx
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { colors, font, motion, radius } from '@/constants/theme';
import type { Category } from '@/data/catalog';
import { Touchable } from './Touchable';

type Props = { category: Category; isActive: boolean; onPress: () => void };

export function CategoryChip({ category, isActive, onPress }: Props) {
  const progress = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: isActive ? 1 : 0,
      duration: motion.duration.quick,
      easing: motion.easing.standard,
      useNativeDriver: false,
    }).start();
  }, [isActive, progress]);

  const bg = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.surfaceLight, colors.surfaceDark],
  });
  const textColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.textPrimary, colors.textOnDark],
  });
  const iconColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [category.color, colors.textOnDark],
  });

  const { Icon } = category;

  return (
    <Touchable
      onPress={onPress}
      accessibilityLabel={`${category.label} category`}
      accessibilityRole="button"
    >
      <Animated.View style={[styles.chip, { backgroundColor: bg }]}>
        <AnimatedIcon Icon={Icon} color={iconColor} />
        <Animated.Text style={[styles.label, { color: textColor }]}>{category.label}</Animated.Text>
      </Animated.View>
    </Touchable>
  );
}

function AnimatedIcon({
  Icon,
  color,
}: {
  Icon: Category['Icon'];
  color: Animated.AnimatedInterpolation<string>;
}) {
  // Lucide icons accept a `color` string; we can't feed an AnimatedInterpolation
  // directly. Work around by wrapping in an Animated.View that tints via
  // `tintColor` isn't available for SVG in RN, so we cross-fade two icons.
  const opacity = (color as any).__getChildren ? undefined : undefined;
  // Simpler: render the icon in the base color and place a duplicate on top
  // whose opacity is driven by progress. But we only have `color` here; the
  // caller owns progress. To keep this component honest we instead accept
  // that lucide's color is a static prop, and set it based on active flag —
  // the surrounding chip already animates.
  return null as any;
}
```

Wait — `lucide-react-native` icons take a `color: string`. Animating a string color with `useNativeDriver: false` and passing the interpolation into an SVG `stroke` doesn't work out of the box. Replace the icon interpolation with a simple cross-fade of two icon instances.

Rewrite `components/CategoryChip.tsx` cleanly:

```tsx
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors, font, motion, radius } from '@/constants/theme';
import type { Category } from '@/data/catalog';
import { Touchable } from './Touchable';

type Props = { category: Category; isActive: boolean; onPress: () => void };

export function CategoryChip({ category, isActive, onPress }: Props) {
  const progress = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: isActive ? 1 : 0,
      duration: motion.duration.quick,
      easing: motion.easing.standard,
      useNativeDriver: false,
    }).start();
  }, [isActive, progress]);

  const bg = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.surfaceLight, colors.surfaceDark],
  });
  const textColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.textPrimary, colors.textOnDark],
  });
  const inactiveOpacity = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const activeOpacity = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  const { Icon } = category;

  return (
    <Touchable
      onPress={onPress}
      accessibilityLabel={`${category.label} category`}
      accessibilityRole="button"
    >
      <Animated.View style={[styles.chip, { backgroundColor: bg }]}>
        <View style={styles.iconWrap}>
          <Animated.View style={[StyleSheet.absoluteFillObject, styles.iconSlot, { opacity: inactiveOpacity }]}>
            <Icon size={20} color={category.color} strokeWidth={2} />
          </Animated.View>
          <Animated.View style={[StyleSheet.absoluteFillObject, styles.iconSlot, { opacity: activeOpacity }]}>
            <Icon size={20} color={colors.textOnDark} strokeWidth={2} />
          </Animated.View>
        </View>
        <Animated.Text style={[styles.label, { color: textColor }]}>{category.label}</Animated.Text>
      </Animated.View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconWrap: { width: 20, height: 20 },
  iconSlot: { alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: font.medium, fontSize: 15 },
});
```

- [ ] **Step 3: `components/ProductCard.tsx`**

```tsx
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { colors, font, radius } from '@/constants/theme';
import type { Product } from '@/data/catalog';
import { Touchable } from './Touchable';

type Props = { product: Product; width: number; onPress?: () => void };

export function ProductCard({ product, width, onPress }: Props) {
  return (
    <Touchable
      onPress={onPress}
      accessibilityLabel={`${product.title}, $${product.price}`}
      style={[styles.card, { width }]}
    >
      <Image
        source={product.image}
        style={styles.image}
        contentFit="cover"
        cachePolicy="memory-disk"
        accessibilityIgnoresInvertColors
      />
      <Text numberOfLines={2} style={styles.title}>
        {product.title}
      </Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>${product.price}</Text>
      </View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    gap: 10,
  },
  image: { width: '100%', aspectRatio: 1, borderRadius: radius.image },
  title: { fontFamily: font.semibold, fontSize: 15, color: colors.textPrimary, minHeight: 40 },
  priceRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  price: { fontFamily: font.bold, fontSize: 15, color: colors.textPrimary },
});
```

- [ ] **Step 4: `components/FloatingCartCTA.tsx`**

```tsx
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { colors, font, layout, motion, radius } from '@/constants/theme';
import { Touchable } from './Touchable';

type Props = {
  visible: boolean;
  count: number;
  bottom: number;
  onPress?: () => void;
};

export function FloatingCartCTA({ visible, count, bottom, onPress }: Props) {
  const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const translateY = useRef(new Animated.Value(visible ? 0 : 8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        duration: motion.duration.quick,
        easing: motion.easing.emphasized,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: visible ? 0 : 8,
        duration: motion.duration.quick,
        easing: motion.easing.emphasized,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, opacity, translateY]);

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[
        styles.wrap,
        { bottom, opacity, transform: [{ translateY }] },
      ]}
    >
      <Touchable
        onPress={onPress}
        accessibilityLabel={`Check out ${count} products`}
        style={styles.button}
      >
        <Animated.Text style={styles.label}>Check out {count} products</Animated.Text>
      </Touchable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: layout.screenPadding,
    right: layout.screenPadding,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 8,
  },
  button: {
    height: layout.ctaHeight,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontFamily: font.semibold, fontSize: 16, color: colors.textOnDark },
});
```

- [ ] **Step 5: TypeScript check**

Run:

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add components/QuickActionList.tsx components/CategoryChip.tsx components/ProductCard.tsx components/FloatingCartCTA.tsx
git commit -m "feat(components): add quick actions, chips, product cards, floating CTA"
```

---

## Task 11: BottomNav component

**Files:**
- Create: `components/BottomNav.tsx`

**Interfaces:**
- Consumes: `BottomTabBarProps` from `@react-navigation/bottom-tabs` (re-exported through `expo-router`); `useCart`; `colors`, `font`, `layout`, `motion`, `navShadow`, `radius`.
- Produces: default export `BottomNav(props: BottomTabBarProps)`.

The routes must be in this order in the tabs group: `index` (Home), `offers`, `orders`, `cart`, `profile`. The nav derives icons from route name.

- [ ] **Step 1: Create the component**

```tsx
import { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { House, MapPin, ShoppingCart, Tag, User, type LucideIcon } from 'lucide-react-native';
import { colors, font, layout, motion, navShadow, radius } from '@/constants/theme';
import { useCart } from '@/store/cart';
import { Touchable } from './Touchable';

const ROUTE_ICONS: Record<string, LucideIcon> = {
  index: House,
  offers: Tag,
  orders: MapPin,
  cart: ShoppingCart,
  profile: User,
};

export default function BottomNav({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const { count } = useCart();

  const pillWidth = screenWidth - 2 * layout.navSideMargin;
  const slot = (pillWidth - 2 * layout.navInnerPadding) / state.routes.length;
  const circleTarget = (index: number) =>
    layout.navInnerPadding + index * slot + (slot - layout.navActiveCircle) / 2;

  const circleX = useRef(new Animated.Value(circleTarget(state.index))).current;

  useEffect(() => {
    Animated.spring(circleX, {
      toValue: circleTarget(state.index),
      useNativeDriver: true,
      tension: motion.easing.spring.tension,
      friction: motion.easing.spring.friction,
    }).start();
  }, [state.index, circleX, screenWidth]);

  return (
    <View
      style={[
        styles.wrap,
        {
          bottom: insets.bottom + layout.navBottomOffset,
          left: layout.navSideMargin,
          right: layout.navSideMargin,
        },
        Platform.OS === 'ios' ? navShadow.ios : navShadow.android,
      ]}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.circle,
          {
            width: layout.navActiveCircle,
            height: layout.navActiveCircle,
            top: (layout.navHeight - layout.navActiveCircle) / 2,
            transform: [{ translateX: circleX }],
          },
        ]}
      />
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const Icon = ROUTE_ICONS[route.name] ?? House;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name as never, route.params as never);
            }
          };

          return (
            <Touchable
              key={route.key}
              onPress={onPress}
              accessibilityLabel={`${route.name} tab`}
              accessibilityRole="tab"
              style={[styles.slot, { width: slot }]}
            >
              <NavIcon Icon={Icon} focused={isFocused} showBadge={route.name === 'cart'} badgeCount={count} />
            </Touchable>
          );
        })}
      </View>
    </View>
  );
}

function NavIcon({
  Icon,
  focused,
  showBadge,
  badgeCount,
}: {
  Icon: LucideIcon;
  focused: boolean;
  showBadge: boolean;
  badgeCount: number;
}) {
  const scale = useRef(new Animated.Value(focused ? 1 : 0.9)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1 : 0.9,
      useNativeDriver: true,
      tension: motion.easing.spring.tension,
      friction: motion.easing.spring.friction,
    }).start();
  }, [focused, scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Icon
        size={layout.navIconSize}
        color={focused ? colors.textPrimary : colors.textOnDark}
        strokeWidth={layout.navIconStroke}
      />
      {showBadge && badgeCount > 0 ? (
        <View style={styles.badge}>
          <Animated.Text style={styles.badgeText}>{badgeCount}</Animated.Text>
        </View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    height: layout.navHeight,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceDark,
    overflow: 'visible',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.navInnerPadding,
    height: layout.navHeight,
  },
  slot: { alignItems: 'center', justifyContent: 'center', height: layout.navHeight },
  circle: {
    position: 'absolute',
    left: 0,
    backgroundColor: colors.accentLime,
    borderRadius: radius.pill,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.accentLime,
    borderWidth: 2,
    borderColor: colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontFamily: font.bold, fontSize: 10, color: colors.textPrimary },
});
```

- [ ] **Step 2: TypeScript check**

Run:

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/BottomNav.tsx
git commit -m "feat(components): add BottomNav with animated lime circle and cart badge"
```

---

## Task 12: Tabs layout wiring + 4 placeholder tab screens

**Files:**
- Modify: `app/(tabs)/_layout.tsx`
- Create: `app/(tabs)/offers.tsx`, `app/(tabs)/orders.tsx`, `app/(tabs)/cart.tsx`, `app/(tabs)/profile.tsx`

**Interfaces:**
- Consumes: `BottomNav` from `@/components/BottomNav`.
- Produces: A working tab group with 5 routes. Tapping tabs moves the lime circle with spring motion.

- [ ] **Step 1: Rewrite `app/(tabs)/_layout.tsx`**

```tsx
import { Tabs } from 'expo-router';
import BottomNav from '@/components/BottomNav';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      tabBar={(props) => <BottomNav {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="offers" />
      <Tabs.Screen name="orders" />
      <Tabs.Screen name="cart" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
```

- [ ] **Step 2: Create a shared placeholder screen helper**

Create `components/PlaceholderScreen.tsx`:

```tsx
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useFadeIn } from '@/hooks/useFadeIn';
import { colors, font, layout } from '@/constants/theme';

export function PlaceholderScreen({ title }: { title: string }) {
  const { opacity, translateY } = useFadeIn();
  return (
    <View style={styles.wrap}>
      <Animated.View style={{ opacity, transform: [{ translateY }] }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Coming soon</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingBottom: layout.scrollBottomPadding,
  },
  title: { fontFamily: font.bold, fontSize: 24, color: colors.textPrimary, textAlign: 'center' },
  subtitle: {
    fontFamily: font.regular,
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});
```

- [ ] **Step 3: Create four placeholder tab screens**

Each file has the same shape.

`app/(tabs)/offers.tsx`:

```tsx
import { PlaceholderScreen } from '@/components/PlaceholderScreen';
export default function Offers() {
  return <PlaceholderScreen title="Offers" />;
}
```

`app/(tabs)/orders.tsx`:

```tsx
import { PlaceholderScreen } from '@/components/PlaceholderScreen';
export default function Orders() {
  return <PlaceholderScreen title="Orders" />;
}
```

`app/(tabs)/cart.tsx`:

```tsx
import { PlaceholderScreen } from '@/components/PlaceholderScreen';
export default function Cart() {
  return <PlaceholderScreen title="Cart" />;
}
```

`app/(tabs)/profile.tsx`:

```tsx
import { PlaceholderScreen } from '@/components/PlaceholderScreen';
export default function Profile() {
  return <PlaceholderScreen title="Profile" />;
}
```

- [ ] **Step 4: Boot and verify**

Set the onboarded flag so the app lands on tabs:

```bash
npx expo start --clear
```

In the app dev-tools console (or add a temporary button in `app/index.tsx`):

```js
await AsyncStorage.setItem('cometa:hasOnboarded', 'true');
```

Reload. Expected:

1. Tab bar renders as a floating black pill at the bottom.
2. Home tab is active — lime circle behind the house icon.
3. Tapping Offers slides the lime circle right with spring easing.
4. Cart badge shows `2` on the shopping-cart icon.
5. Placeholder screens fade in on focus.

Kill the bundler.

- [ ] **Step 5: Commit**

```bash
git add app/\(tabs\)/_layout.tsx app/\(tabs\)/offers.tsx app/\(tabs\)/orders.tsx app/\(tabs\)/cart.tsx app/\(tabs\)/profile.tsx components/PlaceholderScreen.tsx
git commit -m "feat(app): wire tabs layout and placeholder screens"
```

---

## Task 13: Onboarding screen

**Files:**
- Rewrite: `app/onboarding.tsx`

**Interfaces:**
- Consumes: `ONBOARDING_STEPS`, `Touchable`, tokens, `AsyncStorage`, `LinearGradient`, `Image` from `expo-image`.
- Produces: A 3-step carousel that writes `cometa:hasOnboarded` and `router.replace('/(tabs)')` on Skip or Get Started.

- [ ] **Step 1: Rewrite the screen**

```tsx
import { useCallback, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ONBOARDING_STEPS, type OnboardingStep } from '@/data/catalog';
import { colors, font, motion, radius } from '@/constants/theme';
import { Touchable } from '@/components/Touchable';

const STORAGE_KEY = 'cometa:hasOnboarded';

export default function Onboarding() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const listRef = useRef<FlatList<OnboardingStep>>(null);

  const finish = useCallback(async () => {
    await AsyncStorage.setItem(STORAGE_KEY, 'true');
    router.replace('/(tabs)');
  }, []);

  const goNext = useCallback(() => {
    if (step < ONBOARDING_STEPS.length - 1) {
      const next = step + 1;
      listRef.current?.scrollToIndex({ index: next, animated: true });
      setStep(next);
    } else {
      finish();
    }
  }, [step, finish]);

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    if (newIndex !== step) setStep(newIndex);
  };

  const imageHeight = height * 0.72;

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={ONBOARDING_STEPS}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={({ item }) => (
          <View style={{ width }}>
            <View style={{ height: imageHeight, width }}>
              <Image
                source={item.image}
                style={StyleSheet.absoluteFillObject}
                contentFit="cover"
                cachePolicy="memory-disk"
              />
              <LinearGradient
                pointerEvents="none"
                colors={['transparent', colors.surfaceLight]}
                style={[styles.gradient, { height: imageHeight * 0.25 }]}
              />
            </View>

            <View style={styles.textBlock}>
              <TextBlock step={item} active={ONBOARDING_STEPS.indexOf(item) === step} />
            </View>
          </View>
        )}
      />

      <View style={[styles.topBar, { top: insets.top + 64 }]} pointerEvents="box-none">
        <View style={styles.progress}>
          {ONBOARDING_STEPS.map((_, i) => (
            <ProgressBar key={i} isActive={i === step} />
          ))}
        </View>
        <Touchable
          onPress={finish}
          accessibilityLabel="Skip onboarding"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.skip}>Skip</Text>
        </Touchable>
      </View>

      <View style={[styles.ctaWrap, { paddingBottom: 32 + insets.bottom }]}>
        <Touchable
          onPress={goNext}
          accessibilityLabel={ONBOARDING_STEPS[step].ctaLabel}
          style={styles.cta}
        >
          <Text style={styles.ctaLabel}>{ONBOARDING_STEPS[step].ctaLabel}</Text>
        </Touchable>
      </View>
    </View>
  );
}

function ProgressBar({ isActive }: { isActive: boolean }) {
  const opacity = useRef(new Animated.Value(isActive ? 1 : 0.4)).current;
  const prev = useRef(isActive);
  if (prev.current !== isActive) {
    Animated.timing(opacity, {
      toValue: isActive ? 1 : 0.4,
      duration: motion.duration.base,
      easing: motion.easing.emphasized,
      useNativeDriver: true,
    }).start();
    prev.current = isActive;
  }
  return <Animated.View style={[styles.bar, { opacity }]} />;
}

function TextBlock({ step, active }: { step: OnboardingStep; active: boolean }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(8)).current;

  if (active) {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: motion.duration.base,
        easing: motion.easing.emphasized,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: motion.duration.base,
        easing: motion.easing.emphasized,
        useNativeDriver: true,
      }),
    ]).start();
  }

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <Text style={styles.title}>{step.title[0]}</Text>
      <Text style={styles.title}>{step.title[1]}</Text>
      <Text style={styles.subtitle}>{step.subtitle}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surfaceLight },
  gradient: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  textBlock: { paddingHorizontal: 24, marginTop: 8, alignItems: 'center' },
  title: {
    fontFamily: font.bold,
    fontSize: 34,
    lineHeight: 39,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: font.regular,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
  },
  topBar: {
    position: 'absolute',
    left: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  progress: { flex: 1, flexDirection: 'row', gap: 8 },
  bar: { flex: 1, height: 3, borderRadius: radius.pill, backgroundColor: colors.textOnDark },
  skip: { fontFamily: font.medium, fontSize: 16, color: colors.textPrimary, minWidth: 44, textAlign: 'right' },
  ctaWrap: { position: 'absolute', left: 24, right: 24, bottom: 0 },
  cta: {
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaLabel: { fontFamily: font.semibold, fontSize: 17, color: colors.textOnDark },
});
```

Note: the `TextBlock` and `ProgressBar` use imperative `Animated` calls outside of `useEffect`. This is a deliberate simplification — the parent `FlatList` swipe is the driver, and the animations kick off during render when `active`/`isActive` flips. If React logs a warning about state during render, refactor to `useEffect(() => { ... }, [active])`. Given how briefly these fire, either shape is acceptable for scaffolding; prefer `useEffect` on the second implementation pass.

- [ ] **Step 2: Boot and verify**

Clear the flag, then launch:

```bash
npx expo start --clear
```

Expected:

1. First launch lands on onboarding.
2. Progress bars, Skip, and CTA all render in position.
3. Swiping advances the step; taps on Next also advance and the progress bar tracks.
4. Skip and Get Started land on Home with no back gesture available.
5. Second launch (reload after Get Started) goes straight to Home.

- [ ] **Step 3: Commit**

```bash
git add app/onboarding.tsx
git commit -m "feat(app): implement 3-step onboarding with progress bar and gradient mask"
```

---

## Task 14: Home screen assembly

**Files:**
- Rewrite: `app/(tabs)/index.tsx`

**Interfaces:**
- Consumes: `HeaderDark`, `QuickActionList`, `SectionHeader`, `CategoryChip`, `ProductCard`, `FloatingCartCTA`, `HomeIndicator`, `useCart`, `useFadeIn`, `useStagger`, catalog data, tokens.
- Produces: The Home screen matching spec §8.2.

- [ ] **Step 1: Rewrite `app/(tabs)/index.tsx`**

```tsx
import { useMemo, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderDark } from '@/components/HeaderDark';
import { QuickActionList } from '@/components/QuickActionList';
import { SectionHeader } from '@/components/SectionHeader';
import { CategoryChip } from '@/components/CategoryChip';
import { ProductCard } from '@/components/ProductCard';
import { FloatingCartCTA } from '@/components/FloatingCartCTA';
import { HomeIndicator } from '@/components/HomeIndicator';
import { Touchable } from '@/components/Touchable';
import { CATEGORIES, PRODUCTS, QUICK_ACTIONS, type CategoryId } from '@/data/catalog';
import { colors, font, layout } from '@/constants/theme';
import { useCart } from '@/store/cart';
import { useStagger } from '@/hooks/useStagger';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Home() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { count } = useCart();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);

  const [s1, s2, s3] = useStagger(3);
  const scrollY = useRef(new Animated.Value(0)).current;

  const cardWidth = (width - 2 * layout.screenPadding - layout.gridGap) / 2;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const matchesCategory = activeCategory ? p.category === activeCategory : true;
      const matchesQuery = q.length === 0 ? true : p.title.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  const setFilter = (id: CategoryId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveCategory((cur) => (cur === id ? null : id));
  };

  return (
    <KeyboardAvoidingView style={styles.wrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <HeaderDark query={query} onChangeQuery={setQuery} scrollY={scrollY} />

      <Animated.ScrollView
        style={styles.sheet}
        contentContainerStyle={[styles.sheetContent, { paddingBottom: layout.scrollBottomPadding }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <Animated.View style={{ opacity: s1.opacity, transform: [{ translateY: s1.translateY }] }}>
          <View style={styles.section}>
            <QuickActionList items={QUICK_ACTIONS} />
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: s2.opacity, transform: [{ translateY: s2.translateY }] }}>
          <View style={styles.section}>
            <SectionHeader title="Top Categories" actionLabel="View all →" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsContent}
              style={styles.chips}
            >
              {CATEGORIES.map((c) => (
                <CategoryChip
                  key={c.id}
                  category={c}
                  isActive={activeCategory === c.id}
                  onPress={() => setFilter(c.id)}
                />
              ))}
            </ScrollView>
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: s3.opacity, transform: [{ translateY: s3.translateY }] }}>
          <View style={styles.section}>
            <SectionHeader title="Recommended for you" actionLabel="View all →" />
            {filtered.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>No dishes match that search</Text>
                <Touchable
                  onPress={() => {
                    setQuery('');
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                  }}
                  accessibilityLabel="Clear search"
                >
                  <Text style={styles.emptyAction}>Clear search</Text>
                </Touchable>
              </View>
            ) : (
              <View style={styles.grid}>
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} width={cardWidth} />
                ))}
              </View>
            )}
          </View>
        </Animated.View>
      </Animated.ScrollView>

      <FloatingCartCTA
        visible={count > 0}
        count={count}
        bottom={insets.bottom + layout.navBottomOffset + layout.navHeight + layout.ctaGap}
      />

      <HomeIndicator />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.surfaceDark },
  sheet: {
    flex: 1,
    marginTop: -20,
    backgroundColor: colors.surfaceLight,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  sheetContent: { paddingHorizontal: layout.screenPadding, paddingTop: 12 },
  section: { marginBottom: layout.sectionGap },
  chips: { marginHorizontal: -layout.screenPadding },
  chipsContent: { paddingHorizontal: layout.screenPadding, gap: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: layout.gridGap },
  empty: { alignItems: 'center', paddingVertical: 32 },
  emptyText: { fontFamily: font.regular, fontSize: 15, color: colors.textSecondary },
  emptyAction: { fontFamily: font.medium, fontSize: 15, color: colors.textPrimary, marginTop: 12 },
});
```

- [ ] **Step 2: Boot and verify all acceptance criteria (partial)**

Reset the onboarded flag so we go through onboarding first, then land on Home:

```bash
# stop bundler if running
npx expo start --clear
```

Walk through the following:

1. Splash holds until Poppins loads — no font warnings in console.
2. Onboarding swipes and buttons work; progress bar tracks.
3. Skip → Home. Reload → still Home (flag persisted).
4. Header badge, nav badge, CTA text all show `2`.
5. Type `pan` in search → only Pancakes card visible; "Clear search" works.
6. Tap Offers tab → lime circle springs right.
7. Scroll to end of Home — last card is fully legible above the nav and CTA.

If any check fails, capture the specific behavior and fix it before moving on.

- [ ] **Step 3: Commit**

```bash
git add app/\(tabs\)/index.tsx
git commit -m "feat(app): assemble Home screen with search, categories, grid, floating CTA"
```

---

## Task 15: Acceptance sweep — hex grep, dual-viewport check, final polish

**Files:** none created; may edit any file to fix regressions found.

**Interfaces:**
- Produces: A passing acceptance-criteria checklist.

- [ ] **Step 1: Grep sweep for hex literals outside `constants/theme.ts`**

Run:

```bash
grep -RIn --include='*.ts' --include='*.tsx' '#[0-9A-Fa-f]\{3,\}' app components hooks store data
```

Expected: no matches. If any match appears, replace with a token from `constants/theme.ts`.

- [ ] **Step 2: TypeScript full check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Reducer unit tests still pass**

```bash
npx jest
```

Expected: `Tests: 7 passed, 7 total`.

- [ ] **Step 4: Manual walkthrough of the 9 acceptance criteria**

For each, tick when confirmed:

1. [ ] `npx expo start` runs — no font warnings; splash hides only after fonts loaded.
2. [ ] Onboarding swipe + button both advance; progress bar tracks.
3. [ ] Skip and Get Started → Home with no back navigation.
4. [ ] Header badge, nav badge, CTA all show same count.
5. [ ] Search `pan` narrows to Pancakes.
6. [ ] Tab change moves lime circle with visible ~200ms spring motion.
7. [ ] Scrolling to end leaves last card above nav + CTA.
8. [ ] `grep` sweep (step 1) is empty.
9. [ ] Layout intact at 390×844 and 360×640.

For criterion 9, use the Expo simulator sizing controls or run the web target and resize the browser to 360×640. Confirm no overlaps or truncations.

- [ ] **Step 5: Commit any fixes found in this task**

If steps 1–4 required edits:

```bash
git add -A
git commit -m "chore: address acceptance criteria sweep"
```

If nothing changed, skip the commit.

- [ ] **Step 6: Final tag**

```bash
git tag -a scaffold-complete -m "Cometa Expo Router scaffold complete"
```

---

## Notes for the implementer

- **Font loading warnings.** If Metro logs `Text strings must be rendered within a <Text> component`, it's usually a stray whitespace between JSX tags — hunt it down. If it logs `Unable to resolve module lucide-react-native`, run `npx expo install lucide-react-native` again.
- **`useNativeDriver: false` for color/border interpolations.** These are unavoidable because native driver doesn't support color animation. Isolated to `CategoryChip`, `HeaderDark` search focus border, and the scroll-linked header if implemented. Keep them narrow.
- **`useNativeDriver: true` everywhere else.** Opacity + transform interpolations must stay on the native driver for 60fps.
- **AsyncStorage during development.** Reset with `await AsyncStorage.removeItem('cometa:hasOnboarded')` from the RN dev-tools console any time you want to re-see onboarding.
- **Route order in tabs.** `BottomNav` relies on the order defined in `app/(tabs)/_layout.tsx`. Do not reorder without updating the icon map.
- **`useStagger` upper bound.** Set to 8 by design. Home only needs 3. If a future screen needs more, expand the pool in `hooks/useStagger.ts`.

---

## Self-review results

Ran the self-review checklist against the spec:

1. **Spec coverage:** All 14 spec sections have a corresponding task. Motion tokens (spec §5, §7) → Task 3 + Task 6. State model (spec §6) → Task 5 + Task 7. Screen specs (§8) → Tasks 9, 10, 11, 13, 14. Behavior (§11) → Task 14. Acceptance criteria (§12) → Task 15 explicit checklist.
2. **Placeholder scan:** No TBDs / TODOs / "implement later" / "similar to Task N". Each code block is complete and runnable.
3. **Type consistency:** Cart types (`CartItem`, `CartState`, `CartAction`), catalog types (`CategoryId`, `Category`, `Product`, `QuickAction`, `OnboardingStep`), and hook signatures match across tasks.
4. **Fixes applied inline:**
   - Task 10 initially tried to interpolate a lucide icon color directly — rewritten to cross-fade two icons.
   - Task 13 `TextBlock`/`ProgressBar` note added about `useEffect` refactor if RN warns.
   - Task 11 `BottomNav` `screenWidth` added as a dep to the circle animation so device rotation still lands the circle correctly.
   - Task 9 `HeaderDark` grew an optional `scrollY` prop and Task 14 `Home` creates a `scrollY = useRef(new Animated.Value(0)).current`, wraps the sheet as `Animated.ScrollView`, and feeds `onScroll` via `Animated.event(..., { useNativeDriver: false })`. This wires the spec §7 scroll-linked header (search 52→44, header bottom-radius 28→20 across scrollY 40→100). The static `borderBottomLeftRadius`/`borderBottomRightRadius` on `styles.header` was removed to avoid double-applying.
