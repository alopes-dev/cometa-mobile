export type CartItem = { productId: string; qty: number };
export type CartState = { items: CartItem[] };

export type CartAction =
  | { type: 'add'; productId: string }
  | { type: 'remove'; productId: string }
  | { type: 'clear' };

export const initialCart: CartState = {
  items: [
    { productId: 'quinoa', qty: 1 },
    { productId: 'pancakes', qty: 1 },
  ],
};

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      const existing = state.items.find((i) => i.productId === action.productId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === action.productId ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { productId: action.productId, qty: 1 }] };
    }
    case 'remove': {
      const existing = state.items.find((i) => i.productId === action.productId);
      if (!existing) return state;
      if (existing.qty > 1) {
        return {
          items: state.items.map((i) =>
            i.productId === action.productId ? { ...i, qty: i.qty - 1 } : i
          ),
        };
      }
      return { items: state.items.filter((i) => i.productId !== action.productId) };
    }
    case 'clear':
      return { items: [] };
  }
}
