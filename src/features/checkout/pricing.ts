import type { OrderSummary } from './types';

export const VAT_RATE = 0.14;

export function computeOrderSummary(
  subtotal: number,
  delivery: number,
  discountPercent = 0,
  tipPercent = 0
): OrderSummary {
  const discount = Math.round(subtotal * (discountPercent / 100));
  const tip = Math.round(subtotal * (tipPercent / 100));
  const vat = Math.round(subtotal * VAT_RATE);
  const total = subtotal - discount + delivery + tip + vat;
  return { subtotal, delivery, discount, tip, vat, total };
}
