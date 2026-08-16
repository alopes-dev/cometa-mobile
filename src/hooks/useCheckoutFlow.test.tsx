import type { ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { CheckoutFlowProvider } from './CheckoutFlowProvider';
import { useCheckoutFlow } from './useCheckoutFlow';

function wrapper({ children }: { children: ReactNode }) {
  return <CheckoutFlowProvider>{children}</CheckoutFlowProvider>;
}

describe('useCheckoutFlow', () => {
  it('starts with no selections', () => {
    const { result } = renderHook(() => useCheckoutFlow(), { wrapper });
    expect(result.current.deliveryType).toBeNull();
    expect(result.current.schedule).toBeNull();
    expect(result.current.addressId).toBeNull();
    expect(result.current.tipPercent).toBe(0);
    expect(result.current.couponCode).toBeNull();
    expect(result.current.discountPercent).toBe(0);
    expect(result.current.notes).toBe('');
    expect(result.current.paymentMethod).toBeNull();
  });

  it('setDeliveryType stores the choice', () => {
    const { result } = renderHook(() => useCheckoutFlow(), { wrapper });
    act(() => result.current.setDeliveryType('pickup'));
    expect(result.current.deliveryType).toBe('pickup');
  });

  it('switching to pickup clears a previously selected address', () => {
    const { result } = renderHook(() => useCheckoutFlow(), { wrapper });
    act(() => result.current.setDeliveryType('delivery'));
    act(() => result.current.setAddressId('home'));
    expect(result.current.addressId).toBe('home');
    act(() => result.current.setDeliveryType('pickup'));
    expect(result.current.addressId).toBeNull();
  });

  it('setSchedule stores the choice', () => {
    const { result } = renderHook(() => useCheckoutFlow(), { wrapper });
    act(() => result.current.setSchedule({ type: 'scheduled', slotId: 'today-1930', label: 'Hoje — 19:30' }));
    expect(result.current.schedule).toEqual({ type: 'scheduled', slotId: 'today-1930', label: 'Hoje — 19:30' });
  });

  it('setTipPercent stores the value', () => {
    const { result } = renderHook(() => useCheckoutFlow(), { wrapper });
    act(() => result.current.setTipPercent(15));
    expect(result.current.tipPercent).toBe(15);
  });

  it('applyCoupon accepts the valid code case-insensitively and sets the discount', () => {
    const { result } = renderHook(() => useCheckoutFlow(), { wrapper });
    let success = false;
    act(() => {
      success = result.current.applyCoupon('cometa10');
    });
    expect(success).toBe(true);
    expect(result.current.couponCode).toBe('COMETA10');
    expect(result.current.discountPercent).toBe(10);
  });

  it('applyCoupon rejects an invalid code and leaves state unchanged', () => {
    const { result } = renderHook(() => useCheckoutFlow(), { wrapper });
    let success = true;
    act(() => {
      success = result.current.applyCoupon('NOTVALID');
    });
    expect(success).toBe(false);
    expect(result.current.couponCode).toBeNull();
    expect(result.current.discountPercent).toBe(0);
  });

  it('clearCoupon resets the coupon fields', () => {
    const { result } = renderHook(() => useCheckoutFlow(), { wrapper });
    act(() => result.current.applyCoupon('COMETA10'));
    act(() => result.current.clearCoupon());
    expect(result.current.couponCode).toBeNull();
    expect(result.current.discountPercent).toBe(0);
  });

  it('setPaymentMethod stores the selection', () => {
    const { result } = renderHook(() => useCheckoutFlow(), { wrapper });
    act(() => result.current.setPaymentMethod({ type: 'cash', detailsLabel: 'Dinheiro' }));
    expect(result.current.paymentMethod).toEqual({ type: 'cash', detailsLabel: 'Dinheiro' });
  });

  it('reset restores the initial state', () => {
    const { result } = renderHook(() => useCheckoutFlow(), { wrapper });
    act(() => {
      result.current.setDeliveryType('delivery');
      result.current.setTipPercent(20);
      result.current.applyCoupon('COMETA10');
      result.current.setPaymentMethod({ type: 'cash', detailsLabel: 'Dinheiro' });
    });
    act(() => result.current.reset());
    expect(result.current.deliveryType).toBeNull();
    expect(result.current.tipPercent).toBe(0);
    expect(result.current.discountPercent).toBe(0);
    expect(result.current.paymentMethod).toBeNull();
  });

  it('throws when used outside a CheckoutFlowProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useCheckoutFlow())).toThrow(
      'useCheckoutFlow must be used within a CheckoutFlowProvider'
    );
    consoleError.mockRestore();
  });
});
