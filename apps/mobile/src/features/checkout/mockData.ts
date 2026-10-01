import type { IconProps } from '@/components/design-system/atoms';
import type { Address, Coupon, PaymentMethodType, ScheduleSlot } from './types';

export const mockAddresses: Address[] = [
  { id: 'home', label: 'Casa', details: 'Rua Major Kanhangulo, 123, Luanda' },
  { id: 'work', label: 'Trabalho', details: 'Talatona Business Center, Luanda' },
];

export const VALID_COUPON: Coupon = { code: 'COMETA10', discountPercent: 10 };

export const TIP_PRESETS = [0, 10, 15, 20];

export const SCHEDULE_SLOTS: ScheduleSlot[] = [
  { id: 'today-1930', label: 'Hoje — 19:30' },
  { id: 'tomorrow-1200', label: 'Amanhã — 12:00' },
];

export type PaymentMethodOption = {
  type: PaymentMethodType;
  label: string;
  subtitle: string;
  icon: { name: IconProps['name']; sf?: IconProps['sf'] };
};

export const PAYMENT_METHOD_OPTIONS: PaymentMethodOption[] = [
  {
    type: 'card',
    label: 'Cartão',
    subtitle: 'Crédito ou débito',
    icon: { name: 'card-outline', sf: 'creditcard' },
  },
  {
    type: 'multicaixa',
    label: 'Multicaixa Express',
    subtitle: 'Confirmar na app',
    icon: { name: 'phone-portrait-outline', sf: 'iphone' },
  },
  {
    type: 'unitel',
    label: 'Unitel Money',
    subtitle: 'Confirmar por número',
    icon: { name: 'wallet-outline', sf: 'wallet.bifold' },
  },
  {
    type: 'afrimoney',
    label: 'Afrimoney',
    subtitle: 'Confirmar por número',
    icon: { name: 'wallet-outline', sf: 'wallet.bifold' },
  },
  {
    type: 'cash',
    label: 'Dinheiro',
    subtitle: 'Pague ao entregador',
    icon: { name: 'cash-outline', sf: 'banknote' },
  },
];

export function getPaymentMethodOption(type: PaymentMethodType): PaymentMethodOption {
  const option = PAYMENT_METHOD_OPTIONS.find((candidate) => candidate.type === type);
  if (!option) {
    throw new Error(`Unknown payment method type: ${type}`);
  }
  return option;
}
