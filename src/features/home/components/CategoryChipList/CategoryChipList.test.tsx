import { render, fireEvent } from '@testing-library/react-native';
import { CategoryChipList } from './CategoryChipList';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('CategoryChipList', () => {
  it('renders a "Todos" chip plus one chip per category', () => {
    const { getByText } = renderWithTheme(
      <CategoryChipList categories={['Angolana', 'Italiana']} selected={null} onSelect={() => {}} />
    );
    expect(getByText('Todos')).toBeTruthy();
    expect(getByText('Angolana')).toBeTruthy();
    expect(getByText('Italiana')).toBeTruthy();
  });

  it('calls onSelect with the category name when a chip is pressed', () => {
    const onSelect = jest.fn();
    const { getByText } = renderWithTheme(
      <CategoryChipList categories={['Angolana', 'Italiana']} selected={null} onSelect={onSelect} />
    );
    fireEvent.press(getByText('Italiana'));
    expect(onSelect).toHaveBeenCalledWith('Italiana');
  });

  it('calls onSelect with null when "Todos" is pressed', () => {
    const onSelect = jest.fn();
    const { getByText } = renderWithTheme(
      <CategoryChipList categories={['Angolana']} selected="Angolana" onSelect={onSelect} />
    );
    fireEvent.press(getByText('Todos'));
    expect(onSelect).toHaveBeenCalledWith(null);
  });
});
