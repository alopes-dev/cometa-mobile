import { computeOrderSummary, VAT_RATE } from './pricing';

describe('computeOrderSummary', () => {
  it('computes VAT as 14% of the subtotal', () => {
    const summary = computeOrderSummary(11600, 0);
    expect(VAT_RATE).toBe(0.14);
    expect(summary.vat).toBe(1624);
  });

  it('adds subtotal, delivery, and VAT into the total with no discount or tip', () => {
    const summary = computeOrderSummary(11600, 0);
    expect(summary).toEqual({ subtotal: 11600, delivery: 0, discount: 0, tip: 0, vat: 1624, total: 13224 });
  });

  it('includes a non-zero delivery fee in the total', () => {
    const summary = computeOrderSummary(1000, 500);
    expect(summary.total).toBe(1000 + 500 + Math.round(1000 * VAT_RATE));
  });

  it('subtracts a percentage discount from the subtotal', () => {
    const summary = computeOrderSummary(10000, 0, 10);
    expect(summary.discount).toBe(1000);
    expect(summary.total).toBe(10000 - 1000 + Math.round(10000 * VAT_RATE));
  });

  it('adds a percentage tip on top of the subtotal', () => {
    const summary = computeOrderSummary(10000, 0, 0, 15);
    expect(summary.tip).toBe(1500);
    expect(summary.total).toBe(10000 + 1500 + Math.round(10000 * VAT_RATE));
  });

  it('combines discount and tip together', () => {
    const summary = computeOrderSummary(10000, 500, 10, 10);
    expect(summary).toEqual({
      subtotal: 10000,
      delivery: 500,
      discount: 1000,
      tip: 1000,
      vat: 1400,
      total: 10000 - 1000 + 500 + 1000 + 1400,
    });
  });

  it('returns zero for an empty cart', () => {
    const summary = computeOrderSummary(0, 0);
    expect(summary).toEqual({ subtotal: 0, delivery: 0, discount: 0, tip: 0, vat: 0, total: 0 });
  });
});
