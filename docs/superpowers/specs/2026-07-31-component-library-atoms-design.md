# Component Library — Phase 2: Atoms

## Context

`docs/superpowers/DESIGN-SYSTEM.md` defines the Cometa visual language (Apple HIG, Inter, orange `#FF9500` primary, light/dark neutrals). Phase 1 implemented those values as tokens in `src/constants/theme.ts` (colors, colorsDark, typography, spacing, radius, elevation, opacity, motion), consumed statically (light-only) by the two files that currently exist under `src/app/`.

CLAUDE.md's Design System section lays out an Atomic Design progression: `Foundations → Tokens → Atoms → Molecules → Organisms → Templates → Pages`. This spec covers **Atoms** — the smallest, domain-agnostic UI primitives every later phase (Molecules, Organisms, product screens) will be built from.

## Goals

- Ship a small set of theme-driven atoms with no business/domain logic.
- Wire up real light/dark theme switching (`colorsDark` currently has no runtime consumer).
- Establish the styling and testing conventions the rest of the component library will follow.

## Non-goals (deferred to later phases)

- Specialized inputs that compose `TextField` with extra logic — Password, OTP, Search, Phone, Currency (Molecules).
- Domain/business components — Cards (Restaurant/Product/Order/...), Navigation (Bottom Nav, Tab Bar), Delivery/Maps/Commerce components (Organisms and up).
- Restoring the onboarding/tabs/cart screens deleted earlier in this project's history — this spec only touches the design-system layer, not `src/app` screens beyond wiring the new `ThemeProvider`.

## Architecture

### Location

New `src/design-system/` folder, sibling to `src/constants/` (which is untouched — `theme.ts` stays where it is):

```
src/design-system/
├── ThemeProvider.tsx
└── atoms/
    ├── Text.tsx
    ├── Button.tsx
    ├── TextField.tsx
    ├── Icon.tsx
    ├── Avatar.tsx
    ├── Badge.tsx
    ├── Chip.tsx
    ├── Switch.tsx
    ├── Checkbox.tsx
    ├── Radio.tsx
    └── index.ts        # barrel export
```

### Theming (light/dark)

`ThemeProvider.tsx`:
- Reads `useColorScheme()` from `react-native`.
- Composes two `styled-components` themes from `theme.ts`'s exports:
  - `light`: `{ colors, typography, spacing, radius, elevation, opacity, motion, scheme: 'light' }`
  - `dark`: same shape but `colors: colorsDark` and `elevation: { ...elevation, level2: elevation.level2Dark }` (reuses the existing `level2Dark` export instead of restructuring `theme.ts`).
- Wraps children in `styled-components/native`'s `ThemeProvider` with the selected theme.
- A `declare module 'styled-components/native' { export interface DefaultTheme extends Theme {} }` augmentation (in `ThemeProvider.tsx` or a co-located `styled.d.ts`) types `props.theme` in every styled component without per-file generics.

`src/app/_layout.tsx` wraps its content in `<ThemeProvider>`. Its `Root` styled component and `src/app/index.tsx`'s `Screen`/`Title` switch from the static `colors.x` import to `${({ theme }) => theme.colors.x}`, so dark mode has an observable effect today.

### Icon strategy

`Icon` renders:
- `expo-symbols`' `SymbolView` with an SF Symbol name when `Platform.OS === 'ios'` and a `sf` prop is given.
- `@expo/vector-icons`'s `Ionicons` (outline-first, closest visual match to SF Symbols, matching CLAUDE.md's "outline as default" icon guidance) otherwise, using the required `name` prop.

Props: `name` (Ionicons name, required — the universal fallback), `sf` (SF Symbol name, optional, iOS-preferred), `size` (number, default 24), `color` (theme color, default `textPrimary`).

This mirrors the `sf`/`md`-style dual-prop convention Expo Router itself uses for `NativeTabs.Trigger.Icon`.

`lucide-react-native` (unused, unrelated to this icon strategy) is removed from `package.json`.

### Dependencies

Add: `@expo/vector-icons` (Icon fallback), `expo-haptics` (Button press feedback — DESIGN-SYSTEM.md calls for haptic feedback on primary button press), `@testing-library/react-native` + `react-test-renderer` (dev, component interaction tests).

Remove: `lucide-react-native`.

`expo-symbols` is already present (transitive), no install needed.

## Atoms

All examples below use theme values via `props.theme` (from `ThemeProvider`), not static imports — this is the pattern every atom follows.

### Text

Thin wrapper over RN `Text`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | key of `theme.typography` | `'body'` | Sets `fontFamily`/`fontSize`/`lineHeight`/`letterSpacing` |
| `color` | key of `theme.colors` | `'textPrimary'` | |
| ...rest | RN `Text` props | | passthrough (`numberOfLines`, `accessibilityRole`, etc.) |

### Button

`Pressable`-based.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'outline' \| 'text' \| 'danger' \| 'success'` | `'primary'` | Controls background/border/label color |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height/padding/font size |
| `shape` | `'default' \| 'pill' \| 'circle'` | `'default'` | `circle` covers icon-only/floating buttons — no separate `IconButton`/`FloatingButton` atom |
| `loading` | `boolean` | `false` | Shows `ActivityIndicator` in place of label, blocks press |
| `disabled` | `boolean` | `false` | |
| `icon` | `ReactNode` | — | Leading icon slot (typically an `Icon`) |
| `onPress` | `() => void` | — | Fires `expo-haptics`' `impactAsync(Light)` before calling through |
| `children` | `ReactNode` | — | Label, rendered via `Text` |

Minimum 44×44 hit target regardless of `size`/`shape`.

**Variant → color mapping** (background / label / border):

| Variant | Background | Label | Border |
|---|---|---|---|
| `primary` | `colors.primary` | `colors.onPrimary` | none |
| `secondary` | `colors.secondary` | `colors.onSecondary` | none |
| `success` | `colors.success` | `colors.onPrimary` (white) | none |
| `danger` | `colors.error` | `colors.onPrimary` (white) | none |
| `outline` | transparent | `colors.primary` | 1px `colors.primary` |
| `ghost` | `colors.surface` | `colors.textPrimary` | none |
| `text` | transparent | `colors.primary` | none |

`disabled` renders at `opacity[40]` regardless of variant.

### TextField

Base input only (label, value, error/helper text, focus border) — no icon slots, no masking/formatting.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | — | |
| `value` | `string` | — | |
| `onChangeText` | `(text: string) => void` | — | |
| `error` | `string` | — | Presence switches border/label to `colors.error` and renders the message below the field |
| `helperText` | `string` | — | Rendered below the field when `error` is absent |
| `disabled` | `boolean` | `false` | |
| ...rest | RN `TextInput` props | | passthrough (`placeholder`, `keyboardType`, `secureTextEntry`, etc. — composed variants like Password build a molecule around this later) |

12pt radius, `colors.surface` background, border transitions to `colors.primary` on focus (per DESIGN-SYSTEM.md).

### Icon

Covered above under "Icon strategy".

### Avatar

| Prop | Type | Default | Notes |
|---|---|---|---|
| `source` | `ImageSourcePropType` | — | |
| `initials` | `string` | — | Fallback rendered when `source` is absent |
| `size` | `number` | `40` | |

Circular. No status dot (that composition is a Molecule).

### Badge

| Prop | Type | Default | Notes |
|---|---|---|---|
| `count` | `number` | — | `0` renders nothing (badge hides itself); `1`–`99` renders the number; above `99` renders "99+"; omit entirely for dot-only mode |
| `variant` | `'primary' \| 'error' \| 'success' \| 'neutral'` | `'error'` | Background color |

### Chip

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | — | |
| `selected` | `boolean` | `false` | Switches to a tinted `colors.primary` background (low-saturation: `primary` at `opacity[10]`) with `colors.primary` label/border, per DESIGN-SYSTEM.md |
| `onPress` | `() => void` | — | |
| `icon` | `ReactNode` | — | Optional leading icon |

Pill radius (`theme.radius.pill`).

### Switch

Thin themed wrapper over RN's built-in `Switch`.

| Prop | Type | Notes |
|---|---|---|
| `value` | `boolean` | |
| `onValueChange` | `(value: boolean) => void` | |
| `disabled` | `boolean` | |

`trackColor`/`thumbColor` sourced from theme (on: `primary`, off: `border`).

### Checkbox

No RN built-in equivalent — custom.

| Prop | Type | Default |
|---|---|---|
| `checked` | `boolean` | `false` |
| `onChange` | `(checked: boolean) => void` | — |
| `disabled` | `boolean` | `false` |

Square, `radius.sm` corners, `Icon` checkmark (`name="checkmark"`) shown when `checked`, `primary` fill.

### Radio

| Prop | Type | Default |
|---|---|---|
| `selected` | `boolean` | `false` |
| `onPress` | `() => void` | — |
| `disabled` | `boolean` | `false` |

Circular, single-selection semantics (grouping/exclusivity is the consumer's responsibility — no `RadioGroup` in this phase).

## Testing

Add `@testing-library/react-native` + `react-test-renderer` as dev dependencies. Interaction tests for the 6 interactive atoms:

- **Button**: `onPress` fires on press; does not fire when `disabled` or `loading`; renders `ActivityIndicator` when `loading`.
- **TextField**: `onChangeText` fires with typed text; renders `error` message and applies error styling when `error` is set.
- **Chip**: `onPress` fires; visual selected state reflects `selected` prop.
- **Switch**: `onValueChange` fires with the toggled value.
- **Checkbox**: `onChange` fires with the toggled value; does not fire when `disabled`.
- **Radio**: `onPress` fires; does not fire when `disabled`.

`Text`, `Icon`, `Avatar`, `Badge` are presentational — no dedicated tests beyond type-checking and transitive exercise from the interactive atoms' tests.

## Verification

- `tsc --noEmit` clean.
- `npx jest` — new interaction tests pass, existing tests unaffected.
- `npx expo export --platform ios` still bundles successfully (this has been the running smoke test throughout this project).
- Manually confirm `src/app/index.tsx` visibly changes when the simulator's system appearance is toggled between light/dark, proving `ThemeProvider` actually switches.
