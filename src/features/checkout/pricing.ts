import type { OrderSummary } from './types';

export const VAT_RATE = 0.14;

export function computeOrderSummary(subtotal: number, delivery: number): OrderSummary {
  const vat = Math.round(subtotal * VAT_RATE);
  const total = subtotal + delivery + vat;
  return { subtotal, delivery, vat, total };
}
