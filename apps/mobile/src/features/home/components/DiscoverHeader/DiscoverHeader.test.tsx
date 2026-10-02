import { render, fireEvent } from '@testing-library/react-native';
import { DiscoverHeader } from './DiscoverHeader';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('DiscoverHeader', () => {
  it('renders the delivery label and address', () => {
    const { getByText } = renderWithTheme(<DiscoverHeader address="Talatona, Luanda" />);
    expect(getByText('Entregar em')).toBeTruthy();
    expect(getByText('Talatona, Luanda')).toBeTruthy();
  });

  it('announces the cart count when the cart is not empty', () => {
    const { getByLabelText, getByText } = renderWithTheme(
      <DiscoverHeader address="Talatona, Luanda" cartCount={2} />
    );
    expect(getByLabelText('Cesta, 2')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
  });

  it('hides the badge when the cart is empty', () => {
    const { getByLabelText } = renderWithTheme(<DiscoverHeader address="Talatona, Luanda" />);
    expect(getByLabelText('Cesta')).toBeTruthy();
  });

  it('fires each action', () => {
    const onPressAddress = jest.fn();
    const onPressNotifications = jest.fn();
    const onPressCart = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <DiscoverHeader
        address="Talatona, Luanda"
        onPressAddress={onPressAddress}
        onPressNotifications={onPressNotifications}
        onPressCart={onPressCart}
      />
    );
    fireEvent.press(getByLabelText('Entregar em: Talatona, Luanda'));
    fireEvent.press(getByLabelText('Notificações'));
    fireEvent.press(getByLabelText('Cesta'));
    expect(onPressAddress).toHaveBeenCalledTimes(1);
    expect(onPressNotifications).toHaveBeenCalledTimes(1);
    expect(onPressCart).toHaveBeenCalledTimes(1);
  });
});
