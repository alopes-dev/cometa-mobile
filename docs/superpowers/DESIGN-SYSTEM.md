---
name: Kometa Delivery
# These values mirror apps/mobile/src/theme/ exactly. The theme files are the
# source of truth; this block is a readable index of them, not a second system.
brand:
  50: "#EBFAF2"
  100: "#CFF3E1"
  200: "#A3E6C6"
  300: "#66D2A4"
  400: "#2DB880"
  500: "#109B68"
  600: "#0A7D53"
  700: "#096341"
  800: "#084E34"
  900: "#06402B"
neutral:
  0: "#FFFFFF"
  50: "#FAFAFB"
  100: "#F4F5F6"
  200: "#E8EAEC"
  300: "#D7DADE"
  400: "#AEB4BA"
  500: "#848B93"
  600: "#5F666E"
  700: "#454B52"
  800: "#2C3137"
  900: "#1A1D21"
  950: "#0E1013"
fonts:
  display: Poppins
  text: Inter
spacing: [0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64]
radius:
  xs: 4
  sm: 8
  md: 12
  lg: 16
  xl: 20
  xxl: 24
  full: 9999
---

# Kometa Design System

Kometa is a delivery marketplace. The interface has one job: make food, shops and
prices easy to read and act on. The system is **neutral-first** — roughly 70–80%
of any screen is white, off-white and grey; the brand green appears where it
means something, and semantic colors appear only when they carry state.

> The test for any screen: does it look *green*, or does it look *Kometa*?
> If the answer is green, the brand color is doing work that typography,
> spacing and hierarchy should be doing instead.

## Where things live

```
apps/mobile/src/theme/
  palette.ts      raw ramps — the ONLY file allowed to contain a hex literal
  semantic.ts     light + dark semantic tokens (what components consume)
  roles.ts        flat foreground/fill vocabularies for Text, Icon and Badge
  typography.ts   font families + the type ramp
  spacing.ts      4-point scale + layout constants
  radius.ts       corner radii
  shadows.ts      four elevation levels, per scheme
  motion.ts       durations, spring, press feedback, opacity
  mixins.ts       elevate() / textStyle() / continuousCorners
  index.ts        the single entry point: import { ... } from '@/theme'
```

`ThemeProvider` maps these onto a styled-components theme. Inside a styled
template, read `theme.colors.*`, `theme.spacing[n]`, `theme.radius.*`,
`theme.typography.*`, `theme.fg[role]`, `theme.fill[role]`.

## Principles

1. **Clarity over decoration.** If a border, shadow or color is not helping the
   user find or understand something, remove it.
2. **Content over chrome.** Photography of food is the most valuable thing on
   most screens. The system frames it; it never competes with it.
3. **Neutral over brand saturation.** Brand color marks the primary action and
   the current state. Nothing else.
4. **Consistency over per-screen cleverness.** A decision belongs in the theme
   or a primitive, never in a screen.
5. **Accessibility over aesthetic preference.** If a color cannot carry text at
   AA, it does not become text. A variant is created instead.
6. **Never state by color alone.** Every status carries an icon and a label.

## Color

### Rules of use

| Role | Token | Notes |
|---|---|---|
| Primary CTA fill | `brand.base` (`brand.600`) | White label at **5.16:1** |
| CTA pressed | `brand.pressed` (`brand.700`) | |
| Brand text, links, prices | `text.brand` / `text.link` (`brand.700`) | **7.31:1** on white |
| Selected row / chip | `surface.selected` + `border.selected` + `text.brand` | Subtle, not a solid slab |
| Graphic accent, map route | `brand.graphic` (`brand.500`) | Never behind text |
| Body copy | `text.primary` (`neutral.900`) | **16.91:1** |
| Secondary copy | `text.secondary` (`neutral.600`) | **5.81:1** / **5.33:1** on `surface.secondary` |
| Metadata ≥15px | `text.tertiary` (`neutral.500`) | **3.45:1** — large text only |
| Text on photography | `text.onMedia` | Fixed white in **both** schemes |
| Text on a brand fill | `text.onBrand` | Flips: white in light, near-black in dark |

### Do / Don't

| Do | Don't |
|---|---|
| Use `brand.600` as a fill and `brand.700` as text | Use one brand step for both — neither reads well at both jobs |
| Give a price `text.brand` when it needs emphasis | Make every price green by default (§19) |
| Make the secondary button neutral | Make every button green (§20) |
| Use `status.warning.fill` behind a dark label | Use `amber.500` as a text color — it is 2.30:1 |
| Reach for `surface.secondary` + a hairline | Stack a card inside a card |
| Put a new color in `palette.ts` | Write a hex in a component |

### Ramps

Measured, not asserted — `src/theme/contrast.test.ts` fails the build if any of
these pairs stops meeting its threshold.

#### brand
| Step | HEX | on white | white on it | on #0E1013 |
|---|---|---|---|---|
| `brand.50` | `#EBFAF2` | 1.08 | 1.08 | 17.68 |
| `brand.100` | `#CFF3E1` | 1.20 | 1.20 | 15.93 |
| `brand.200` | `#A3E6C6` | 1.43 | 1.43 | 13.33 |
| `brand.300` | `#66D2A4` | 1.86 | 1.86 | 10.27 |
| `brand.400` | `#2DB880` | 2.54 | 2.54 | 7.51 |
| `brand.500` | `#109B68` | 3.55 | 3.55 | 5.36 |
| `brand.600` | `#0A7D53` | 5.16 | 5.16 | 3.69 |
| `brand.700` | `#096341` | 7.31 | 7.31 | 2.61 |
| `brand.800` | `#084E34` | 9.77 | 9.77 | 1.95 |
| `brand.900` | `#06402B` | 11.82 | 11.82 | 1.61 |

#### neutral
| Step | HEX | on white | white on it | on #0E1013 |
|---|---|---|---|---|
| `neutral.0` | `#FFFFFF` | 1.00 | 1.00 | 19.05 |
| `neutral.50` | `#FAFAFB` | 1.04 | 1.04 | 18.27 |
| `neutral.100` | `#F4F5F6` | 1.09 | 1.09 | 17.45 |
| `neutral.200` | `#E8EAEC` | 1.21 | 1.21 | 15.80 |
| `neutral.300` | `#D7DADE` | 1.40 | 1.40 | 13.58 |
| `neutral.400` | `#AEB4BA` | 2.09 | 2.09 | 9.11 |
| `neutral.500` | `#848B93` | 3.45 | 3.45 | 5.53 |
| `neutral.600` | `#5F666E` | 5.81 | 5.81 | 3.28 |
| `neutral.700` | `#454B52` | 8.82 | 8.82 | 2.16 |
| `neutral.800` | `#2C3137` | 13.11 | 13.11 | 1.45 |
| `neutral.900` | `#1A1D21` | 16.91 | 16.91 | 1.13 |
| `neutral.950` | `#0E1013` | 19.05 | 19.05 | 1.00 |

#### red
| Step | HEX | on white | white on it | on #0E1013 |
|---|---|---|---|---|
| `red.50` | `#FEF0EF` | 1.11 | 1.11 | 17.17 |
| `red.100` | `#FCD9D6` | 1.31 | 1.31 | 14.55 |
| `red.200` | `#F8ADA6` | 1.82 | 1.82 | 10.45 |
| `red.300` | `#F2766B` | 2.77 | 2.77 | 6.88 |
| `red.400` | `#E85042` | 3.71 | 3.71 | 5.13 |
| `red.500` | `#E0352B` | 4.46 | 4.46 | 4.28 |
| `red.600` | `#C62A21` | 5.59 | 5.59 | 3.41 |
| `red.700` | `#9F211A` | 7.76 | 7.76 | 2.46 |
| `red.800` | `#7A1914` | 10.62 | 10.62 | 1.79 |
| `red.900` | `#5C1310` | 13.50 | 13.50 | 1.41 |

#### amber
| Step | HEX | on white | white on it | on #0E1013 |
|---|---|---|---|---|
| `amber.50` | `#FFF8EB` | 1.06 | 1.06 | 18.04 |
| `amber.100` | `#FDEBC8` | 1.17 | 1.17 | 16.23 |
| `amber.200` | `#FBD68E` | 1.39 | 1.39 | 13.71 |
| `amber.300` | `#F8BC4F` | 1.71 | 1.71 | 11.16 |
| `amber.400` | `#F5A623` | 2.03 | 2.03 | 9.40 |
| `amber.500` | `#F2960B` | 2.30 | 2.30 | 8.30 |
| `amber.600` | `#B86E05` | 3.98 | 3.98 | 4.78 |
| `amber.700` | `#8F5604` | 6.00 | 6.00 | 3.18 |
| `amber.800` | `#6B4003` | 8.90 | 8.90 | 2.14 |
| `amber.900` | `#4D2E02` | 12.30 | 12.30 | 1.55 |

#### blue
| Step | HEX | on white | white on it | on #0E1013 |
|---|---|---|---|---|
| `blue.50` | `#EDF4FF` | 1.11 | 1.11 | 17.22 |
| `blue.100` | `#D7E6FF` | 1.26 | 1.26 | 15.11 |
| `blue.200` | `#AECCFF` | 1.63 | 1.63 | 11.69 |
| `blue.300` | `#7FB0FF` | 2.20 | 2.20 | 8.67 |
| `blue.400` | `#4C92FA` | 3.09 | 3.09 | 6.17 |
| `blue.500` | `#2E7CF6` | 3.94 | 3.94 | 4.84 |
| `blue.600` | `#1760D4` | 5.74 | 5.74 | 3.32 |
| `blue.700` | `#1049A6` | 8.31 | 8.31 | 2.29 |
| `blue.800` | `#0C3677` | 11.60 | 11.60 | 1.64 |
| `blue.900` | `#082651` | 14.93 | 14.93 | 1.28 |

#### violet
| Step | HEX | on white | white on it | on #0E1013 |
|---|---|---|---|---|
| `violet.50` | `#F4F0FF` | 1.12 | 1.12 | 17.02 |
| `violet.100` | `#E7DEFF` | 1.29 | 1.29 | 14.78 |
| `violet.200` | `#CFBEFF` | 1.69 | 1.69 | 11.31 |
| `violet.300` | `#B9A6FF` | 2.11 | 2.11 | 9.04 |
| `violet.400` | `#8E74F5` | 3.52 | 3.52 | 5.41 |
| `violet.500` | `#7857EF` | 4.76 | 4.76 | 4.00 |
| `violet.600` | `#6938EF` | 6.15 | 6.15 | 3.10 |
| `violet.700` | `#5325C4` | 8.64 | 8.64 | 2.20 |
| `violet.800` | `#3F1C94` | 11.63 | 11.63 | 1.64 |
| `violet.900` | `#2C1369` | 14.95 | 14.95 | 1.27 |

### Semantic states

| State | Tint bg | Text on tint | Fill | Label on fill |
|---|---|---|---|---|
| Success | `#E9F8EF` | `brand.700` — 6.78 | `brand.600` | white — 5.16 |
| Error | `#FEF0EF` | `red.600` — 5.04 | `red.600` | white — 5.59 |
| Warning | `#FFF8EB` | `amber.700` — 5.68 | `amber.500` | near-black |
| Info | `#EDF4FF` | `blue.600` — 5.19 | `blue.600` | white |

**Success deliberately maps onto the brand ramp.** Two greens fifteen degrees
apart read as a bug, not a system. Error, warning and info are fully
independent, which is what §16 actually asks for — the primary color must not
represent *every* state.

### Delivery status

Keys mirror `TRACKING_STAGES` exactly, and a test enforces that, so a new stage
cannot ship without a color.

| Stage | Color family |
|---|---|
| `confirmed` | info |
| `preparing` | warning |
| `ready` | brand |
| `on-the-way` | info |
| `picked-up` | info |
| `arriving` | brand |
| `delivered` | brand / success |
| `cancelled` | error |

Render these only through `StatusChip`, which requires a label and takes an
icon. There is no color-only variant, by design: `warning` and `error` sit 32°
apart in hue and `featured` and `info` 39° apart, so hue alone is not a safe
signal for anyone with a color vision deficiency. Write `✓ Entregue`, never a
bare green dot.

### Promotional — three, and only three

| Use | Light | Dark | Why |
|---|---|---|---|
| Offer / discount | `brand.600` | `brand.400` | A saving *is* the brand promise |
| Featured | `violet.600` | `violet.300` | Carries a trace of the outgoing purple primary — the palette change reads as evolution, not erasure |
| Limited time | `amber.700` on `amber.50` | `amber.300` | Urgency without the alarm of red |

A campaign picks one of these. It does not get its own color.

## Dark mode

Not an inversion. Three things change structurally:

- **The base is `#0E1013`, never `#000000`.** Absolute black leaves elevated
  surfaces nowhere to go, so every layer above it reads as a seam.
- **Brand duties move up the ramp.** Light text on dark needs the lighter steps:
  `brand.300` for text, `brand.400` for fills.
- **The CTA label flips.** White on the dark-mode brand fill is only 3.55:1; a
  near-black label on it is **7.51:1**. `text.onBrand` encodes this, so a filled
  button needs no per-scheme branch.

Depth comes from `surface.elevated` against `background.primary` first. Shadow
opacity is raised in dark (a black shadow over near-black barely registers) but
kept restrained — a visible shadow in dark mode usually means the surface
contrast is too low.

`text.onMedia` is fixed white in both schemes. A scrim over a photograph is dark
regardless of color scheme, so this token must *not* flip the way `inverse` does.

## Typography

**Poppins** carries display and headings — it gives Kometa a voice at the top of
a screen. **Inter** carries everything functional: body, labels, buttons, inputs,
metadata and all numerals.

Weight is set via `fontFamily`, never `fontWeight`. With static font files loaded
by name, a `fontWeight` that disagrees with the file makes iOS synthesize a faux
weight or fall back to San Francisco.

| Token | Family | Size / line height |
|---|---|---|
| `display` | Poppins Bold | 34 / 41 |
| `h1` | Poppins Bold | 28 / 34 |
| `h2` | Poppins Bold | 24 / 30 |
| `h3` | Poppins SemiBold | 22 / 28 |
| `h4` | Poppins SemiBold | 20 / 25 |
| `title` | Inter SemiBold | 17 / 22 |
| `bodyLarge` | Inter Regular | 17 / 22 |
| `bodyStrong` | Inter SemiBold | 16 / 21 |
| `body` | Inter Regular | 16 / 21 |
| `labelLarge` | Inter SemiBold | 15 / 20 |
| `bodySmall` | Inter Regular | 15 / 20 |
| `label` | Inter SemiBold | 13 / 18 |
| `caption` | Inter Regular | 13 / 18 |
| `labelSmall` | Inter SemiBold | 12 / 16 |
| `micro` | Inter Regular | 12 / 16 |

Sizes are the Apple HIG Dynamic Type ramp, unchanged from the previous system on
purpose: renaming a ramp should not reflow a screen. Text scales with the user's
system size setting; give rows `min-height` or padding so they can grow, and
never set `allowFontScaling={false}`.

Reach for `textStyle('token')` from `@/theme` in a styled template rather than
writing `font-size`.

## Spacing

A 4-point grid, keyed by pixel value: `theme.spacing[16]`.

Named t-shirt steps were deliberately dropped. The old scale had no step for 12
or 20, which is why `12px` and `20px` literals accumulated across feature
styles — and inserting them into a named scale would have changed what `sm` and
`md` meant, silently re-spacing every screen that used them. A numeric key
cannot drift: it either exists at the value it is named after, or it fails to
compile.

| Step | Use |
|---|---|
| 2, 6 | Sub-grid. Tight text stacks and icon-to-label pairs only — prefer 4 and 8 |
| 4 | Icon to label |
| 8 | Label to control, chip internals |
| 12 | List row internals |
| 16 | Screen edge padding, default gap |
| 24 | Between sibling sections |
| 32 | Between major sections |
| 48 | Above a terminal CTA, around empty states |

Container measurements (`screenPadding`, `gutter`, `maxContentWidth`,
`minHitTarget`) live in `layout`, separate from the rhythm scale.

## Radius & elevation

`xs: 4 · sm: 8 · md: 12 · lg: 16 · xl: 20 · xxl: 24 · full: 9999`

Pair every non-`full` radius with `border-curve: continuous` so the corner reads
as an iOS squircle. `full` is for genuinely capsule-shaped controls — filter
chips, count badges, avatars. A screen of pills is overdesign (§56).

Four elevation levels: `none · sm · md · lg`. Apply them with
`elevate('sm')`, which reads both geometry and shadow color from the active
scheme:

```ts
const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.surface.primary};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  ${elevate('sm')}
`;
```

**Do not author shadows as `box-shadow`.** `css-to-react-native` compiles it
down to the legacy iOS shadow props and emits no Android `elevation`, so a
`box-shadow` string silently drops every shadow on Android.

Prefer, in order: surface contrast → a hairline border → `sm` → `md`. `lg` is
for sheets and modals only.

## Components

Primitives live in `src/components/design-system/atoms` and `molecules`; feature
compositions live under `src/features/<feature>/components`. A screen composes
components; it never defines appearance.

Every primitive defines variant, size, state (default / **pressed** / disabled /
loading), a `style` passthrough merged last, and its accessibility role and
state. Callers may override layout, not identity — a caller changing a button's
colors means the variant set is missing something.

**Buttons** (§20): only `primary`, `success` and `danger` are filled.
`secondary` and `ghost` are neutral surfaces; `outline` and `text` are brand on
transparent. The label is a *role* (`onBrand`), so one variant table works in
both schemes.

**Inputs**: `surface.secondary` fill, `radius.md`, `border.default` at rest,
`border.focus` on focus, `border.error` when invalid.

**Cards** (§27): not everything is a card. Prefer whitespace, sections and
dividers. A card is justified when it creates grouping, elevation, interaction
or context — and then it is `surface.primary` with `radius.lg` and either a
hairline or `elevate('sm')`, not both.

**Chips** (§32): unselected is `surface.secondary` with no border; selected is
`surface.selected` + `border.selected` + `text.brand`.

**Navigation** (§33): `NativeTabs` with `tintColor={theme.colors.brand.base}`.
Never a filled brand tab bar.

## Accessibility

- Text meets WCAG AA (4.5:1); `text.tertiary` is the one exception, cleared only
  for metadata at 15px and up.
- Controls a user must find — focused fields, selected options, invalid fields —
  meet 3:1 on their background (WCAG 1.4.11).
- State is never carried by color alone. Icon + label, always.
- Interactive targets are at least 44pt; `Button` derives `hitSlop` from its
  height to guarantee this at every size.
- `src/theme/contrast.test.ts` asserts all of the above against the real tokens,
  in both schemes. It is a build gate, not a guideline.

## Adding to the system

1. **Is it a value used twice?** Put it in `src/theme/`.
2. **Is it a new color?** Add the step to `palette.ts`, then give it a *role* in
   `semantic.ts` for both schemes. If it will carry text, add the pair to
   `contrast.test.ts` first and let it fail.
3. **Is it structure reused on two or more screens with a nameable role?**
   Promote it to `src/components/design-system/`. Until then it stays colocated
   with the screen. A second copy of a view is cheaper than a bad abstraction.
4. **Never introduce a second theme file.** There is one entry point.
