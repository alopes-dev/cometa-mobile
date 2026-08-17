import { render, fireEvent } from '@testing-library/react-native';
import { PlaceOrderBar } from './PlaceOrderBar';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('PlaceOrderBar', () => {
  it('renders the formatted total', () => {
    const { getByText } = renderWithTheme(<PlaceOrderBar total={13224} onPress={() => {}} />);
    expect(getByText('13.224 Kz')).toBeTruthy();
  });

  it('fires onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByLabelText } = renderWithTheme(<PlaceOrderBar total={13224} onPress={onPress} />);
    fireEvent.press(getByLabelText('Fazer pedido'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('hides the label and ignores presses while loading', () => {
    const onPress = jest.fn();
    const { getByLabelText, queryByText } = renderWithTheme(
      <PlaceOrderBar total={13224} isLoading onPress={onPress} />
    );
    expect(queryByText('Place Order')).toBeNull();
    fireEvent.press(getByLabelText('Fazer pedido'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('ignores presses when disabled', () => {
    const onPress = jest.fn();
    const { getByLabelText } = renderWithTheme(<PlaceOrderBar total={13224} disabled onPress={onPress} />);
    fireEvent.press(getByLabelText('Fazer pedido'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('exposes the disabled state via accessibilityState', () => {
    const { getByLabelText } = renderWithTheme(<PlaceOrderBar total={13224} disabled onPress={() => {}} />);
    expect(getByLabelText('Fazer pedido').props.accessibilityState).toEqual({ busy: false, disabled: true });
  });
});
