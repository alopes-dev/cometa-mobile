import type { Address, PaymentMethod } from './types';

export const mockAddress: Address = {
  label: 'Home',
  details: 'Rua Major Kanhangulo, 123, Luanda',
};

export const mockPaymentMethod: PaymentMethod = {
  brand: 'Visa',
  last4: '4242',
  expiry: '12/26',
};
