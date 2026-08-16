import { useContext } from 'react';
import { CheckoutFlowContext, type CheckoutFlowContextValue } from './CheckoutFlowProvider';

export function useCheckoutFlow(): CheckoutFlowContextValue {
  const context = useContext(CheckoutFlowContext);
  if (!context) {
    throw new Error('useCheckoutFlow must be used within a CheckoutFlowProvider');
  }
  return context;
}
