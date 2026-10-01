import { getPaymentMethodOption, PAYMENT_METHOD_OPTIONS } from './mockData';

describe('getPaymentMethodOption', () => {
  it('returns the matching option for each known type', () => {
    for (const option of PAYMENT_METHOD_OPTIONS) {
      expect(getPaymentMethodOption(option.type)).toEqual(option);
    }
  });

  it('throws for an unknown type', () => {
    // @ts-expect-error - intentionally passing an invalid type to verify the guard
    expect(() => getPaymentMethodOption('bitcoin')).toThrow('Unknown payment method type: bitcoin');
  });
});
