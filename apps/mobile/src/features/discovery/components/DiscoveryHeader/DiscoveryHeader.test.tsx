import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';
import { discovery } from '../../content';
import { DiscoveryHeader } from './DiscoveryHeader';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('DiscoveryHeader', () => {
  it('names the screen and says what it is for', () => {
    const { getByText } = renderWithTheme(<DiscoveryHeader />);
    expect(getByText(discovery.title)).toBeTruthy();
    expect(getByText(discovery.subtitle)).toBeTruthy();
  });

  it('hides the dot while nothing is waiting', () => {
    const { queryByTestId } = renderWithTheme(<DiscoveryHeader />);
    expect(queryByTestId('unread-indicator')).toBeNull();
  });

  it('shows the dot and says so out loud when something is unread', () => {
    const { getByTestId, getByLabelText } = renderWithTheme(<DiscoveryHeader hasUnread />);
    expect(getByTestId('unread-indicator')).toBeTruthy();
    // Colour alone must never carry the state, so the dot is also spoken.
    expect(
      getByLabelText(`${discovery.notifications}, ${discovery.unreadNotifications}`)
    ).toBeTruthy();
  });

  it('opens the notification centre', () => {
    const onPressNotifications = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <DiscoveryHeader onPressNotifications={onPressNotifications} />
    );
    fireEvent.press(getByLabelText(discovery.notifications));
    expect(onPressNotifications).toHaveBeenCalled();
  });
});
