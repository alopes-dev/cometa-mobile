import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';
import type { MenuItem } from '@/features/home/types';

export type CartItem = {
  item: MenuItem;
  quantity: number;
};

export type CartContextValue = {
  restaurantId: string | null;
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (item: MenuItem) => void;
  incrementItem: (itemId: string) => void;
  decrementItem: (itemId: string) => void;
  clearCart: () => void;
};

type CartState = {
  restaurantId: string | null;
  itemsById: Record<string, CartItem>;
};

const EMPTY_CART: CartState = { restaurantId: null, itemsById: {} };

export const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>(EMPTY_CART);

  const addItem = useCallback((menuItem: MenuItem) => {
    setCart((current) => {
      // Adding from a different restaurant than the one already in the cart starts a fresh cart.
      const itemsById =
        current.restaurantId && current.restaurantId !== menuItem.restaurantId ? {} : current.itemsById;
      const existing = itemsById[menuItem.id];
      return {
        restaurantId: menuItem.restaurantId,
        itemsById: {
          ...itemsById,
          [menuItem.id]: { item: menuItem, quantity: (existing?.quantity ?? 0) + 1 },
        },
      };
    });
  }, []);

  const incrementItem = useCallback((itemId: string) => {
    setCart((current) => {
      const existing = current.itemsById[itemId];
      if (!existing) return current;
      return {
        ...current,
        itemsById: { ...current.itemsById, [itemId]: { ...existing, quantity: existing.quantity + 1 } },
      };
    });
  }, []);

  const decrementItem = useCallback((itemId: string) => {
    setCart((current) => {
      const existing = current.itemsById[itemId];
      if (!existing) return current;
      if (existing.quantity <= 1) {
        const { [itemId]: _removed, ...rest } = current.itemsById;
        const hasRemaining = Object.keys(rest).length > 0;
        return { restaurantId: hasRemaining ? current.restaurantId : null, itemsById: rest };
      }
      return {
        ...current,
        itemsById: { ...current.itemsById, [itemId]: { ...existing, quantity: existing.quantity - 1 } },
      };
    });
  }, []);

  const clearCart = useCallback(() => setCart(EMPTY_CART), []);

  const items = useMemo(() => Object.values(cart.itemsById), [cart.itemsById]);
  const count = useMemo(() => items.reduce((sum, entry) => sum + entry.quantity, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, entry) => sum + entry.quantity * entry.item.price, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      restaurantId: cart.restaurantId,
      items,
      count,
      subtotal,
      addItem,
      incrementItem,
      decrementItem,
      clearCart,
    }),
    [cart.restaurantId, items, count, subtotal, addItem, incrementItem, decrementItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
