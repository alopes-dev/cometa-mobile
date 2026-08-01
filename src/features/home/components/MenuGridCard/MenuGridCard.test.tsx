import { render, fireEvent } from '@testing-library/react-native';
import { MenuGridCard } from './MenuGridCard';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';
import type { MenuItem } from '../../types';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const item: MenuItem = {
  id: 'r1-3',
  restaurantId: 'r1',
  name: 'Gindungo Frito',
  description: 'Entrada picante de pimenta gindungo frita.',
  price: 1500,
  imageUrl: 'https://picsum.photos/seed/r1-3/200/200',
  category: 'Entradas',
};

describe('MenuGridCard', () => {
  it('renders the item name, description, and formatted price', () => {
    const { getByText } = renderWithTheme(<MenuGridCard item={item} />);
    expect(getByText('Gindungo Frito')).toBeTruthy();
    expect(getByText(item.description)).toBeTruthy();
    expect(getByText('1.500 Kz')).toBeTruthy();
  });

  it('does not render an add button when onAdd is not passed', () => {
    const { queryByLabelText } = renderWithTheme(<MenuGridCard item={item} />);
    expect(queryByLabelText(`Adicionar ${item.name}`)).toBeNull();
  });

  it('renders an add button and fires onAdd when pressed', () => {
    const onAdd = jest.fn();
    const { getByLabelText } = renderWithTheme(<MenuGridCard item={item} onAdd={onAdd} />);
    fireEvent.press(getByLabelText(`Adicionar ${item.name}`));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });
});
