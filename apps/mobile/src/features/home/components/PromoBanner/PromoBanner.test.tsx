import { render, fireEvent } from '@testing-library/react-native';
import { PromoBanner } from './PromoBanner';
import { ThemeProvider, lightTheme } from '@/components/design-system/ThemeProvider';
import type { Promotion } from '../../types';
import * as Haptics from 'expo-haptics';

beforeEach(() => {
  jest.clearAllMocks();
});

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const promotion: Promotion = {
  id: 'p1',
  title: '20% no almoço',
  subtitle: 'Sabores de Talatona até às 14h',
  ctaLabel: 'Ver opções',
  imageUrl: 'https://example.test/lunch.jpg',
  tone: 'featured',
};

describe('PromoBanner', () => {
  it('renders the message and call to action', () => {
    const { getByText } = renderWithTheme(<PromoBanner promotion={promotion} />);
    expect(getByText('20% no almoço')).toBeTruthy();
    expect(getByText('Sabores de Talatona até às 14h')).toBeTruthy();
    expect(getByText('Ver opções')).toBeTruthy();
  });

  it('fires onPress', () => {
    const onPress = jest.fn();
    const { getByRole } = renderWithTheme(<PromoBanner promotion={promotion} onPress={onPress} />);
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('labels the amber tone with its readable foreground, not white', () => {
    // promo.limited.fill is a fill-only amber step; white on it fails AA, so
    // the banner must take the palette's onFill instead of the board's white.
    const { getByText } = renderWithTheme(
      <PromoBanner promotion={{ ...promotion, tone: 'limited' }} />
    );
    expect(getByText('20% no almoço')).toHaveStyle({
      color: lightTheme.colors.promo.limited.onFill,
    });
  });

  it('gives impact feedback on press', () => {
    const { getByRole } = renderWithTheme(<PromoBanner promotion={promotion} />);
    fireEvent.press(getByRole('button'));
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });
});
