import { computeOrderSummary, VAT_RATE } from './pricing';

describe('computeOrderSummary', () => {
  it('computes VAT as 14% of the subtotal', () => {
    const summary = computeOrderSummary(11600, 0);
    expect(VAT_RATE).toBe(0.14);
    expect(summary.vat).toBe(1624);
  });

  it('adds subtotal, delivery, and VAT into the total', () => {
    const summary = computeOrderSummary(11600, 0);
    expect(summary).toEqual({ subtotal: 11600, delivery: 0, vat: 1624, total: 13224 });
  });

  it('includes a non-zero delivery fee in the total', () => {
    const summary = computeOrderSummary(1000, 500);
    expect(summary.total).toBe(1000 + 500 + Math.round(1000 * VAT_RATE));
  });

  it('returns zero for an empty cart', () => {
    const summary = computeOrderSummary(0, 0);
    expect(summary).toEqual({ subtotal: 0, delivery: 0, vat: 0, total: 0 });
  });
});
