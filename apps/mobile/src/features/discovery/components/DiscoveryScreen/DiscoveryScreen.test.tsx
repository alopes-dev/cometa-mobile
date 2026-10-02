import { render } from '@testing-library/react-native';
import { ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';
import { RESTAURANT_CARD_WIDTH } from '@/features/home/components/RestaurantCard';
import { discovery } from '../../content';
import { DiscoveryScreen } from './DiscoveryScreen';
import { CAROUSEL_GAP } from './DiscoveryScreen.styles';

const INITIAL_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

function renderDiscovery() {
  return render(
    <SafeAreaProvider initialMetrics={INITIAL_METRICS}>
      <ThemeProvider>
        <DiscoveryScreen />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

describe('DiscoveryScreen', () => {
  it('renders every section the board draws, in order', () => {
    const { getByText } = renderDiscovery();
    for (const title of [
      discovery.broadCategories,
      discovery.trending,
      discovery.popular,
      discovery.newOnKometa,
      discovery.offers,
      discovery.nearby,
    ]) {
      expect(getByText(title)).toBeTruthy();
    }
  });

  it('casts the restaurants the board names', () => {
    const { getByText } = renderDiscovery();
    for (const name of ['Bun Lab Luanda', 'Nori 244', 'Forno 27', 'Kwanza Bowl', 'Doce Kilamba']) {
      expect(getByText(name)).toBeTruthy();
    }
  });

  it('snaps the Trending carousel to one card, so a swipe never rests mid-card', () => {
    const { UNSAFE_getAllByType } = renderDiscovery();
    const carousels = UNSAFE_getAllByType(ScrollView).filter((node) => node.props.horizontal);

    expect(carousels.length).toBeGreaterThan(0);
    for (const carousel of carousels) {
      expect(carousel.props.snapToInterval).toBe(RESTAURANT_CARD_WIDTH + CAROUSEL_GAP);
      expect(carousel.props.decelerationRate).toBe('fast');
      expect(carousel.props.snapToAlignment).toBe('start');
    }
  });

  it('shows the discount the board puts on the offer card', () => {
    const { getByText } = renderDiscovery();
    expect(getByText('-25%')).toBeTruthy();
    expect(getByText('-15%')).toBeTruthy();
  });
});
