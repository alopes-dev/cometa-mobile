import { render } from '@testing-library/react-native';
import { NotificationRow } from './NotificationRow';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';
import type { AppNotification } from '../../types';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const baseNotification: AppNotification = {
  id: 'n1',
  category: 'promo',
  title: '50% Off em Pizzas',
  message: 'A sua oferta favorita está de volta hoje.',
  timestamp: '2 min atrás',
  group: 'Hoje',
  read: false,
};

describe('NotificationRow', () => {
  it('renders the title, message, and timestamp', () => {
    const { getByText } = renderWithTheme(<NotificationRow notification={baseNotification} />);
    expect(getByText('50% Off em Pizzas')).toBeTruthy();
    expect(getByText('A sua oferta favorita está de volta hoje.')).toBeTruthy();
    expect(getByText('2 min atrás')).toBeTruthy();
  });

  it('renders the unread dot when unread', () => {
    const { getByTestId } = renderWithTheme(<NotificationRow notification={baseNotification} />);
    expect(getByTestId('unread-dot')).toBeTruthy();
  });

  it('does not render the unread dot when read', () => {
    const { queryByTestId } = renderWithTheme(
      <NotificationRow notification={{ ...baseNotification, read: true }} />
    );
    expect(queryByTestId('unread-dot')).toBeNull();
  });
});
