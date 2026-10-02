import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { useColorScheme } from 'react-native';
import { useTheme } from 'styled-components/native';
import { ThemeProvider } from './ThemeProvider';
import { semanticColors } from '@/theme';

jest.mock('react-native/Libraries/Utilities/useColorScheme');

function ThemeConsumer() {
  const theme = useTheme();
  return <Text testID="bg">{theme.colors.background.primary}</Text>;
}

function renderWithScheme(scheme: 'light' | 'dark') {
  (useColorScheme as jest.Mock).mockReturnValue(scheme);
  return render(
    <ThemeProvider>
      <ThemeConsumer />
    </ThemeProvider>
  );
}

describe('ThemeProvider', () => {
  it('provides the light theme when the system scheme is light', () => {
    const { getByTestId } = renderWithScheme('light');
    expect(getByTestId('bg').props.children).toBe(semanticColors.light.background.primary);
  });

  it('provides the dark theme when the system scheme is dark', () => {
    const { getByTestId } = renderWithScheme('dark');
    expect(getByTestId('bg').props.children).toBe(semanticColors.dark.background.primary);
  });

  // The dark base is deliberately near-black, not #000: elevated surfaces need
  // somewhere to go above the page background, and absolute black makes every
  // layer above it read as a seam. Asserted rather than commented because a
  // later "just use black" edit would otherwise pass silently.
  it('never uses absolute black as the dark background', () => {
    const { getByTestId } = renderWithScheme('dark');
    expect(getByTestId('bg').props.children).not.toBe('#000000');
  });

  it('exposes the same token keys in both schemes', () => {
    const keysOf = (o: object): string[] =>
      Object.entries(o)
        .flatMap(([k, v]) =>
          v && typeof v === 'object' ? keysOf(v).map((sub) => `${k}.${sub}`) : [k]
        )
        .sort();
    // Guards the defect the previous theme had: `surfaceElevated` existed only
    // in the dark palette, so it was unreachable from a component.
    expect(keysOf(semanticColors.dark)).toEqual(keysOf(semanticColors.light));
  });
});
