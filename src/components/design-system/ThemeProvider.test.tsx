import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { useColorScheme } from 'react-native';
import { useTheme } from 'styled-components/native';
import { ThemeProvider } from './ThemeProvider';

jest.mock('react-native/Libraries/Utilities/useColorScheme');

function ThemeConsumer() {
  const theme = useTheme();
  return <Text testID="bg">{theme.colors.background}</Text>;
}

describe('ThemeProvider', () => {
  it('provides the light theme when the system scheme is light', () => {
    (useColorScheme as jest.Mock).mockReturnValue('light');
    const { getByTestId } = render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(getByTestId('bg').props.children).toBe('#FFFFFF');
  });

  it('provides the dark theme when the system scheme is dark', () => {
    (useColorScheme as jest.Mock).mockReturnValue('dark');
    const { getByTestId } = render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(getByTestId('bg').props.children).toBe('#000000');
  });
});
