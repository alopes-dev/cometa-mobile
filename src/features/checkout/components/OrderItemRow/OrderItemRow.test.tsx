import { render, fireEvent } from '@testing-library/react-native';
import { OrderItemRow } from './OrderItemRow';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';
import type { MenuItem } from '@/features/home/types';
import type { CartItem } from '@/hooks/CartProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const burger: MenuItem = {
  id: 'r1-1',
  restaurantId: 'r1',
  name: 'Cheeseburger Clássico',
  description: 'Hambúrguer de carne, queijo cheddar, alface e tomate.',
  price: 3000,
  imageUrl: 'https://picsum.photos/seed/r1-1/200/200',
  category: 'Pratos Principais',
  modifierGroups: [
    {
      id: 'pao',
      label: 'Escolha o pão',
      type: 'single',
      required: true,
      options: [
        { id: 'pao-tradicional', label: 'Tradicional', priceDelta: 0 },
        { id: 'pao-brioche', label: 'Brioche', priceDelta: 300 },
      ],
    },
  ],
};

const plainEntry: CartItem = {
  lineId: burger.id,
  item: burger,
  quantity: 2,
  selections: [],
  notes: undefined,
  unitPrice: burger.price,
};

describe('OrderItemRow', () => {
  it('renders the item name, description, price, and quantity when there are no selections', () => {
    const { getByText } = renderWithTheme(
      <OrderItemRow entry={plainEntry} onIncrement={() => {}} onDecrement={() => {}} />
    );
    expect(getByText('Cheeseburger Clássico')).toBeTruthy();
    expect(getByText(burger.description)).toBeTruthy();
    expect(getByText('3.000 Kz')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
  });

  it('renders the selection summary and unit price when customized', () => {
    const customizedEntry: CartItem = {
      lineId: `${burger.id}::brioche`,
      item: burger,
      quantity: 1,
      selections: [{ groupId: 'pao', optionIds: ['pao-brioche'] }],
      notes: 'Sem cebola',
      unitPrice: 3300,
    };
    const { getByText } = renderWithTheme(
      <OrderItemRow entry={customizedEntry} onIncrement={() => {}} onDecrement={() => {}} />
    );
    expect(getByText('Brioche · Sem cebola')).toBeTruthy();
    expect(getByText('3.300 Kz')).toBeTruthy();
  });

  it('fires onIncrement and onDecrement from the stepper', () => {
    const onIncrement = jest.fn();
    const onDecrement = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <OrderItemRow entry={plainEntry} onIncrement={onIncrement} onDecrement={onDecrement} />
    );
    fireEvent.press(getByLabelText('Aumentar quantidade'));
    fireEvent.press(getByLabelText('Diminuir quantidade'));
    expect(onIncrement).toHaveBeenCalledTimes(1);
    expect(onDecrement).toHaveBeenCalledTimes(1);
  });
});
