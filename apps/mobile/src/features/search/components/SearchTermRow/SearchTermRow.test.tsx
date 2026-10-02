import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';
import { search } from '../../content';
import { SearchTermRow } from './SearchTermRow';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('SearchTermRow', () => {
  it('runs the term it shows', () => {
    const onPress = jest.fn();
    const { getByText } = renderWithTheme(
      <SearchTermRow term="Hambúrguer" kind="recent" onPress={onPress} />
    );
    fireEvent.press(getByText('Hambúrguer'));
    expect(onPress).toHaveBeenCalledWith('Hambúrguer');
  });

  it('forgets a remembered term without running it', () => {
    const onPress = jest.fn();
    const onRemove = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <SearchTermRow term="Pizza" kind="recent" onPress={onPress} onRemove={onRemove} />
    );
    fireEvent.press(getByLabelText(search.removeRecent('Pizza')));
    expect(onRemove).toHaveBeenCalledWith('Pizza');
    expect(onPress).not.toHaveBeenCalled();
  });

  it('gives a popular term nothing to forget — it is not the customer’s to remove', () => {
    const { queryByLabelText } = renderWithTheme(
      <SearchTermRow term="Sushi" kind="popular" onPress={() => {}} />
    );
    expect(queryByLabelText(search.removeRecent('Sushi'))).toBeNull();
  });
});
