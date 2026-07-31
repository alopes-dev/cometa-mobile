import { render, fireEvent } from '@testing-library/react-native';
import { Checkbox } from './Checkbox';
import { ThemeProvider } from '@/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Checkbox', () => {
  it('fires onChange with the toggled value', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(<Checkbox checked={false} onChange={onChange} />);
    fireEvent.press(getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('does not fire onChange when disabled', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(<Checkbox checked={false} onChange={onChange} disabled />);
    fireEvent.press(getByRole('checkbox'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
