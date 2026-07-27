import { cartReducer, initialCart } from './cart.reducer';

describe('cartReducer', () => {
  it('starts with two seed items', () => {
    expect(initialCart.items).toEqual([
      { productId: 'quinoa', qty: 1 },
      { productId: 'pancakes', qty: 1 },
    ]);
  });

  it('adds a new product as qty 1', () => {
    const next = cartReducer({ items: [] }, { type: 'add', productId: 'poke' });
    expect(next.items).toEqual([{ productId: 'poke', qty: 1 }]);
  });

  it('increments qty when adding an existing product', () => {
    const next = cartReducer(
      { items: [{ productId: 'poke', qty: 1 }] },
      { type: 'add', productId: 'poke' }
    );
    expect(next.items).toEqual([{ productId: 'poke', qty: 2 }]);
  });

  it('decrements qty when removing a product with qty > 1', () => {
    const next = cartReducer(
      { items: [{ productId: 'poke', qty: 3 }] },
      { type: 'remove', productId: 'poke' }
    );
    expect(next.items).toEqual([{ productId: 'poke', qty: 2 }]);
  });

  it('drops the item when removing at qty 1', () => {
    const next = cartReducer(
      { items: [{ productId: 'poke', qty: 1 }, { productId: 'quinoa', qty: 2 }] },
      { type: 'remove', productId: 'poke' }
    );
    expect(next.items).toEqual([{ productId: 'quinoa', qty: 2 }]);
  });

  it('is a no-op when removing a product not in the cart', () => {
    const state = { items: [{ productId: 'quinoa', qty: 1 }] };
    const next = cartReducer(state, { type: 'remove', productId: 'poke' });
    expect(next).toEqual(state);
  });

  it('clears everything', () => {
    const next = cartReducer(
      { items: [{ productId: 'quinoa', qty: 1 }] },
      { type: 'clear' }
    );
    expect(next.items).toEqual([]);
  });
});
