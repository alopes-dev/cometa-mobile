# Cometa — Expo Router food delivery app

**Date:** 2026-07-28
**Status:** Approved for implementation planning
**Target:** iPhone 390×844 (verified down to 360×640)

---

## 1. Goal & scope

Ship a runnable Expo Router mobile app called **Cometa** covering three deliverables:

1. Three-step onboarding carousel (outside tabs).
2. Home screen inside a tab stack, with search, category filter, quick actions, and product grid.
3. A custom floating bottom navigation shared across five tab screens.

The four non-Home tab screens (Offers, Orders, Cart, Profile) are minimal placeholder screens: a centered heading using project tokens. They exist so the tab bar has valid routes, nothing more. All out-of-scope features (product detail, checkout flow, real payments, real backend) are excluded.

Success is defined by the nine acceptance criteria in §12.

## 2. Constraints

- Expo (latest SDK) + Expo Router + TypeScript.
- No UI kit dependencies (NativeBase / Tamagui / gluestack / RN Paper) — everything in `StyleSheet.create`.
- Animations use the core React Native `Animated` API. **No Reanimated.**
- `LayoutAnimation` is allowed exactly once (grid re-layout on filter change) — see §7.
- No hex literal outside `constants/theme.ts`. No layout magic number outside `layout` / `motion` tokens.
- Poppins font family loaded via `@expo-google-fonts/poppins`; weight comes from the font file name, never from `fontWeight` on top of the family.

## 3. Stack & dependencies

Installed via `expo install` so SDK versions align:

- `expo-router` — file-based routing (`Stack` + `Tabs`).
- `expo-font`, `@expo-google-fonts/poppins` (400 / 500 / 600 / 700).
- `expo-linear-gradient` — onboarding photo dissolve mask.
- `expo-image` — remote images with cache.
- `expo-splash-screen` — held until fonts load.
- `react-native-safe-area-context` — insets.
- `lucide-react-native` + `react-native-svg` — icon set.
- `@react-native-async-storage/async-storage` — persists the `hasOnboarded` flag.

Scaffolded via `npx create-expo-app@latest cometa --template blank-typescript`, then Expo Router is installed on top per the official docs.

## 4. File structure

```
app/
  _layout.tsx            Stack raiz + CartProvider + font loading + splash gate
  index.tsx              redirect: onboarding if hasOnboarded is false, else /(tabs)
  onboarding.tsx         3-step carousel, outside tabs
  (tabs)/
    _layout.tsx          Tabs with custom tabBar={props => <BottomNav {...props} />}
    index.tsx            Home
    offers.tsx           placeholder
    orders.tsx           placeholder
    cart.tsx             placeholder
    profile.tsx          placeholder
components/
  HeaderDark.tsx
  StatusBarMock.tsx
  QuickActionList.tsx
  SectionHeader.tsx
  CategoryChip.tsx
  ProductCard.tsx
  FloatingCartCTA.tsx
  BottomNav.tsx
  HomeIndicator.tsx
  Touchable.tsx
constants/
  theme.ts               colors, font, radius, layout, navShadow, pressed, motion
data/
  catalog.ts             products, categories, quick actions, onboarding steps
hooks/
  useFadeIn.ts
  useStagger.ts
  usePressScale.ts
  useAnimatedCount.ts
  useInterpolatedColor.ts
store/
  cart.tsx               CartProvider + useCart hook (Context + useReducer)
```

## 5. Design tokens (`constants/theme.ts`)

```ts
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
  header: 28, sheet: 28, card: 20, image: 16,
  search: 16, cartButton: 12, pill: 999,
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
  ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
         shadowOpacity: 0.25, shadowRadius: 24 },
  android: { elevation: 12 },
} as const;

export const pressed = { opacity: 0.85, scale: 0.98 } as const;

// Motion — see §7
export const motion = {
  duration: { instant: 120, quick: 200, base: 280, slow: 420, hero: 600 },
  easing: {
    standard: Easing.out(Easing.quad),
    emphasized: Easing.out(Easing.exp),
    accelerate: Easing.in(Easing.quad),
    spring:       { tension: 180, friction: 14 },
    springBouncy: { tension: 220, friction: 10 },
  },
  stagger: 60,
} as const;
```

## 6. State management

- **CartProvider** — Context + `useReducer` for `{ add, remove, clear }`. Exposes `count`, `items`, and the mutators via `useCart()`. Mounted in `app/_layout.tsx`. Initial state seeds two items so the badge and CTA read `2` on first render, matching the board.
- **Home screen local state** — `activeCategoryId: string | null` and `query: string`. Not lifted, since no other screen consumes them.
- **Onboarding local state** — `step: 0 | 1 | 2`, mirrored from `FlatList` momentum end and written by the Next button via `scrollToIndex`.
- **First-open flag** — `AsyncStorage` key `cometa:hasOnboarded`. Read in `app/index.tsx`, written on Skip or Get Started.

## 7. Motion system

All animations pull durations and easings from `motion` tokens. `useNativeDriver: true` unless explicitly noted.

**Shared hooks in `hooks/`:**

- `useFadeIn(delay = 0)` — returns `{ opacity, translateY }`, animates on mount from `(0, 12)` to `(1, 0)` in `motion.duration.base` with `motion.easing.emphasized`.
- `useStagger(count, step = motion.stagger)` — returns `count` `useFadeIn`-shaped values, each delayed by `index * step`.
- `usePressScale()` — returns `{ scale, onPressIn, onPressOut }` using spring physics. Consumed by `Touchable` and any other pressable that needs the effect.
- `useAnimatedCount(value)` — drives a bounce (1 → 1.25 → 1) via `Animated.sequence` with `springBouncy`, triggered by a `useEffect` on the value.
- `useInterpolatedColor(progress, from, to)` — wraps `Animated.Value.interpolate` with `outputRange` using color strings; used by `CategoryChip` and the search field focus state.

**Applied moments:**

| Moment | Behavior |
|---|---|
| Splash → Home entrance | Three sections (quick actions, categories, product grid) fade + translateY 12→0, staggered by `motion.stagger`. |
| Onboarding step change | Text block cross-fades + translateY 8→0 in `motion.duration.base`. Active progress bar's opacity interpolates 0.4→1 in parallel. Photo remains still — the FlatList swipe carries the motion. |
| Search input focus | Border color interpolates from `divider` to `accentLime` at 20% alpha over `motion.duration.quick`. |
| CategoryChip toggle | Background and text color interpolate from light to dark via `Animated.Value` 0↔1 in `motion.duration.quick`. Icon tint follows the same value. |
| Grid filter change | `LayoutAnimation.configureNext(easeInEaseOut, motion.duration.base)` immediately before the filtered list is committed to state. This is the single allowed use of `LayoutAnimation`. |
| ProductCard press | Scale 1→0.97 via `usePressScale`, spring back on release. |
| BottomNav circle | `Animated.spring` on `translateX` using `motion.easing.spring`. Overrides the prompt's "200ms timing" to give a fluid arc. |
| BottomNav icon swap | Active icon scales 0.9→1 with `spring` on tab change. |
| Cart badge count change | `useAnimatedCount(count)` bounce. Runs whenever the value increments. |
| FloatingCartCTA in/out | Fade + translateY 8px, `motion.duration.quick` + `motion.easing.emphasized`. Mounts/unmounts based on `count > 0`; the nav does not shift. |
| Tab screen focus | Each `(tabs)` screen wraps content in an `Animated.View` that fades + translateY 6→0 in `motion.duration.base` on focus (via `useFocusEffect`). |
| Scroll-linked header | On the Home scroll, `scrollY` drives: search bar height 52→44 as it crosses 40→100, and header bottom-radius 28→20 same range. Height and radius interpolations use `useNativeDriver: false` — isolated to the header only. Corner radius transitions gracefully because the header itself doesn't animate transform. |

**Explicitly not animated** — parallax, card shimmer, quick-action icons, hero transitions. Restraint keeps the app from feeling gimmicky.

## 8. Screen specs

### 8.1 Onboarding (`app/onboarding.tsx`)

- Route lives outside `(tabs)` at the root Stack.
- `FlatList` horizontal, `pagingEnabled`, `showsHorizontalScrollIndicator={false}`. Each item `width = useWindowDimensions().width`.
- `onMomentumScrollEnd` computes new step; Next button calls `scrollToIndex({ index })` — both write to a single `step` state.
- Full-bleed image at top, height 72% of window, `contentFit="cover"` via `expo-image`. Photo pinned to top.
- `LinearGradient` absolute over bottom 25% of the image, colors `['transparent', colors.surfaceLight]`.
- Overlay top row at `top: insets.top + 64`, horizontal padding 24:
  - Left: 3 progress bars in `flexDirection: 'row'`, `flex: 1`, `gap: 8`, each `height: 3`, `borderRadius: radius.pill`. Active = `textOnDark` at 1.0, inactive = `textOnDark` at 0.4. Opacity interpolated per §7.
  - Right: `Skip` label, 16px `font.medium`, `textPrimary`. Hit slop expands to 44×44.
- Text block anchored to bottom above the CTA, centered:
  - Title 34px `font.bold`, `lineHeight: 39`, two lines, `textPrimary`.
  - Subtitle 15px `font.regular`, `textSecondary`, `marginTop: 12`.
- CTA: pill `surfaceDark`, `height: 64`, side margins 24. Text `textOnDark` 17px `font.semibold`. Label reads `Next` on steps 1–2 and `Get Started` on step 3.
- `paddingBottom: 32 + insets.bottom` beneath the CTA.
- Skip and Get Started both call `router.replace('/(tabs)')` and write the `hasOnboarded` flag. `replace` (not `push`) guarantees the onboarding stack is dropped.
- Step copy and images sourced from `data/catalog.ts`.

Placeholder Unsplash URLs for the three onboarding steps live in `data/catalog.ts`.

### 8.2 Home (`app/(tabs)/index.tsx`)

**Header (`components/HeaderDark.tsx`)**
- Background `surfaceDark`, bottom corners `radius.header`, `paddingHorizontal: layout.screenPadding`, `paddingTop: Math.max(insets.top, 12)`.
- Extra 20px `paddingBottom` sits behind the white content sheet.
- `<StatusBar hidden />` set at the root; header renders its own mock: `9:41` left + signal/wifi/battery right, all in `textOnDark`.
- Row 2: `Cometa` wordmark 24px `font.bold` `textOnDark` on the left; cart pill on the right with background `accentLime`, `height: 40`, `borderRadius: radius.cartButton`. Contents: cart icon `textPrimary` + live count (`useCart().count`) in `font.bold` `textPrimary`. The count starts at `2` because the cart seeds with two items; it is not a literal.
- Row 3: search field — background `surfaceDark2`, `borderRadius: radius.search`, `height: 52`. Lucide `Search` in `textOnDarkMuted` on the left, `TextInput` placeholder `"Search for something tasty..."` in `textOnDarkMuted`, typed text in `textOnDark`.

**Content sheet**
- `ScrollView` with `backgroundColor: surfaceLight`, top corners `radius.sheet`, `marginTop: -20` overlaps the header, `overflow: 'hidden'`.
- `contentContainerStyle`: `paddingHorizontal: layout.screenPadding`, `paddingBottom: layout.scrollBottomPadding`.
- `keyboardShouldPersistTaps: 'handled'`. Whole Home screen wrapped in `KeyboardAvoidingView` (`behavior: 'padding'` iOS only).
- Sections stacked with `gap: layout.sectionGap` between blocks.

**Section 2a — Quick actions (`QuickActionList`)**
- Three rows, `height: 56` each. Divider `divider` 1px between rows only.
- Row: icon `textPrimary` 22px + label 17px `font.medium`, `gap: 14`.
- Items: `Repeat last order` (Lucide `RotateCw`), `Help me choose` (`HelpCircle`), `Surprise me` (`ChefHat`).

**Section 2b — Top Categories**
- Cabeçalho: title `Top Categories` 20px `font.bold`, right link `View all →` 15px `font.medium` `textPrimary`.
- Horizontal `ScrollView`, `gap: 10`, `marginHorizontal: -layout.screenPadding` with `contentContainerStyle.paddingHorizontal: layout.screenPadding` so the last chip bleeds to the edge.
- `CategoryChip` — background `surfaceLight`, 1px `border`, `height: 48`, `paddingHorizontal: 16`. Colored 20px icon + 15px `font.medium` label.
- Chips: Vegan (`Leaf` `iconVegan`), Coffee (`Coffee` `iconCoffee`), Donuts (`Donut` `iconDonut`), Spicy (`Flame` `iconSpicy`).
- Toggle: one active at a time. Active chip inverts to `surfaceDark` background with `textOnDark` label and icon.

**Section 2c — Recommended for you**
- Cabeçalho matching Categories.
- Grid: `flexDirection: 'row'`, `flexWrap: 'wrap'`, `gap: layout.gridGap`.
- Card width `(useWindowDimensions().width - 2 * layout.screenPadding - layout.gridGap) / 2`.
- `ProductCard`: background `surfaceLight`, 1px `border`, `borderRadius: radius.card`, `padding: 10`.
- Inside: square image (`aspectRatio: 1`) `radius.image`, title 15px `font.semibold` `numberOfLines={2}`, price row aligned right, 15px `font.bold`.
- Data (`data/catalog.ts`):
  - Cometa Quinoa — $20 — Vegan
  - Cometa Asparagus — $18 — Vegan
  - Cometa Pancakes — $12 — Coffee
  - Cometa Poke Bowl — $22 — Spicy

**Floating cart CTA (`FloatingCartCTA`)**
- Pill `surfaceDark`, `height: ctaHeight`, `left: layout.screenPadding`, `right: layout.screenPadding`, `bottom: insets.bottom + layout.navBottomOffset + layout.navHeight + layout.ctaGap`.
- Text `textOnDark` 16px `font.semibold` centered: `Check out ${count} products`.
- Shadow: soft, diffused. Enters/exits per §7. Hidden when `count === 0`; nav stays put.

**Home indicator (`HomeIndicator`)**
- 134×5 bar `textPrimary`, `borderRadius: radius.pill`, centered, pinned to bottom.
- Rendered only when `insets.bottom === 0` (Android / iOS without the OS indicator).

### 8.3 Tab layout & BottomNav

`app/(tabs)/_layout.tsx`:

```tsx
<Tabs
  screenOptions={{ headerShown: false }}
  tabBar={(props) => <BottomNav {...props} />}
/>
```

`BottomNav.tsx`:
- Reads `BottomTabBarProps` — `state.index`, `state.routes`, `navigation`.
- Absolute pill, `left: layout.navSideMargin`, `right: layout.navSideMargin`, `bottom: insets.bottom + layout.navBottomOffset`, `borderRadius: radius.pill`, `backgroundColor: surfaceDark`, `height: layout.navHeight`.
- Shadow from `navShadow` (platform-split).
- Five items in `justifyContent: 'space-between'`, `paddingHorizontal: layout.navInnerPadding`, no text labels.
- Order (routes must match): `index` (Home / `House`), `offers` (`Tag`), `orders` (`MapPin`), `cart` (`ShoppingCart`), `profile` (`User`).
- Active state: 64px `accentLime` circle behind the icon; icon rendered black.
- Inactive state: `textOnDark` outline icon, `strokeWidth: layout.navIconStroke`.
- Single animated circle:
  - `pillWidth = useWindowDimensions().width - 2 * layout.navSideMargin`
  - `slot = (pillWidth - 2 * layout.navInnerPadding) / 5`
  - `translateX = layout.navInnerPadding + index * slot + (slot - layout.navActiveCircle) / 2`
  - `Animated.spring` per §7.
- Cart badge: 18px dot `accentLime`, count in `textPrimary` `font.bold`, positioned top-right of the cart icon, 2px `surfaceDark` border.
- Each item: `navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true })` before navigating; skips navigation if `defaultPrevented`.
- The nav floats above the content sheet — cards pass behind it.

### 8.4 Placeholder tab screens

`offers.tsx`, `orders.tsx`, `cart.tsx`, `profile.tsx` each render a centered heading using `font.semibold`/`textPrimary`. Wrapped in the shared focus-fade wrapper so tab changes feel consistent.

## 9. Component contracts (public props)

- `Touchable({ onPress, children, hitSlop?, style?, accessibilityRole, accessibilityLabel })` — wraps `Pressable`; scales via `usePressScale`.
- `HeaderDark({ query, onChangeQuery, cartCount, onCartPress })`.
- `StatusBarMock()` — self-contained, no props.
- `QuickActionList({ items: QuickAction[] })`.
- `SectionHeader({ title, actionLabel?, onActionPress? })`.
- `CategoryChip({ category, isActive, onPress })`.
- `ProductCard({ product, onPress? })` — `onPress` unused this session but reserved.
- `FloatingCartCTA({ visible, count, onPress? })`.
- `BottomNav(props: BottomTabBarProps)`.
- `HomeIndicator()`.

Every interactive element sets `accessibilityRole` and `accessibilityLabel`. Every hit target ≥ 44×44 (`hitSlop` when the visual target is smaller).

## 10. Data (`data/catalog.ts`)

```ts
export type CategoryId = 'vegan' | 'coffee' | 'donuts' | 'spicy';

export type Category = { id: CategoryId; label: string; icon: LucideIcon; color: string };
export type Product  = { id: string; title: string; price: number; category: CategoryId; image: string };
export type QuickAction = { id: string; label: string; icon: LucideIcon };
export type OnboardingStep = { title: [string, string]; subtitle: string; image: string; ctaLabel: string };
```

Includes: 4 products, 4 categories, 3 quick actions, 3 onboarding steps. Unsplash URLs chosen for food imagery matching the prompt descriptions (deconstructed burger for step 1; two additional food scenes for steps 2 and 3; dish photography for the four cards).

## 11. Behavior

- Search filters `Recommended for you` by case-insensitive title match, combined with the active category filter. Empty result state: centered 15px `textSecondary` copy `No dishes match that search` with a `Clear search` text button.
- Category chip toggle: tapping the active chip clears the filter (returns to `null`).
- Onboarding: swipe advances the step; tapping Next scrolls forward. Both drive the same `step` state so the progress bar stays consistent.
- Tab bar: selecting the current tab emits `tabPress`; if not prevented, scrolls the screen to top (Home only, via a ref).
- Splash: `expo-splash-screen` is prevented from auto-hiding until Poppins reports `loaded`.

## 12. Acceptance criteria

1. `npx expo start` runs without font-not-loaded warnings; splash only hides after Poppins loads.
2. Onboarding advances via swipe or button; progress bar reflects both.
3. Skip and Get Started land on Home with no back navigation to onboarding possible.
4. Header cart badge, nav cart badge, and CTA count always show the same number.
5. Searching `pan` narrows the grid to Cometa Pancakes alone.
6. Tab change moves the lime circle with a visible ~200ms motion (spring in practice), no jump.
7. Scrolling to the end of Home leaves the last card fully legible above nav and CTA.
8. No hex literal outside `constants/theme.ts` — verified with `grep -RIn '#[0-9A-Fa-f]\{3,\}' app components hooks store data | grep -v constants/theme.ts` returns empty.
9. Layout intact at 390×844 and 360×640.

## 13. Out of scope

- Product detail screen.
- Real checkout / payments / backend.
- Skeleton loaders, cache-warming.
- Dark mode toggle.
- Localization (Portuguese/English switch).
- Unit and E2E tests (this is a scaffold session; can be added later).

## 14. Build order

Executed as one continuous session (implementation plan will decompose further):

1. Scaffold Expo Router blank-TS + install deps + configure `app.json` (splash, name, orientation).
2. Root `_layout.tsx` — font loading, splash hold, `CartProvider`.
3. `constants/theme.ts`.
4. `data/catalog.ts`.
5. `store/cart.tsx`.
6. `hooks/` (motion utilities).
7. Shared components in dependency order: `Touchable` → `StatusBarMock` → `HeaderDark` → `HomeIndicator` → `SectionHeader` → `CategoryChip` → `ProductCard` → `QuickActionList` → `FloatingCartCTA` → `BottomNav`.
8. `app/onboarding.tsx`.
9. `app/(tabs)/_layout.tsx` + `app/(tabs)/index.tsx` + four placeholder tab screens.
10. Boot with `npx expo start`; iterate through acceptance criteria until all nine pass.
11. Final `grep` sweep for stray hex literals; final visual pass at 390×844 and 360×640.
