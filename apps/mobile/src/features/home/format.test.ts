import {
  formatDiscountPercent,
  formatKwanza,
  formatMinimumOrder,
  formatReviewCount,
} from './format';

describe('formatKwanza', () => {
  it('does not add a separator for a value under 1000', () => {
    expect(formatKwanza(500)).toBe('500 Kz');
  });

  it('adds one separator for a value at or over 1000', () => {
    expect(formatKwanza(7500)).toBe('7.500 Kz');
  });

  it('adds two separators for a value at or over 1,000,000', () => {
    expect(formatKwanza(1250000)).toBe('1.250.000 Kz');
  });
});

describe('formatMinimumOrder', () => {
  it('prefixes the amount with the abbreviation the board uses', () => {
    expect(formatMinimumOrder(4500)).toBe('Mín. 4.500 Kz');
  });
});

describe('formatReviewCount', () => {
  it('writes the count in parentheses, pluralised', () => {
    expect(formatReviewCount(1248)).toBe('(1.248 avaliações)');
  });

  it('uses the singular for a single review', () => {
    expect(formatReviewCount(1)).toBe('(1 avaliação)');
  });
});

describe('formatDiscountPercent', () => {
  it('rounds the saving to a whole percent, signed', () => {
    expect(formatDiscountPercent(9000, 7500)).toBe('-17%');
  });

  it('returns null when the previous price is not higher', () => {
    expect(formatDiscountPercent(7500, 7500)).toBeNull();
  });
});
