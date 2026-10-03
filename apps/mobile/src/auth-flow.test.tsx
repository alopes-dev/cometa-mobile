import type { ReactElement, ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';
import { AuthProvider } from '@/hooks/AuthProvider';

/**
 * The sign-in flow — page "AUTHENTICATION" of the Figma file.
 *
 * Covers that each screen mounts and that the two decisions the flow actually
 * makes hold: the CTA stays disabled until the number is a valid Angolan
 * mobile, and the code screen quotes back the number it was given rather than
 * the mock one drawn on the board.
 */

const params: Record<string, string> = {};
// `mock`-prefixed so the jest.mock factory below may close over them.
const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock('expo-router', () => {
  const React = require('react');
  return {
    useRouter: () => ({ push: mockPush, replace: jest.fn(), back: mockBack, dismiss: jest.fn() }),
    useLocalSearchParams: () => params,
    useFocusEffect: (callback: () => void | (() => void)) => {
      React.useEffect(callback, [callback]);
    },
    Stack: Object.assign(() => null, { Screen: () => null }),
    Link: () => null,
  };
});

const INITIAL_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SafeAreaProvider initialMetrics={INITIAL_METRICS}>
        <AuthProvider>{children}</AuthProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

function mount(ui: ReactElement) {
  return render(<Providers>{ui}</Providers>);
}

function setParams(next: Record<string, string>) {
  for (const key of Object.keys(params)) delete params[key];
  Object.assign(params, next);
}

beforeEach(() => {
  mockPush.mockClear();
  mockBack.mockClear();
  setParams({});
});

const SCREENS: { name: string; params?: Record<string, string>; load: () => { default: React.ComponentType } }[] = [
  { name: 'welcome', load: () => require('./app/(auth)/index') },
  { name: 'phone', load: () => require('./app/(auth)/phone') },
  { name: 'otp', params: { phoneNumber: '923456789' }, load: () => require('./app/(auth)/otp') },
  { name: 'name', params: { phoneNumber: '912000111' }, load: () => require('./app/(auth)/name') },
];

describe('sign-in path', () => {
  it.each(SCREENS)('$name mounts', ({ params: screenParams, load }) => {
    setParams(screenParams ?? {});
    const Screen = load().default;
    expect(() => mount(<Screen />)).not.toThrow();
  });

  it('welcome sends both actions to the number screen, since the number decides the branch', () => {
    const Welcome = require('./app/(auth)/index').default;
    mount(<Welcome />);

    fireEvent.press(screen.getByLabelText('Começar'));
    fireEvent.press(screen.getByLabelText('Já tenho uma conta'));

    expect(mockPush).toHaveBeenCalledTimes(2);
    expect(mockPush).toHaveBeenNthCalledWith(1, '/(auth)/phone');
    expect(mockPush).toHaveBeenNthCalledWith(2, '/(auth)/phone');
  });

  it('holds the number screen closed until the number is a valid Angolan mobile', () => {
    const Phone = require('./app/(auth)/phone').default;
    mount(<Phone />);

    const field = screen.getByLabelText('Número de telefone');
    const action = screen.getByLabelText('Continuar');

    expect(action).toBeDisabled();

    // Eight digits is one short, and a leading 8 is not a mobile prefix.
    fireEvent.changeText(field, '92345678');
    expect(screen.getByLabelText('Continuar')).toBeDisabled();
    fireEvent.changeText(field, '823456789');
    expect(screen.getByLabelText('Continuar')).toBeDisabled();

    fireEvent.changeText(field, '923456789');
    expect(screen.getByLabelText('Continuar')).toBeEnabled();
  });

  it('the code screen quotes back the number it was given, not the one on the board', () => {
    setParams({ phoneNumber: '912000111' });
    const Otp = require('./app/(auth)/otp').default;
    mount(<Otp />);

    expect(screen.getByText('Enviamos um código para +244 912 000 111.')).toBeTruthy();
  });
});
