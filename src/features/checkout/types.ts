export type Address = {
  label: string;
  details: string;
};

export type PaymentMethod = {
  brand: string;
  last4: string;
  expiry: string;
};

export type OrderSummary = {
  subtotal: number;
  delivery: number;
  vat: number;
  total: number;
};
