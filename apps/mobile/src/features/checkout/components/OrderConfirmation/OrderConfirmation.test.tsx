import { render, fireEvent } from '@testing-library/react-native';
import { OrderConfirmation } from './OrderConfirmation';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('OrderConfirmation', () => {
  it('renders the restaurant name and formatted total', () => {
    const { getByText } = renderWithTheme(
      <OrderConfirmation restaurantName="Pizza Talatona" total={13224} onDone={() => {}} onTrack={() => {}} />
    );
    expect(getByText('Pedido confirmado!')).toBeTruthy();
    expect(getByText(/Pizza Talatona/)).toBeTruthy();
    expect(getByText(/13\.224 Kz/)).toBeTruthy();
  });

  it('fires onDone when the "Voltar ao Início" button is pressed', () => {
    const onDone = jest.fn();
    const { getByText } = renderWithTheme(
      <OrderConfirmation restaurantName="Pizza Talatona" total={13224} onDone={onDone} onTrack={() => {}} />
    );
    fireEvent.press(getByText('Voltar ao Início'));
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('fires onTrack when the "Acompanhar Pedido" button is pressed', () => {
    const onTrack = jest.fn();
    const { getByText } = renderWithTheme(
      <OrderConfirmation restaurantName="Pizza Talatona" total={13224} onDone={() => {}} onTrack={onTrack} />
    );
    fireEvent.press(getByText('Acompanhar Pedido'));
    expect(onTrack).toHaveBeenCalledTimes(1);
  });
});
