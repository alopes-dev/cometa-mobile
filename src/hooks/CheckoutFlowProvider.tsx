import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';
import { VALID_COUPON } from '@/features/checkout/mockData';

export type DeliveryType = 'delivery' | 'pickup';

export type ScheduleChoice = { type: 'now' } | { type: 'scheduled'; slotId: string; label: string };

export type CheckoutFlowState = {
  deliveryType: DeliveryType | null;
  schedule: ScheduleChoice | null;
  addressId: string | null;
  tipPercent: number;
  couponCode: string | null;
  discountPercent: number;
  notes: string;
};

export type CheckoutFlowContextValue = CheckoutFlowState & {
  setDeliveryType: (type: DeliveryType) => void;
  setSchedule: (schedule: ScheduleChoice) => void;
  setAddressId: (id: string) => void;
  setTipPercent: (percent: number) => void;
  setNotes: (notes: string) => void;
  applyCoupon: (code: string) => boolean;
  clearCoupon: () => void;
  reset: () => void;
};

const INITIAL_STATE: CheckoutFlowState = {
  deliveryType: null,
  schedule: null,
  addressId: null,
  tipPercent: 0,
  couponCode: null,
  discountPercent: 0,
  notes: '',
};

export const CheckoutFlowContext = createContext<CheckoutFlowContextValue | null>(null);

export function CheckoutFlowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CheckoutFlowState>(INITIAL_STATE);

  const setDeliveryType = useCallback((deliveryType: DeliveryType) => {
    setState((current) => ({
      ...current,
      deliveryType,
      // Pickup has no address step, so a previously chosen address no longer applies.
      addressId: deliveryType === 'pickup' ? null : current.addressId,
    }));
  }, []);

  const setSchedule = useCallback((schedule: ScheduleChoice) => {
    setState((current) => ({ ...current, schedule }));
  }, []);

  const setAddressId = useCallback((addressId: string) => {
    setState((current) => ({ ...current, addressId }));
  }, []);

  const setTipPercent = useCallback((tipPercent: number) => {
    setState((current) => ({ ...current, tipPercent }));
  }, []);

  const setNotes = useCallback((notes: string) => {
    setState((current) => ({ ...current, notes }));
  }, []);

  const applyCoupon = useCallback((code: string) => {
    const normalized = code.trim().toUpperCase();
    const isValid = normalized === VALID_COUPON.code;
    if (isValid) {
      setState((current) => ({ ...current, couponCode: normalized, discountPercent: VALID_COUPON.discountPercent }));
    }
    return isValid;
  }, []);

  const clearCoupon = useCallback(() => {
    setState((current) => ({ ...current, couponCode: null, discountPercent: 0 }));
  }, []);

  const reset = useCallback(() => setState(INITIAL_STATE), []);

  const value = useMemo<CheckoutFlowContextValue>(
    () => ({
      ...state,
      setDeliveryType,
      setSchedule,
      setAddressId,
      setTipPercent,
      setNotes,
      applyCoupon,
      clearCoupon,
      reset,
    }),
    [state, setDeliveryType, setSchedule, setAddressId, setTipPercent, setNotes, applyCoupon, clearCoupon, reset]
  );

  return <CheckoutFlowContext.Provider value={value}>{children}</CheckoutFlowContext.Provider>;
}
