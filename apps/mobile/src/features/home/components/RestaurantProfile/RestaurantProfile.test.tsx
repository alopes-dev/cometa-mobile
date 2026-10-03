import { render } from '@testing-library/react-native';
import { RestaurantProfile } from './RestaurantProfile';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';
import type { Restaurant } from '../../types';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const restaurant: Restaurant = {
  id: 'r4',
  name: 'Burger House',
  imageUrl: 'https://example.test/burger-house.jpg',
  rating: 4.8,
  cuisine: 'Hambúrgueres',
  deliveryTimeMinutes: 25,
  deliveryFee: 1000,
  description: 'Burgers artesanais preparados na hora, pão macio e molhos da casa.',
  distanceKm: 1.2,
  reviewCount: 1248,
  minOrderValue: 4500,
  reviews: [{ id: 'r4-rev1', author: 'Mário', rating: 5, comment: 'Chegou quente.' }],
  neighbourhood: 'Talatona',
};

describe('RestaurantProfile', () => {
  it('names the restaurant and places it by cuisine and neighbourhood', () => {
    const { getByText } = renderWithTheme(<RestaurantProfile restaurant={restaurant} />);
    expect(getByText('Burger House')).toBeTruthy();
    expect(getByText('Hambúrgueres · Talatona')).toBeTruthy();
  });

  it('shows the rating beside how many reviews it averages', () => {
    const { getByText } = renderWithTheme(<RestaurantProfile restaurant={restaurant} />);
    expect(getByText('4,8')).toBeTruthy();
    expect(getByText('(1.248 avaliações)')).toBeTruthy();
  });

  it('shows the three delivery facts the board puts in one strip', () => {
    const { getByText } = renderWithTheme(<RestaurantProfile restaurant={restaurant} />);
    expect(getByText('25–35 min')).toBeTruthy();
    expect(getByText('1.000 Kz')).toBeTruthy();
    expect(getByText('Mín. 4.500 Kz')).toBeTruthy();
  });

  it('reads the delivery fee as free when there is none', () => {
    const { getByText } = renderWithTheme(
      <RestaurantProfile restaurant={{ ...restaurant, deliveryFee: 0 }} />
    );
    expect(getByText('Grátis')).toBeTruthy();
  });

  it('shows the description', () => {
    const { getByText } = renderWithTheme(<RestaurantProfile restaurant={restaurant} />);
    expect(getByText(restaurant.description)).toBeTruthy();
  });

  it('omits the neighbourhood when the restaurant has none', () => {
    const { getByText } = renderWithTheme(
      <RestaurantProfile restaurant={{ ...restaurant, neighbourhood: undefined }} />
    );
    expect(getByText('Hambúrgueres')).toBeTruthy();
  });
});
