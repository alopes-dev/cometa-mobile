import type { Address, Coupon, PaymentMethod, ScheduleSlot } from './types';

export const mockAddresses: Address[] = [
  { id: 'home', label: 'Casa', details: 'Rua Major Kanhangulo, 123, Luanda' },
  { id: 'work', label: 'Trabalho', details: 'Talatona Business Center, Luanda' },
];

export const mockPaymentMethod: PaymentMethod = {
  brand: 'Visa',
  last4: '4242',
  expiry: '12/26',
};

export const VALID_COUPON: Coupon = { code: 'COMETA10', discountPercent: 10 };

export const TIP_PRESETS = [0, 10, 15, 20];

export const SCHEDULE_SLOTS: ScheduleSlot[] = [
  { id: 'today-1930', label: 'Hoje — 19:30' },
  { id: 'tomorrow-1200', label: 'Amanhã — 12:00' },
];
