import { Text as RNText } from 'react-native';
import { render } from '@testing-library/react-native';
import { PlaceholderScreen } from './PlaceholderScreen';
import { ThemeProvider } from '@/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('PlaceholderScreen', () => {
  it('renders the given label', () => {
    const { getByText } = renderWithTheme(<PlaceholderScreen label="Home" />);
    expect(getByText('Home')).toBeTruthy();
  });

  it('renders optional children below the label', () => {
    const { getByText } = renderWithTheme(
      <PlaceholderScreen label="Welcome">
        <RNText>Get Started</RNText>
      </PlaceholderScreen>
    );
    expect(getByText('Get Started')).toBeTruthy();
  });
});
