import { fireEvent, render } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';
import { AssistantCard } from './AssistantCard';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';

beforeEach(() => {
  jest.clearAllMocks();
});

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('AssistantCard', () => {
  it('renders the assistant invitation', () => {
    const { getByText } = renderWithTheme(<AssistantCard />);
    expect(getByText('Hi Kometa')).toBeTruthy();
    expect(getByText('Ainda com fome? Tenho ideias rápidas para ti.')).toBeTruthy();
  });

  it('fires onPress and gives impact feedback', () => {
    const onPress = jest.fn();
    const { getByRole } = renderWithTheme(<AssistantCard onPress={onPress} />);
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });
});
