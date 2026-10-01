import { Text as RNText } from 'react-native';
import { render } from '@testing-library/react-native';
import { Card } from './Card';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Card', () => {
  it('renders its children', () => {
    const { getByText } = renderWithTheme(
      <Card>
        <RNText>Inside the card</RNText>
      </Card>
    );
    expect(getByText('Inside the card')).toBeTruthy();
  });
});
