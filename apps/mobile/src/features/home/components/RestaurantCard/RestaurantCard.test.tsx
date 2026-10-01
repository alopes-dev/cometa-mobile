import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RestaurantCard } from './RestaurantCard';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';
import type { Restaurant } from '../../types';

const INITIAL_METRICS = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <SafeAreaProvider initialMetrics={INITIAL_METRICS}>
      <ThemeProvider>{ui}</ThemeProvider>
    </SafeAreaProvider>
  );
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
  distanceKm: 2.4,
};

describe('RestaurantCard', () => {
  it('renders the restaurant name, cuisine, and rating', () => {
    const { getByText } = renderWithTheme(<RestaurantCard restaurant={restaurant} onPress={() => {}} />);
    expect(getByText('Sabores de Cabinda')).toBeTruthy();
    expect(getByText(/Angolana/)).toBeTruthy();
    expect(getByText('4.7')).toBeTruthy();
  });

  it('fires onPress when pressed', async () => {
    const onPress = jest.fn();
    const { getByRole } = renderWithTheme(<RestaurantCard restaurant={restaurant} onPress={onPress} />);
    fireEvent.press(getByRole('button'));
    await waitFor(() => expect(onPress).toHaveBeenCalledTimes(1));
  });

  it('does not render a favorite button when onToggleFavorite is not provided', () => {
    const { queryByLabelText } = renderWithTheme(<RestaurantCard restaurant={restaurant} onPress={() => {}} />);
    expect(queryByLabelText('Adicionar aos favoritos')).toBeNull();
  });

  it('fires onToggleFavorite when the favorite button is pressed', () => {
    const onToggleFavorite = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <RestaurantCard restaurant={restaurant} onPress={() => {}} isFavorite={false} onToggleFavorite={onToggleFavorite} />
    );
    fireEvent.press(getByLabelText('Adicionar aos favoritos'));
    expect(onToggleFavorite).toHaveBeenCalledTimes(1);
  });
});
