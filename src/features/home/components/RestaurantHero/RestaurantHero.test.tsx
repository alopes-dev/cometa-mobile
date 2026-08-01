import { render, fireEvent } from '@testing-library/react-native';
import { RestaurantHero } from './RestaurantHero';
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

describe('RestaurantHero', () => {
  it('renders the restaurant name, description, and rating', () => {
    const { getByText } = renderWithTheme(
      <RestaurantHero restaurant={restaurant} topInset={0} onBack={() => {}} />
    );
    expect(getByText('Sabores de Cabinda')).toBeTruthy();
    expect(getByText(restaurant.description)).toBeTruthy();
    expect(getByText('4.7')).toBeTruthy();
  });

  it('shows the "top rated" badge when rating is at or above the threshold', () => {
    const { getByText } = renderWithTheme(
      <RestaurantHero restaurant={{ ...restaurant, rating: 4.5 }} topInset={0} onBack={() => {}} />
    );
    expect(getByText('MAIS BEM AVALIADO')).toBeTruthy();
  });

  it('hides the "top rated" badge when rating is below the threshold', () => {
    const { queryByText } = renderWithTheme(
      <RestaurantHero restaurant={{ ...restaurant, rating: 4.4 }} topInset={0} onBack={() => {}} />
    );
    expect(queryByText('MAIS BEM AVALIADO')).toBeNull();
  });

  it('fires onBack when the back button is pressed', () => {
    const onBack = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <RestaurantHero restaurant={restaurant} topInset={0} onBack={onBack} />
    );
    fireEvent.press(getByLabelText('Voltar'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
