import { render, fireEvent } from '@testing-library/react-native';
import { Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';
import type { BroadCategory } from '../../types';
import { BroadCategoryGrid } from './BroadCategoryGrid';
import { COLUMNS, TILE_GAP } from './BroadCategoryGrid.styles';

beforeEach(() => {
  jest.clearAllMocks();
});

const categories: BroadCategory[] = [
  { id: 'comida', label: 'Comida', icon: { name: 'restaurant-outline', sf: 'fork.knife' } },
  {
    id: 'supermercado',
    label: 'Supermercado',
    icon: { name: 'basket-outline', sf: 'basket.fill' },
  },
  { id: 'farmacia', label: 'Farmácia', icon: { name: 'medkit-outline', sf: 'cross.case.fill' } },
];

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('BroadCategoryGrid', () => {
  it('renders every vertical', () => {
    const { getByText } = renderWithTheme(
      <BroadCategoryGrid categories={categories} onSelect={() => {}} />
    );
    for (const category of categories) {
      expect(getByText(category.label)).toBeTruthy();
    }
  });

  it('opens the vertical that was tapped', () => {
    const onSelect = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <BroadCategoryGrid categories={categories} onSelect={onSelect} />
    );
    fireEvent.press(getByLabelText('Supermercado'));
    expect(onSelect).toHaveBeenCalledWith('supermercado');
  });

  it('gives tap feedback', () => {
    const { getByLabelText } = renderWithTheme(
      <BroadCategoryGrid categories={categories} onSelect={() => {}} />
    );
    fireEvent.press(getByLabelText('Comida'));
    expect(Haptics.impactAsync).toHaveBeenCalled();
  });

  /**
   * The board's fixed 120pt tile only fits three to a row on the 430pt frame
   * it was drawn at. Deriving the column from the window is what keeps the
   * 3-up composition on a narrower phone, so the arithmetic is pinned here.
   */
  it('fits exactly three tiles to a row at any window width', () => {
    const inset = 20;
    const { getAllByTestId } = renderWithTheme(
      <BroadCategoryGrid categories={categories} onSelect={() => {}} horizontalInset={inset} />
    );

    const windowWidth = Dimensions.get('window').width;
    const expected = Math.floor((windowWidth - inset * 2 - TILE_GAP * (COLUMNS - 1)) / COLUMNS);

    const tiles = getAllByTestId('broad-category-tile');
    expect(tiles).toHaveLength(categories.length);
    for (const tile of tiles) {
      expect(tile.props.width).toBe(expected);
    }
    expect(expected * COLUMNS + TILE_GAP * (COLUMNS - 1)).toBeLessThanOrEqual(
      windowWidth - inset * 2
    );
  });
});
