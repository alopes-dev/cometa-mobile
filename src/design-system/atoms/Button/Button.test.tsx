import { ActivityIndicator } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';
import { ThemeProvider } from '@/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Button', () => {
  it('fires onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = renderWithTheme(<Button onPress={onPress}>Confirm</Button>);
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not fire onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByRole } = renderWithTheme(
      <Button onPress={onPress} disabled>
        Confirm
      </Button>
    );
    fireEvent.press(getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not fire onPress and renders an ActivityIndicator when loading', () => {
    const onPress = jest.fn();
    const { getByRole, UNSAFE_getByType, queryByText } = renderWithTheme(
      <Button onPress={onPress} loading>
        Confirm
      </Button>
    );
    fireEvent.press(getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
    expect(queryByText('Confirm')).toBeNull();
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });
});
