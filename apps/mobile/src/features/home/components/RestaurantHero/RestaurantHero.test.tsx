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
  distanceKm: 2.4,
  reviewCount: 312,
  minOrderValue: 5000,
  reviews: [{ id: 'r1-rev1', author: 'Eunice', comment: 'Porções generosas.', rating: 5 }],
};

describe('RestaurantHero', () => {
  // The board keeps the photograph clean (node 48:20602) — the name, rating
  // and description belong to the profile block below it. The only name the
  // hero carries is the compact one that fades in once the photo collapses.
  it('carries the name once, for the collapsed header', () => {
    const { getAllByText } = renderHero({ restaurant, topInset: 0, onBack: () => {} });
    expect(getAllByText('Sabores de Cabinda')).toHaveLength(1);
  });

  it('leaves the rating and description off the photograph', () => {
    const { queryByText } = renderHero({ restaurant, topInset: 0, onBack: () => {} });
    expect(queryByText(restaurant.description)).toBeNull();
    expect(queryByText('4.7')).toBeNull();
  });

  it('fires onBack when the back button is pressed', () => {
    const onBack = jest.fn();
    const { getByLabelText } = renderHero({ restaurant, topInset: 0, onBack });
    fireEvent.press(getByLabelText('Voltar'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('fires onShare when the share button is pressed', () => {
    const onShare = jest.fn();
    const { getByLabelText } = renderHero({ restaurant, topInset: 0, onBack: () => {}, onShare });
    fireEvent.press(getByLabelText('Partilhar'));
    expect(onShare).toHaveBeenCalledTimes(1);
  });

  it('fires onToggleFavorite when the favourite button is pressed', () => {
    const onToggleFavorite = jest.fn();
    const { getByLabelText } = renderHero({
      restaurant,
      topInset: 0,
      onBack: () => {},
      isFavorite: false,
      onToggleFavorite,
    });
    fireEvent.press(getByLabelText('Adicionar aos favoritos'));
    expect(onToggleFavorite).toHaveBeenCalledTimes(1);
  });

  it('announces the favourite button by its current state', () => {
    const { getByLabelText } = renderHero({
      restaurant,
      topInset: 0,
      onBack: () => {},
      isFavorite: true,
      onToggleFavorite: () => {},
    });
    expect(getByLabelText('Remover dos favoritos')).toBeTruthy();
  });

  it('omits the share and favourite buttons when no handler is given', () => {
    const { queryByLabelText } = renderHero({ restaurant, topInset: 0, onBack: () => {} });
    expect(queryByLabelText('Partilhar')).toBeNull();
    expect(queryByLabelText('Adicionar aos favoritos')).toBeNull();
  });
});
