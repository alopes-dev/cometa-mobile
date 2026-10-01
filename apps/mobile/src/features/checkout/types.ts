export type Address = {
  id: string;
  label: string;
  details: string;
};

export type PaymentMethodType = 'card' | 'multicaixa' | 'unitel' | 'afrimoney' | 'cash';

export type PaymentMethodSelection = {
  type: PaymentMethodType;
  detailsLabel: string;
};

export type Coupon = {
  code: string;
  discountPercent: number;
};

export type ScheduleSlot = {
  id: string;
  label: string;
};

export type OrderSummary = {
  subtotal: number;
  delivery: number;
  discount: number;
  tip: number;
  vat: number;
  total: number;
};
