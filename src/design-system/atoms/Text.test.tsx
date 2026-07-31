import { render } from '@testing-library/react-native';
import { Text } from './Text';
import { ThemeProvider } from '@/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Text', () => {
  it('renders its children', () => {
    const { getByText } = renderWithTheme(<Text>Cometa</Text>);
    expect(getByText('Cometa')).toBeTruthy();
  });

  it('applies the requested typography variant', () => {
    const { getByText } = renderWithTheme(<Text variant="headline">Cometa</Text>);
    const style = getByText('Cometa').props.style;
    expect(JSON.stringify(style)).toContain('28');
  });
});
