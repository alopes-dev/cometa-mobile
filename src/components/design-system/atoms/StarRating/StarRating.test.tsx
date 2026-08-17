import { render, fireEvent } from '@testing-library/react-native';
import { StarRating } from './StarRating';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('StarRating', () => {
  it('renders 5 stars by default', () => {
    const { getAllByRole } = renderWithTheme(<StarRating value={0} onChange={() => {}} />);
    expect(getAllByRole('button')).toHaveLength(5);
  });

  it('renders a custom star count', () => {
    const { getAllByRole } = renderWithTheme(<StarRating value={0} onChange={() => {}} count={3} />);
    expect(getAllByRole('button')).toHaveLength(3);
  });

  it('fires onChange with the pressed star value', () => {
    const onChange = jest.fn();
    const { getByLabelText } = renderWithTheme(<StarRating value={0} onChange={onChange} />);
    fireEvent.press(getByLabelText('3 de 5 estrelas'));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('exposes the current value via accessibilityValue', () => {
    const { getByLabelText } = renderWithTheme(<StarRating value={4} onChange={() => {}} label="Nota" />);
    expect(getByLabelText('Nota').props.accessibilityValue).toEqual({ min: 0, max: 5, now: 4 });
  });
});
