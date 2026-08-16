import { render, fireEvent } from '@testing-library/react-native';
import { QuantityStepper } from './QuantityStepper';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('QuantityStepper', () => {
  it('renders the current quantity', () => {
    const { getByText } = renderWithTheme(
      <QuantityStepper quantity={2} onIncrement={() => {}} onDecrement={() => {}} />
    );
    expect(getByText('2')).toBeTruthy();
  });

  it('fires onIncrement when the plus button is pressed', () => {
    const onIncrement = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <QuantityStepper quantity={1} onIncrement={onIncrement} onDecrement={() => {}} />
    );
    fireEvent.press(getByLabelText('Aumentar quantidade'));
    expect(onIncrement).toHaveBeenCalledTimes(1);
  });

  it('fires onDecrement when the minus button is pressed', () => {
    const onDecrement = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <QuantityStepper quantity={1} onIncrement={() => {}} onDecrement={onDecrement} />
    );
    fireEvent.press(getByLabelText('Diminuir quantidade'));
    expect(onDecrement).toHaveBeenCalledTimes(1);
  });
});
