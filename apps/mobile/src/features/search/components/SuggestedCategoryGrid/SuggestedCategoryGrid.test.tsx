import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';
import { mockSuggestedCategories } from '../../mockData';
import { SuggestedCategoryGrid } from './SuggestedCategoryGrid';

function renderGrid(onSelect = jest.fn()) {
  return {
    onSelect,
    ...render(
      <ThemeProvider>
        <SuggestedCategoryGrid categories={mockSuggestedCategories} onSelect={onSelect} />
      </ThemeProvider>
    ),
  };
}

describe('SuggestedCategoryGrid', () => {
  it('draws the four tiles the board draws', () => {
    const { getAllByTestId, getByText } = renderGrid();
    expect(getAllByTestId(/^suggested-category-/)).toHaveLength(4);
    for (const label of ['Hambúrguer', 'Pizza', 'Sushi', 'Farmácia']) {
      expect(getByText(label)).toBeTruthy();
    }
  });

  it('hands back the category that was tapped', () => {
    const { getByText, onSelect } = renderGrid();
    fireEvent.press(getByText('Sushi'));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'sushi' }));
  });
});
