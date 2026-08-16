export type Address = {
  id: string;
  label: string;
  details: string;
};

export type PaymentMethod = {
  brand: string;
  last4: string;
  expiry: string;
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
