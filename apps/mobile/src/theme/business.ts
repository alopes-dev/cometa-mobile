import { fontFamily } from './typography';

/**
 * Business-board tokens — the measured values on page "09 — Business" of
 * Figma file PAuqq5xMI0yQtx8POz4TUL (frame 48:20601, the restaurant detail).
 *
 * Scoped here for the same reason `onboarding.ts` and `auth.ts` are scoped:
 * the board sets type at sizes the shared ramp has no step for — 10px fact
 * labels, Inter SemiBold at 14, Poppins Bold at 22 — and bending the ramp to
 * fit one screen would re-set type on every other screen that uses it.
 *
 * COLOUR IS NOT HERE, deliberately, and this is where it differs from the two
 * files above. Every colour the board draws maps onto an existing semantic
 * token — #212121 to `text.primary`, #616161 to `text.secondary`, #9e9e9e to
 * `text.muted`, #fafafa to `background.secondary`, #eee to `border.subtle`
 * and the accent to the brand ramp — so the components read those and keep
 * working in dark mode, which a frozen hex table would not.
 */

/**
 * Type steps, transcribed per node. Unitless Figma multipliers are resolved
 * against the font size and rounded to the nearest pixel (12 x 1.35 = 16.2
 * -> 16); where Figma says `leading-[normal]` the step carries no
 * `lineHeight` and the platform default applies.
 */
const type = {
  /** `Nome` — node 48:20615. */
  name: { fontFamily: fontFamily.display.bold, fontSize: 28 },
  /** `Resumo` — node 48:20616. */
  placing: { fontFamily: fontFamily.text.regular, fontSize: 12 },
  /** `Valor` — node 48:20619. */
  ratingValue: { fontFamily: fontFamily.text.semibold, fontSize: 12 },
  /** `Reviews` — node 48:20620. */
  reviewCount: { fontFamily: fontFamily.text.regular, fontSize: 12 },
  /** `Etiqueta` — nodes 48:20624, 48:20627, 48:20630. */
  deliveryFact: { fontFamily: fontFamily.text.regular, fontSize: 10 },
  /** `Descrição` — node 48:20631. 12 x 1.5. */
  description: { fontFamily: fontFamily.text.regular, fontSize: 12, lineHeight: 18 },
  /** `Categoria`, selected — node 48:20633. */
  categoryActive: { fontFamily: fontFamily.text.semibold, fontSize: 12 },
  /**
   * `Categoria` — nodes 48:20634 onwards. The board sets Inter Medium; the
   * app loads Regular, SemiBold and Bold only, so Regular carries it and the
   * selected step above is what tells the two apart.
   */
  category: { fontFamily: fontFamily.text.regular, fontSize: 12 },
  /** `Título` — nodes 48:20640, 48:20676, 48:20688. */
  sectionTitle: { fontFamily: fontFamily.display.bold, fontSize: 22 },
  /** `Nome` — node 48:20644. */
  productName: { fontFamily: fontFamily.display.semibold, fontSize: 14 },
  /** `Oferta` — node 48:20656. */
  discount: { fontFamily: fontFamily.text.semibold, fontSize: 10 },
  /** `Descrição` — node 48:20645. 12 x 1.35. */
  productDescription: { fontFamily: fontFamily.text.regular, fontSize: 12, lineHeight: 16 },
  /** `Atual` — node 48:20647. */
  price: { fontFamily: fontFamily.text.semibold, fontSize: 14 },
  /** `Anterior` — node 48:20660. */
  previousPrice: { fontFamily: fontFamily.text.regular, fontSize: 12 },
  /** `Autor` — node 48:20690. */
  reviewAuthor: { fontFamily: fontFamily.text.semibold, fontSize: 14 },
  /** `Comentário` — node 48:20691. 12 x 1.45. */
  reviewComment: { fontFamily: fontFamily.text.regular, fontSize: 12, lineHeight: 17 },
} as const;

/** Measured geometry, named per the Figma layer that carries each value. */
const metrics = {
  /** `Hero` — node 48:20602. */
  heroHeight: 270,
  /** `Scrim` — node 48:20604, over the band the buttons sit in. */
  scrimHeight: 100,

  /** `Ações` — node 48:20605, and the three buttons inside it. */
  actionsInset: 18,
  actionSize: 40,
  actionIconSize: 19,
  actionGap: 10,

  /** `Perfil` — node 48:20613. */
  profilePadding: 20,
  profilePaddingTop: 20,
  profilePaddingBottom: 24,
  profileGap: 18,
  /** `Identidade` / `Rating` — nodes 48:20614, 48:20617. */
  identityGap: 6,
  ratingGap: 5,
  starSize: 16,

  /** `Dados de entrega` — node 48:20621. */
  stripRadius: 16,
  stripPaddingVertical: 14,
  factGap: 5,
  factIconSize: 18,

  /** `Categorias sticky` — node 48:20632. */
  categoriesPadding: 20,
  categoriesPaddingBottom: 14,
  categoryGap: 16,

  /** `Menu` — node 48:20639. */
  menuPadding: 20,
  menuPaddingTop: 24,
  menuPaddingBottom: 32,
  menuGap: 22,

  /** `Produto` — node 48:20641. */
  productGap: 14,
  detailsGap: 6,
  nameGap: 6,
  priceGap: 8,
  /** `Imagem e ação` / `Adicionar` — nodes 48:20648, 48:20650. */
  mediaSize: 96,
  mediaRadius: 12,
  addSize: 32,
  addInset: 6,
  addIconSize: 18,

  /** `Review` — node 48:20689. */
  reviewRadius: 16,
  reviewPadding: 16,
  reviewGap: 8,
  reviewStarSize: 12,
} as const;

/**
 * The lift under the three hero buttons — `0px 3px 12px rgba(9,16,29,0.07)`
 * on nodes 48:20606, 48:20609 and 48:20611. Its own value rather than a
 * `shadows` level: `sm` is flatter and `md` wider than what the board draws,
 * and these buttons have to lift off a photograph.
 */
const actionShadow = { offsetY: 3, radius: 12, opacity: 0.07, elevation: 3 } as const;

/**
 * `Scrim` — node 48:20604. Dark at the top of the photograph and clear by
 * 100px down, so the white buttons read against a bright image without
 * dimming the dish below them.
 *
 * Its own value rather than the `overlay.scrim*` pair, which runs to 0.75 and
 * in the opposite direction: that one darkens the *bottom* of a card so type
 * can sit on it, and this band carries no type at all.
 */
const heroScrim = { colors: ['rgba(9, 16, 29, 0.6)', 'rgba(9, 16, 29, 0)'] as const };

export const business = { type, metrics, actionShadow, heroScrim } as const;

export type BusinessTokens = typeof business;
export type BusinessTypeStep = keyof typeof type;
