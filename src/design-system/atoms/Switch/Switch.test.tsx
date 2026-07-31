import { render, fireEvent } from '@testing-library/react-native';
import { Switch } from './Switch';
import { ThemeProvider } from '@/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Switch', () => {
  it('fires onValueChange with the toggled value', () => {
    const onValueChange = jest.fn();
    const { getByRole } = renderWithTheme(<Switch value={false} onValueChange={onValueChange} />);
    fireEvent(getByRole('switch'), 'valueChange', true);
    expect(onValueChange).toHaveBeenCalledWith(true);
  });
});
