import { semanticColors } from './semantic';

/**
 * WCAG contrast is enforced here rather than documented, because a palette
 * claim in a markdown file cannot fail a build. Every pair below is one a
 * real component renders; if a token is re-pointed to something illegible,
 * this test is what says so.
 *
 * Thresholds: 4.5:1 for text (AA), 3:1 for large text and for the boundary of
 * a control a user has to find (WCAG 1.4.11). Disabled text is exempt by
 * design, and decorative hairlines are not controls, so neither is asserted.
 */

const channel = (c: number): number => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex: string): number => {
  const h = hex.replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(h)) {
    throw new Error(`contrast check needs a 6-digit hex, got "${hex}"`);
  }
  return (
    0.2126 * channel(parseInt(h.slice(0, 2), 16)) +
    0.7152 * channel(parseInt(h.slice(2, 4), 16)) +
    0.0722 * channel(parseInt(h.slice(4, 6), 16))
  );
};

export const contrastRatio = (a: string, b: string): number => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const AA = 4.5;
const AA_LARGE = 3;

describe.each(['light', 'dark'] as const)('%s scheme contrast', (scheme) => {
  const c = semanticColors[scheme];

  it.each([
    ['text.primary on background.primary', c.text.primary, c.background.primary],
    ['text.primary on surface.secondary', c.text.primary, c.surface.secondary],
    ['text.primary on surface.elevated', c.text.primary, c.surface.elevated],
    ['text.secondary on background.primary', c.text.secondary, c.background.primary],
    ['text.secondary on surface.secondary', c.text.secondary, c.surface.secondary],
    ['text.brand on background.primary', c.text.brand, c.background.primary],
    ['text.brand on brand.subtle', c.text.brand, c.brand.subtle],
    ['text.link on background.primary', c.text.link, c.background.primary],
    ['text.onBrand on brand.base', c.text.onBrand, c.brand.base],
    ['text.onBrand on brand.pressed', c.text.onBrand, c.brand.pressed],
    ['text.error on background.primary', c.text.error, c.background.primary],
    ['text.warning on background.primary', c.text.warning, c.background.primary],
    ['text.info on background.primary', c.text.info, c.background.primary],
  ])('%s meets AA', (_label, fg, bg) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(AA);
  });

  it.each(['success', 'error', 'warning', 'info'] as const)(
    'status.%s is legible as tint and as fill',
    (key) => {
      const s = c.status[key];
      expect(contrastRatio(s.fg, s.bg)).toBeGreaterThanOrEqual(AA);
      expect(contrastRatio(s.onFill, s.fill)).toBeGreaterThanOrEqual(AA);
    },
  );

  it.each([
    'confirmed',
    'preparing',
    'ready',
    'on-the-way',
    'picked-up',
    'arriving',
    'delivered',
    'cancelled',
  ] as const)(
    'delivery.%s chip is legible',
    (key) => {
      const d = c.delivery[key];
      expect(contrastRatio(d.fg, d.bg)).toBeGreaterThanOrEqual(AA);
    },
  );

  it.each(['offer', 'featured', 'limited'] as const)(
    'promo.%s is legible as tint and as fill',
    (key) => {
      const p = c.promo[key];
      expect(contrastRatio(p.fg, p.bg)).toBeGreaterThanOrEqual(AA);
      expect(contrastRatio(p.onFill, p.fill)).toBeGreaterThanOrEqual(AA);
    },
  );

  // text.tertiary is metadata-only: it is allowed to sit at the large-text
  // threshold, which is why no component may use it for body copy.
  it('text.tertiary clears the large-text threshold', () => {
    expect(contrastRatio(c.text.tertiary, c.background.primary)).toBeGreaterThanOrEqual(AA_LARGE);
  });

  // A control the user must locate — a focused field, a selected option —
  // needs a 3:1 boundary under WCAG 1.4.11.
  it.each([
    ['border.focus', c.border.focus],
    ['border.selected', c.border.selected],
    ['border.error', c.border.error],
  ])('%s is a findable control boundary', (_label, border) => {
    expect(contrastRatio(border, c.background.primary)).toBeGreaterThanOrEqual(AA_LARGE);
  });

  /**
   * Rating stars are deliberately NOT held to a luminance ratio. A gold and a
   * mid grey sit at nearly the same luminance by nature, and darkening the
   * gold enough to pass would stop it reading as gold. The state is carried by
   * glyph shape instead (`star` vs `star-outline`), and every rating also
   * renders its value as text — so the information survives without color,
   * which is what §44 asks for. All this needs to guarantee is that the two
   * states are not the same color.
   */
  it('distinguishes filled from empty rating stars', () => {
    expect(c.rating.filled).not.toBe(c.rating.empty);
  });
});
