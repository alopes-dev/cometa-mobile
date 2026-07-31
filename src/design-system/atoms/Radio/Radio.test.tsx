import { render, fireEvent } from '@testing-library/react-native';
import { Radio } from './Radio';
import { ThemeProvider } from '@/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Radio', () => {
  it('fires onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = renderWithTheme(<Radio selected={false} onPress={onPress} />);
    fireEvent.press(getByRole('radio'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not fire onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByRole } = renderWithTheme(<Radio selected={false} onPress={onPress} disabled />);
    fireEvent.press(getByRole('radio'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
