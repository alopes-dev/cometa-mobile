import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { MenuItemRow } from './MenuItemRow';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';
import type { MenuItem } from '../../types';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const item: MenuItem = {
  id: 'r1-1',
  restaurantId: 'r1',
  name: 'Calulu de Peixe',
  description: 'Peixe seco cozinhado com quiabo, jinguba e óleo de palma.',
  price: 4500,
  imageUrl: 'https://picsum.photos/seed/r1-1/200/200',
  category: 'Pratos Principais',
};

describe('MenuItemRow', () => {
  it('renders the item name, description, and price', () => {
    const { getByText } = renderWithTheme(<MenuItemRow item={item} />);
    expect(getByText('Calulu de Peixe')).toBeTruthy();
    expect(getByText(item.description)).toBeTruthy();
    expect(getByText('4.500 Kz')).toBeTruthy();
  });

  it('does not render an add button when onAdd is not passed', () => {
    const { queryByLabelText } = renderWithTheme(<MenuItemRow item={item} />);
    expect(queryByLabelText(`Adicionar ${item.name}`)).toBeNull();
  });

  it('renders an add button and fires onAdd when pressed', async () => {
    const onAdd = jest.fn();
    const { getByLabelText } = renderWithTheme(<MenuItemRow item={item} onAdd={onAdd} />);
    fireEvent.press(getByLabelText(`Adicionar ${item.name}`));
    await waitFor(() => expect(onAdd).toHaveBeenCalledTimes(1));
  });

  it('fires onPress when the row is pressed', () => {
    const onPress = jest.fn();
    const { getByLabelText } = renderWithTheme(<MenuItemRow item={item} onPress={onPress} />);
    fireEvent.press(getByLabelText(`Ver ${item.name}`));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
