import { render, fireEvent } from '@testing-library/react-native';
import { RestaurantListFilterBar } from './RestaurantListFilterBar';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('RestaurantListFilterBar', () => {
  it('renders all five filter labels', () => {
    const { getByText } = renderWithTheme(<RestaurantListFilterBar selected={null} onSelect={() => {}} />);
    expect(getByText('Mais rápidos')).toBeTruthy();
    expect(getByText('Melhor avaliados')).toBeTruthy();
    expect(getByText('Mais próximos')).toBeTruthy();
    expect(getByText('Menor taxa')).toBeTruthy();
    expect(getByText('Promoções')).toBeTruthy();
  });

  it('selects a filter when pressed', () => {
    const onSelect = jest.fn();
    const { getByText } = renderWithTheme(<RestaurantListFilterBar selected={null} onSelect={onSelect} />);
    fireEvent.press(getByText('Mais rápidos'));
    expect(onSelect).toHaveBeenCalledWith('fastest');
  });

  it('deselects the active filter when pressed again', () => {
    const onSelect = jest.fn();
    const { getByText } = renderWithTheme(<RestaurantListFilterBar selected="fastest" onSelect={onSelect} />);
    fireEvent.press(getByText('Mais rápidos'));
    expect(onSelect).toHaveBeenCalledWith(null);
  });
});
