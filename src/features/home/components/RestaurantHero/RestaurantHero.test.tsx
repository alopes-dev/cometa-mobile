import { render, fireEvent } from '@testing-library/react-native';
import { useSharedValue } from 'react-native-reanimated';
import { RestaurantHero, type RestaurantHeroProps } from './RestaurantHero';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';
import type { Restaurant } from '../../types';

function Wrapper(props: Omit<RestaurantHeroProps, 'scrollY'>) {
  const scrollY = useSharedValue(0);
  return <RestaurantHero {...props} scrollY={scrollY} />;
}

function renderHero(props: Omit<RestaurantHeroProps, 'scrollY'>) {
  return render(
    <ThemeProvider>
      <Wrapper {...props} />
    </ThemeProvider>
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
};

describe('RestaurantHero', () => {
  it('renders the restaurant name, description, and rating', () => {
    const { getAllByText, getByText } = renderHero({ restaurant, topInset: 0, onBack: () => {} });
    // The name renders twice: once in the large hero title, once in the
    // compact sticky title that fades in on collapse — both coexist in the
    // tree regardless of scroll position, only their opacity differs.
    expect(getAllByText('Sabores de Cabinda').length).toBe(2);
    expect(getByText(restaurant.description)).toBeTruthy();
    expect(getByText('4.7')).toBeTruthy();
  });

  it('shows the "top rated" badge when rating is at or above the threshold', () => {
    const { getByText } = renderHero({ restaurant: { ...restaurant, rating: 4.5 }, topInset: 0, onBack: () => {} });
    expect(getByText('MAIS BEM AVALIADO')).toBeTruthy();
  });

  it('hides the "top rated" badge when rating is below the threshold', () => {
    const { queryByText } = renderHero({ restaurant: { ...restaurant, rating: 4.4 }, topInset: 0, onBack: () => {} });
    expect(queryByText('MAIS BEM AVALIADO')).toBeNull();
  });

  it('fires onBack when the back button is pressed', () => {
    const onBack = jest.fn();
    const { getByLabelText } = renderHero({ restaurant, topInset: 0, onBack });
    fireEvent.press(getByLabelText('Voltar'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('renders search and share buttons and fires their handlers when provided', () => {
    const onSearch = jest.fn();
    const onShare = jest.fn();
    const { getByLabelText } = renderHero({ restaurant, topInset: 0, onBack: () => {}, onSearch, onShare });
    fireEvent.press(getByLabelText('Buscar no menu'));
    fireEvent.press(getByLabelText('Partilhar'));
    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onShare).toHaveBeenCalledTimes(1);
  });
});
