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
