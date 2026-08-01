import { render, fireEvent } from '@testing-library/react-native';
import { SearchBar } from './SearchBar';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('SearchBar', () => {
  it('fires onChangeText with the typed value', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = renderWithTheme(
      <SearchBar value="" onChangeText={onChangeText} placeholder="Buscar restaurantes" />
    );
    fireEvent.changeText(getByPlaceholderText('Buscar restaurantes'), 'pizza');
    expect(onChangeText).toHaveBeenCalledWith('pizza');
  });

  it('renders the current value', () => {
    const { getByDisplayValue } = renderWithTheme(
      <SearchBar value="sushi" onChangeText={() => {}} placeholder="Buscar restaurantes" />
    );
    expect(getByDisplayValue('sushi')).toBeTruthy();
  });
});
