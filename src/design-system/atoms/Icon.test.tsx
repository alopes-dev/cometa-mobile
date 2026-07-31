import { Platform } from 'react-native';
import { render } from '@testing-library/react-native';
import { Icon } from './Icon';
import { ThemeProvider } from '@/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Icon', () => {
  it('renders without crashing using the Ionicons fallback name', () => {
    Platform.OS = 'android';
    const { toJSON } = renderWithTheme(<Icon name="cart" />);
    expect(toJSON()).toBeTruthy();
  });
});
