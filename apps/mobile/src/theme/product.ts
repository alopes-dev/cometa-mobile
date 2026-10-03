import { fontFamily } from './typography';

/**
 * Product-board tokens — the measured values on page "10 — Products" of
 * Figma file PAuqq5xMI0yQtx8POz4TUL (frame 48:20693, the product detail, and
 * 48:20733, its added-to-cart state).
 *
 * Scoped here for the same reason `business.ts` is scoped: the board sets
 * type at sizes the shared ramp has no step for — Inter Regular at 14, Inter
 * SemiBold at 22 — and bending the ramp to fit one screen would re-set type
 * on every other screen that uses it. The two steps the ramp *does* already
 * carry are deliberately absent below: `Nome` (48:20709) is Poppins Bold 28,
 * which is `h1`, and `Título` (48:20713) is Poppins SemiBold 16, which is
 * `h5`. Those screens read the ramp directly.
 *
 * COLOUR IS NOT HERE, the same deliberate omission `business.ts` makes.
 * Every colour the board draws maps onto an existing semantic token —
 * #212121 to `text.primary`, #616161 to `text.secondary`, #9e9e9e to
 * `text.muted`, #fafafa to `background.secondary`, #eee to `border.subtle`
 * and the accent onto the brand ramp — so the components read those and keep
 * working in dark mode, which a frozen hex table would not.
 *
 * Note on the accent: the board draws #1bac4b, a brighter grass green than
 * the app's `brand.base` (#0A7D53). It is mapped onto the ramp rather than
 * frozen, exactly as the business board's accent was — two greens a few
 * degrees apart read as a bug, not a system (see `semantic.ts`).
 */

/**
 * Type steps, transcribed per node. Unitless Figma multipliers are resolved
 * against the font size and rounded to the nearest pixel (14 x 1.5 = 21);
 * where Figma says `leading-[normal]` the step carries no `lineHeight` and
 * the platform default applies.
 */
const type = {
  /** `Descrição` — node 48:20710. 14 x 1.5. */
  description: { fontFamily: fontFamily.text.regular, fontSize: 14, lineHeight: 21 },
  /** `Preço` — node 48:20711. */
  price: { fontFamily: fontFamily.text.semibold, fontSize: 22 },
  /** `Nome` — nodes 48:20715, 48:20718, 48:20721. */
  optionLabel: { fontFamily: fontFamily.text.regular, fontSize: 14 },
  /** `Menos` / `Mais` — nodes 48:20725, 48:20727. */
  stepperSign: { fontFamily: fontFamily.text.regular, fontSize: 22 },
  /** `Valor` — node 48:20726. */
  stepperValue: { fontFamily: fontFamily.text.semibold, fontSize: 14 },
  /** `Etiqueta` — nodes 48:20730 and 48:20770. */
  actionLabel: { fontFamily: fontFamily.text.semibold, fontSize: 14 },
  /** `Resumo` / `Ação` — nodes 48:20773, 48:20774. */
  cartBar: { fontFamily: fontFamily.text.semibold, fontSize: 14 },
} as const;

/** Measured geometry, named per the Figma layer that carries each value. */
const metrics = {
  /** `Imagem do produto` — node 48:20700. */
  heroHeight: 310,

  /** `Ações` — node 48:20702, and the two buttons inside it. */
  actionsInset: 18,
  actionsTop: 12,
  actionSize: 40,
  actionIconSize: 19,

  /** `Detalhe` — node 48:20707. */
  detailPaddingHorizontal: 20,
  detailPaddingVertical: 24,
  detailGap: 20,

  /** `Título e preço` — node 48:20708. */
  titleGap: 8,

  /** `Personalizar` — node 48:20712. */
  customizeGap: 12,
  /** `Opção` — nodes 48:20714, 48:20717, 48:20720. */
  optionHeight: 42,
  /** `Seleção` — nodes 48:20716, 48:20719, 48:20722. */
  optionBoxSize: 20,
  optionBoxRadius: 6,

  /** `Quantidade e ação` — node 48:20723. */
  actionRowGap: 14,
  /** Shared by `Quantidade` and `Ação principal` — nodes 48:20724, 48:20729. */
  controlHeight: 54,
  controlRadius: 16,
  /** `Quantidade` — node 48:20724. */
  stepperPaddingHorizontal: 14,
  stepperGap: 16,

  /** `Carrinho flutuante` — node 48:20772, measured off frame 48:20733. */
  cartBarInset: 14,
  cartBarBottom: 18,
  cartBarHeight: 64,
  cartBarRadius: 16,
  cartBarPaddingHorizontal: 18,
} as const;

/**
 * The lift under the two hero buttons — `0px 3px 12px rgba(9,16,29,0.07)` on
 * nodes 48:20703 and 48:20705. Its own value rather than a `shadows` level,
 * for the reason `business.ts` gives: `sm` is flatter and `md` wider than
 * what the board draws, and these buttons have to lift off a photograph.
 */
const actionShadow = { offsetY: 3, radius: 12, opacity: 0.07, elevation: 3 } as const;

/**
 * `Carrinho flutuante` — node 48:20772, `0px 8px 24px rgba(9,16,29,0.12)`.
 * Close to `shadows.lg` but not it: the board's is tighter (24 vs 28) and
 * lighter (0.12 vs 0.14), and `lg` is reserved for sheets and modals.
 */
const cartBarShadow = { offsetY: 8, radius: 24, opacity: 0.12, elevation: 12 } as const;

/**
 * `Motion` — node 48:20731, the board's own annotation: "Add-to-cart · botão
 * press scale 0,98 · 150 ms". An annotation, not a layer, so it is specified
 * here and applied by the button rather than rendered as text.
 */
const motion = { pressScale: 0.98, pressDuration: 150 } as const;

export const product = { type, metrics, actionShadow, cartBarShadow, motion } as const;

export type ProductTokens = typeof product;
export type ProductTypeStep = keyof typeof type;
