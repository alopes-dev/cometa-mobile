import { render, fireEvent } from '@testing-library/react-native';
import { OrderItemRow } from './OrderItemRow';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';
import type { MenuItem } from '@/features/home/types';

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
};

describe('OrderItemRow', () => {
  it('renders the item name, description, price, and quantity', () => {
    const { getByText } = renderWithTheme(
      <OrderItemRow entry={{ item: burger, quantity: 2 }} onIncrement={() => {}} onDecrement={() => {}} />
    );
    expect(getByText('Cheeseburger Clássico')).toBeTruthy();
    expect(getByText(burger.description)).toBeTruthy();
    expect(getByText('3.000 Kz')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
  });

  it('fires onIncrement and onDecrement from the stepper', () => {
    const onIncrement = jest.fn();
    const onDecrement = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <OrderItemRow entry={{ item: burger, quantity: 1 }} onIncrement={onIncrement} onDecrement={onDecrement} />
    );
    fireEvent.press(getByLabelText('Aumentar quantidade'));
    fireEvent.press(getByLabelText('Diminuir quantidade'));
    expect(onIncrement).toHaveBeenCalledTimes(1);
    expect(onDecrement).toHaveBeenCalledTimes(1);
  });
});
