import { render, fireEvent } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActiveOrderCard } from './ActiveOrderCard';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';
import type { ActiveOrder } from '../../types';
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

const order: ActiveOrder = {
  id: 'o1',
  restaurantName: 'Burger House',
  imageUrl: 'https://example.test/burger.jpg',
  statusLabel: 'A caminho',
  etaLabel: '25–30 min',
  completedSteps: 3,
  totalSteps: 4,
};

describe('ActiveOrderCard', () => {
  it('renders the restaurant, status and eta', () => {
    const { getByText } = renderWithTheme(<ActiveOrderCard order={order} onPress={() => {}} />);
    expect(getByText('Burger House')).toBeTruthy();
    expect(getByText('A caminho · 25–30 min')).toBeTruthy();
  });

  it('exposes progress to assistive tech rather than relying on the bar alone', () => {
    const { getByRole } = renderWithTheme(<ActiveOrderCard order={order} onPress={() => {}} />);
    expect(getByRole('progressbar').props.accessibilityValue).toEqual({ min: 0, max: 4, now: 3 });
  });

  it('fires onPress when the card is tapped', () => {
    const onPress = jest.fn();
    const { getByLabelText } = renderWithTheme(<ActiveOrderCard order={order} onPress={onPress} />);
    fireEvent.press(getByLabelText('Burger House, A caminho, 25–30 min'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('gives impact feedback on press', () => {
    const { getByLabelText } = renderWithTheme(<ActiveOrderCard order={order} onPress={() => {}} />);
    fireEvent.press(getByLabelText('Burger House, A caminho, 25–30 min'));
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });
});
