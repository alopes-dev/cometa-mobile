# Home / Browse & Discovery — Phase 4a Design

**Goal:** Replace the Home tab's placeholder with the first real product screens: a browsable restaurant feed (search + category filter + restaurant list) and a Restaurant Detail screen showing its menu. Working against mock data — no backend exists yet.

**Status:** Phases 1-3 (tokens, atoms, navigation shell) are complete and merged. "Phase 4 — Customer Experience" was too broad to spec as one project and was decomposed into three build-ordered sub-phases:

1. **4a — Home / Browse & Discovery** (this spec)
2. **4b — Cart & Checkout** (depends on 4a: needs items to add to a cart)
3. **4c — Order Tracking & History** (depends on 4b: needs orders to exist)

Each sub-phase gets its own spec → plan → implementation cycle.

## Scope

In scope:
- Restaurants vertical only (not markets/pharmacies — those can reuse these patterns in a future phase).
- Mock/static data behind a swappable data-access module — no real API integration.
- Home feed screen: search bar, category filter chips, restaurant list.
- Restaurant Detail screen: header info + menu grouped by category, view-only (no add-to-cart).
- Two new reusable design-system molecules (`SearchBar`, `Card`) and three feature-specific components (`CategoryChipList`, `RestaurantCard`, `MenuItemRow`).
- Restaurant Detail presented as a full-screen modal (tab bar hidden).

Out of scope (future sub-phases or later work):
- Cart, add-to-cart interaction, checkout (Phase 4b).
- Order tracking, order history (Phase 4c).
- Real backend/API integration.
- Multi-vertical browsing (markets, pharmacies).
- Delivery address selection (Home assumes a single implicit delivery context for now).
- Promotional banners/carousels.

## Data layer

`src/features/home/types.ts`:

```ts
export type Restaurant = {
  id: string;
  name: string;
  imageUrl: string;
  rating: number; // 0-5
  cuisine: string;
  deliveryTimeMinutes: number;
  deliveryFee: number; // AOA
};

export type MenuItem = {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number; // AOA
  imageUrl: string;
  category: string; // e.g. "Entradas", "Pratos Principais", "Bebidas"
};
```

`src/features/home/mockData.ts` — a hand-written array of ~6 restaurants (Angola-flavored names/cuisines, prices in AOA) and ~4-6 `MenuItem`s per restaurant, covering at least 3 distinct cuisine categories so category filtering has real data to filter. Images are remote placeholder URLs (e.g. `https://picsum.photos/seed/<restaurant-id>/400/300`), not bundled assets.

`src/features/home/data.ts` — the only module anything else imports from:

```ts
export function getRestaurants(): Restaurant[];
export function getRestaurantById(id: string): Restaurant | undefined;
export function getMenuItems(restaurantId: string): MenuItem[];
export function getCategories(): string[]; // derived, deduped, from mock restaurants' cuisines
```

Nothing outside `data.ts` imports `mockData.ts` directly. Swapping in a real API later means rewriting these four functions' internals only.

## New design-system molecules

`src/components/design-system/molecules/`, following the atoms' existing folder-per-component convention (`Molecule/Molecule.tsx`, `Molecule.styles.ts`, `Molecule.test.tsx`, `index.ts`):

- **`SearchBar`** — composes the existing `TextField` atom with a leading search `Icon`. Props: `value: string`, `onChangeText: (text: string) => void`, `placeholder?: string`. Pill-shaped per the design system's input styling.
- **`Card`** — a generic elevated surface wrapping arbitrary `children`: 16pt corner radius, Level-1 elevation shadow (per `docs/superpowers/DESIGN-SYSTEM.md`), themed background via `theme.colors.surface`. No domain knowledge — `RestaurantCard` composes it, doesn't duplicate its styling.

Both are added to a new `src/components/design-system/molecules/index.ts` barrel export, mirroring the atoms barrel.

## Feature-specific components

`src/features/home/components/`, same folder-per-component convention as atoms/molecules:

- **`CategoryChipList`** — horizontal scrollable row of `Chip` atoms: one "All" chip plus one per category from `getCategories()`. Props: `categories: string[]`, `selected: string | null`, `onSelect: (category: string | null) => void`. Purely presentational — the Home screen owns the selected-category state.
- **`RestaurantCard`** — wraps `Card`; shows the restaurant's image, name (`Text` variant `bodyEmphasized`), a rating row (star `Icon` + `Text`), cuisine, and delivery time/fee. Props: `restaurant: Restaurant`, `onPress: () => void`.
- **`MenuItemRow`** — image thumbnail (fixed size), name, truncated description, price. Props: `item: MenuItem`. View-only — no add button, no `onPress` (per the phase's scope decision to defer cart interaction to 4b).

## Screens & navigation

**`src/app/(tabs)/(home)/index.tsx`** (rewritten) — the Home feed:
- `SearchBar` at the top; local `searchQuery` state.
- `CategoryChipList` below it; local `selectedCategory` state.
- A scrollable list of `RestaurantCard`s from `getRestaurants()`, filtered client-side: matches `selectedCategory` (if set) AND matches `searchQuery` against `name`/`cuisine` (case-insensitive substring, if non-empty).
- Tapping a `RestaurantCard` calls `router.push(`/restaurant/${restaurant.id}`)` (relative to the `(home)` group, so it resolves under the tab's own stack).
- Empty state: if the filtered list is empty, show a centered `Text` ("Nenhum restaurante encontrado" or similar) instead of an empty scroll view.

**`src/app/(tabs)/(home)/restaurant/[id].tsx`** (new) — Restaurant Detail:
- Reads `id` via `useLocalSearchParams<{ id: string }>()`.
- Looks up the restaurant via `getRestaurantById(id)`. If not found (shouldn't happen via normal navigation, but guards against a stale/bad deep link), renders a simple "Restaurant not found" state instead of crashing.
- Header: restaurant image (banner), name, rating, cuisine, delivery time/fee — reusing the same `Text`/`Icon` composition style as `RestaurantCard` but laid out vertically as a page header, not a card.
- Menu: `getMenuItems(id)` grouped by `category`, rendered as sections (category name as a section header `Text`, then each item as a `MenuItemRow`).
- Presented as a full-screen modal: `<Stack.Screen name="restaurant/[id]" options={{ presentation: 'modal', headerShown: true, title: restaurant?.name ?? 'Restaurante' }} />` added to `(tabs)/(home)/_layout.tsx`'s existing `Stack` (which currently only declares `index`). Modal gets its own header (title + default close/back affordance), tab bar hidden while it's presented — standard `presentation: 'modal'` behavior in Expo Router.

`(tabs)/(home)/_layout.tsx` is modified (not replaced) to add the new `Stack.Screen` alongside the existing `index` one.

## Testing

Matches the established convention from Phase 3 (colocated tests for logic-bearing files, route files left thin and untested directly):

- `data.ts` — unit tests: `getRestaurants()` returns a non-empty array of the expected shape; `getRestaurantById()` returns the correct restaurant for a known id and `undefined` for an unknown one; `getMenuItems()` returns only items matching the given `restaurantId`; `getCategories()` returns a deduped list.
- `SearchBar`, `Card` — colocated render/interaction tests (same style as the Phase 2 atoms: theme-wrapped render, `fireEvent` for interaction where applicable).
- `CategoryChipList`, `RestaurantCard`, `MenuItemRow` — colocated tests: renders expected content from props, `onPress`/`onSelect` fire correctly where applicable.
- `(tabs)/(home)/index.tsx` and `restaurant/[id].tsx` — no dedicated test files (thin route files); correctness verified via `tsc --noEmit`, `expo export`, and a manual run-through (search/filter/tap-through/modal-dismiss) on a simulator.

## Open questions / risks

None — all prior open questions (phase decomposition, vertical scope, screens in scope, add-to-cart scope, detail page chrome) were resolved during brainstorming.
