import { render } from '@testing-library/react-native';
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
});
