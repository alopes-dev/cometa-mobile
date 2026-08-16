import { render } from '@testing-library/react-native';
import { OrderSummaryCard } from './OrderSummaryCard';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('OrderSummaryCard', () => {
  it('renders formatted subtotal, VAT, and total', () => {
    const { getByText } = renderWithTheme(
      <OrderSummaryCard summary={{ subtotal: 11600, delivery: 0, vat: 1624, total: 13224 }} />
    );
    expect(getByText('11.600 Kz')).toBeTruthy();
    expect(getByText('1.624 Kz')).toBeTruthy();
    expect(getByText('13.224 Kz')).toBeTruthy();
  });

  it('renders "Grátis" for zero delivery fee', () => {
    const { getByText } = renderWithTheme(
      <OrderSummaryCard summary={{ subtotal: 1000, delivery: 0, vat: 140, total: 1140 }} />
    );
    expect(getByText('Grátis')).toBeTruthy();
  });

  it('renders the formatted delivery fee when non-zero', () => {
    const { getByText } = renderWithTheme(
      <OrderSummaryCard summary={{ subtotal: 1000, delivery: 500, vat: 140, total: 1640 }} />
    );
    expect(getByText('500 Kz')).toBeTruthy();
  });
});
