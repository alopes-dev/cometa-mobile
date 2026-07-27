import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import { cartReducer, initialCart, type CartItem } from './cart.reducer';

type CartContextValue = {
  items: CartItem[];
  count: number;
  add: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCart);

  const add = useCallback((productId: string) => dispatch({ type: 'add', productId }), []);
  const remove = useCallback((productId: string) => dispatch({ type: 'remove', productId }), []);
  const clear = useCallback(() => dispatch({ type: 'clear' }), []);

  const count = useMemo(() => state.items.reduce((sum, i) => sum + i.qty, 0), [state.items]);

  const value = useMemo<CartContextValue>(
    () => ({ items: state.items, count, add, remove, clear }),
    [state.items, count, add, remove, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
