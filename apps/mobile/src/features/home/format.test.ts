import { formatKwanza } from './format';

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
