import { render, fireEvent } from '@testing-library/react-native';
import { CategoryTileList } from './CategoryTileList';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';
import type { HomeCategory } from '../../types';
import * as Haptics from 'expo-haptics';

beforeEach(() => {
  jest.clearAllMocks();
});

const categories: HomeCategory[] = [
  { id: 'pizza', label: 'Pizza', keywords: ['pizza'] },
  { id: 'sushi', label: 'Sushi', keywords: ['sushi'] },
];

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('CategoryTileList', () => {
  it('renders every craving', () => {
    const { getByText } = renderWithTheme(
      <CategoryTileList categories={categories} selected={null} onSelect={() => {}} />
    );
    expect(getByText('Pizza')).toBeTruthy();
    expect(getByText('Sushi')).toBeTruthy();
  });

  it('selects a craving that is not yet active', () => {
    const onSelect = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <CategoryTileList categories={categories} selected={null} onSelect={onSelect} />
    );
    fireEvent.press(getByLabelText('Pizza'));
    expect(onSelect).toHaveBeenCalledWith('pizza');
  });

  it('clears the craving when the active tile is tapped again', () => {
    const onSelect = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <CategoryTileList categories={categories} selected="pizza" onSelect={onSelect} />
    );
    fireEvent.press(getByLabelText('Pizza'));
    expect(onSelect).toHaveBeenCalledWith(null);
  });

  it('marks the active tile as selected', () => {
    const { getByLabelText } = renderWithTheme(
      <CategoryTileList categories={categories} selected="pizza" onSelect={() => {}} />
    );
    expect(getByLabelText('Pizza').props.accessibilityState).toMatchObject({ selected: true });
    expect(getByLabelText('Sushi').props.accessibilityState).toMatchObject({ selected: false });
  });

  it('gives selection feedback when a craving is picked', () => {
    const { getByLabelText } = renderWithTheme(
      <CategoryTileList categories={categories} selected={null} onSelect={() => {}} />
    );
    fireEvent.press(getByLabelText('Pizza'));
    expect(Haptics.selectionAsync).toHaveBeenCalled();
  });
});
