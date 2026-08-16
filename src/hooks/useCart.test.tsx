import type { ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { CartProvider } from './CartProvider';
import { useCart } from './useCart';
import type { MenuItem } from '@/features/home/types';

function wrapper({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

const burger: MenuItem = {
  id: 'r1-1',
  restaurantId: 'r1',
  name: 'Cheeseburger Clássico',
  description: 'Hambúrguer de carne, queijo cheddar, alface e tomate.',
  price: 3000,
  imageUrl: 'https://picsum.photos/seed/r1-1/200/200',
  category: 'Pratos Principais',
};

const fries: MenuItem = {
  id: 'r1-2',
  restaurantId: 'r1',
  name: 'Batata Frita',
  description: 'Porção de batata frita crocante.',
  price: 1200,
  imageUrl: 'https://picsum.photos/seed/r1-2/200/200',
  category: 'Entradas',
};

const sushi: MenuItem = {
  id: 'r2-1',
  restaurantId: 'r2',
  name: 'Combo Sashimi',
  description: '12 peças variadas de sashimi fresco.',
  price: 7500,
  imageUrl: 'https://picsum.photos/seed/r2-1/200/200',
  category: 'Pratos Principais',
};

describe('useCart', () => {
  it('starts empty', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toEqual([]);
    expect(result.current.count).toBe(0);
    expect(result.current.subtotal).toBe(0);
    expect(result.current.restaurantId).toBeNull();
  });

  it('addItem adds a new item with quantity 1', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(burger));
    expect(result.current.items).toEqual([{ item: burger, quantity: 1 }]);
    expect(result.current.count).toBe(1);
    expect(result.current.subtotal).toBe(3000);
    expect(result.current.restaurantId).toBe('r1');
  });

  it('addItem increments quantity when the item is already in the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(burger));
    act(() => result.current.addItem(burger));
    expect(result.current.items).toEqual([{ item: burger, quantity: 2 }]);
    expect(result.current.count).toBe(2);
    expect(result.current.subtotal).toBe(6000);
  });

  it('incrementItem and decrementItem adjust quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(burger));
    act(() => result.current.incrementItem(burger.id));
    expect(result.current.items[0].quantity).toBe(2);
    act(() => result.current.decrementItem(burger.id));
    expect(result.current.items[0].quantity).toBe(1);
  });

  it('decrementItem removes the item once quantity reaches zero', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(burger));
    act(() => result.current.decrementItem(burger.id));
    expect(result.current.items).toEqual([]);
    expect(result.current.restaurantId).toBeNull();
  });

  it('keeps the restaurantId while other items remain after a removal', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(burger));
    act(() => result.current.addItem(fries));
    act(() => result.current.decrementItem(burger.id));
    expect(result.current.items).toEqual([{ item: fries, quantity: 1 }]);
    expect(result.current.restaurantId).toBe('r1');
  });

  it('adding an item from a different restaurant replaces the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(burger));
    act(() => result.current.addItem(sushi));
    expect(result.current.items).toEqual([{ item: sushi, quantity: 1 }]);
    expect(result.current.restaurantId).toBe('r2');
  });

  it('clearCart empties the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(burger));
    act(() => result.current.clearCart());
    expect(result.current.items).toEqual([]);
    expect(result.current.restaurantId).toBeNull();
  });

  it('throws when used outside a CartProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useCart())).toThrow('useCart must be used within a CartProvider');
    consoleError.mockRestore();
  });
});
