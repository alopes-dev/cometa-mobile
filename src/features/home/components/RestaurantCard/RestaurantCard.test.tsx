import { render, fireEvent } from '@testing-library/react-native';
import { RestaurantCard } from './RestaurantCard';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';
import type { Restaurant } from '../../types';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const restaurant: Restaurant = {
  id: 'r1',
  name: 'Sabores de Cabinda',
  imageUrl: 'https://picsum.photos/seed/r1/400/300',
  rating: 4.7,
  cuisine: 'Angolana',
  deliveryTimeMinutes: 25,
  deliveryFee: 500,
  description: 'Sabores autênticos de Cabinda, direto para a sua mesa.',
};

describe('RestaurantCard', () => {
  it('renders the restaurant name, cuisine, and rating', () => {
    const { getByText } = renderWithTheme(<RestaurantCard restaurant={restaurant} onPress={() => {}} />);
    expect(getByText('Sabores de Cabinda')).toBeTruthy();
    expect(getByText('Angolana')).toBeTruthy();
    expect(getByText('4.7')).toBeTruthy();
  });

  it('fires onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = renderWithTheme(<RestaurantCard restaurant={restaurant} onPress={onPress} />);
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
