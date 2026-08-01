import { render, fireEvent } from '@testing-library/react-native';
import { CartSummaryBar } from './CartSummaryBar';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('CartSummaryBar', () => {
  it('renders nothing when count is zero', () => {
    const { queryByText } = renderWithTheme(<CartSummaryBar count={0} total={0} />);
    expect(queryByText('Ver carrinho')).toBeNull();
  });

  it('renders the item count and formatted total when count is positive', () => {
    const { getByText } = renderWithTheme(<CartSummaryBar count={2} total={13700} />);
    expect(getByText('2')).toBeTruthy();
    expect(getByText('Ver carrinho')).toBeTruthy();
    expect(getByText('13.700 Kz')).toBeTruthy();
  });

  it('fires onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByLabelText } = renderWithTheme(<CartSummaryBar count={1} total={4500} onPress={onPress} />);
    fireEvent.press(getByLabelText('Ver carrinho'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
