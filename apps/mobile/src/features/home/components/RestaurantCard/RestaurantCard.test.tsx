import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RestaurantCard } from './RestaurantCard';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';
import type { Restaurant } from '../../types';
import * as Haptics from 'expo-haptics';

beforeEach(() => {
  jest.clearAllMocks();
});

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
  neighbourhood: 'Cabinda',
};

describe('RestaurantCard', () => {
  it('renders the restaurant name, cuisine, and rating', () => {
    const { getByText } = renderWithTheme(<RestaurantCard restaurant={restaurant} onPress={() => {}} />);
    expect(getByText('Sabores de Cabinda')).toBeTruthy();
    expect(getByText('Angolana · Cabinda')).toBeTruthy();
    // The board writes ratings with a decimal comma (node 48:19840).
    expect(getByText('4,7')).toBeTruthy();
  });

  it('fires onPress when pressed', async () => {
    const onPress = jest.fn();
    const { getByRole } = renderWithTheme(<RestaurantCard restaurant={restaurant} onPress={onPress} />);
    fireEvent.press(getByRole('button'));
    await waitFor(() => expect(onPress).toHaveBeenCalledTimes(1));
  });

  it('renders the delivery window and fee as the meta line', () => {
    const { getByText } = renderWithTheme(<RestaurantCard restaurant={restaurant} onPress={() => {}} />);
    expect(getByText('★ 4,7 · 25–35 min · 500 Kz')).toBeTruthy();
  });

  it('renders a footnote in place of the delivery meta when given one', () => {
    const { getByText, queryByText } = renderWithTheme(
      <RestaurantCard restaurant={restaurant} onPress={() => {}} footnote="Último pedido · 12.000 Kz" />
    );
    expect(getByText('Último pedido · 12.000 Kz')).toBeTruthy();
    expect(queryByText('★ 4,7 · 25–35 min · 500 Kz')).toBeNull();
  });

  it('renders the promotion badge only when the restaurant carries one', () => {
    const { queryByText } = renderWithTheme(<RestaurantCard restaurant={restaurant} onPress={() => {}} />);
    expect(queryByText('-20%')).toBeNull();

    const { getByText } = renderWithTheme(
      <RestaurantCard restaurant={{ ...restaurant, promotionLabel: '-20%' }} onPress={() => {}} />
    );
    expect(getByText('-20%')).toBeTruthy();
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

  it('gives impact feedback on press', async () => {
    const { getByRole } = renderWithTheme(<RestaurantCard restaurant={restaurant} onPress={() => {}} />);
    fireEvent.press(getByRole('button'));
    await waitFor(() => expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light));
  });
});
