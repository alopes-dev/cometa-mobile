import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';
import { NotificationBell } from './NotificationBell';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('NotificationBell', () => {
  it('hides the dot while nothing is waiting', () => {
    const { queryByTestId } = renderWithTheme(<NotificationBell accessibilityLabel="Notificações" />);
    expect(queryByTestId('unread-indicator')).toBeNull();
  });

  it('shows the dot when something is unread', () => {
    const { getByTestId } = renderWithTheme(
      <NotificationBell hasUnread accessibilityLabel="Notificações, tens notificações por ler" />
    );
    expect(getByTestId('unread-indicator')).toBeTruthy();
  });

  it('opens the notification centre', () => {
    const onPress = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <NotificationBell onPress={onPress} accessibilityLabel="Notificações" />
    );
    fireEvent.press(getByLabelText('Notificações'));
    expect(onPress).toHaveBeenCalled();
  });
});
