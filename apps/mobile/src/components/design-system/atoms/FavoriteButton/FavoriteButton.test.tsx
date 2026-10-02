import { fireEvent, render } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';
import { FavoriteButton } from './FavoriteButton';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';

beforeEach(() => {
  jest.clearAllMocks();
});

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('FavoriteButton', () => {
  it('toggles when pressed', () => {
    const onToggle = jest.fn();
    const { getByLabelText } = renderWithTheme(<FavoriteButton isFavorite={false} onToggle={onToggle} />);
    fireEvent.press(getByLabelText('Adicionar aos favoritos'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('gives impact feedback, because favouriting is a state change the user cannot see confirmed elsewhere', () => {
    const { getByLabelText } = renderWithTheme(<FavoriteButton isFavorite={false} onToggle={() => {}} />);
    fireEvent.press(getByLabelText('Adicionar aos favoritos'));
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });
});
