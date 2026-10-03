export function formatKwanza(value: number): string {
  const rounded = Math.round(value);
  const withSeparators = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${withSeparators} Kz`;
}

export function formatDeliveryFee(value: number): string {
  return value === 0 ? 'Grátis' : formatKwanza(value);
}

/**
 * Ratings use the Portuguese decimal comma — "4,8" — as the board writes them
 * (nodes 48:19840, 48:19842). `toFixed` always emits a point, so the swap is
 * explicit rather than locale-dependent: `Intl` is not reliably present in
 * every Hermes build.
 */
export function formatRating(value: number): string {
  return value.toFixed(1).replace('.', ',');
}

/**
 * The board never shows delivery as a point estimate — it shows a window
 * ("25–35 min", node 48:19842). `deliveryTimeMinutes` is the optimistic end;
 * this widens it by a fixed spread so a single number can render as a range.
 */
const DELIVERY_SPREAD_MINUTES = 10;

export function formatDeliveryWindow(minutes: number): string {
  return `${minutes}–${minutes + DELIVERY_SPREAD_MINUTES} min`;
}

/**
 * The minimum basket, as the business board writes it — "Mín. 4.500 Kz"
 * (node 48:20630). Abbreviated rather than spelled out because the three
 * delivery facts share one row and must not wrap.
 */
export function formatMinimumOrder(value: number): string {
  return `Mín. ${formatKwanza(value)}`;
}

/**
 * The review count beside the rating — "(1.248 avaliações)" (node 48:20620).
 * Parenthesised here rather than at the call site so the two readings of the
 * same number — the figure and its label — can never disagree.
 */
export function formatReviewCount(count: number): string {
  const withSeparators = count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `(${withSeparators} ${count === 1 ? 'avaliação' : 'avaliações'})`;
}

/**
 * The saving badge beside a discounted item's name — "-17%" (node 48:20656).
 *
 * Returns `null` rather than "0%" when there is nothing to advertise, so the
 * badge is absent from the layout instead of present and empty.
 */
export function formatDiscountPercent(previousPrice: number, price: number): string | null {
  if (previousPrice <= price) return null;
  return `-${Math.round(((previousPrice - price) / previousPrice) * 100)}%`;
}
