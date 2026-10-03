import { render, fireEvent } from '@testing-library/react-native';
import { MenuTabs } from './MenuTabs';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const tabs = [
  { key: 'popular', title: 'Mais pedidos' },
  { key: 'Pratos Principais', title: 'Pratos Principais' },
  { key: 'Bebidas', title: 'Bebidas' },
];

describe('MenuTabs', () => {
  it('renders one label per tab', () => {
    const { getByText } = renderWithTheme(
      <MenuTabs tabs={tabs} selectedKey="popular" onSelect={() => {}} />
    );
    expect(getByText('Mais pedidos')).toBeTruthy();
    expect(getByText('Pratos Principais')).toBeTruthy();
    expect(getByText('Bebidas')).toBeTruthy();
  });

  it('marks only the selected tab as selected, for assistive tech as well as sight', () => {
    const { getByRole } = renderWithTheme(
      <MenuTabs tabs={tabs} selectedKey="Bebidas" onSelect={() => {}} />
    );
    expect(getByRole('tab', { name: 'Bebidas', selected: true })).toBeTruthy();
    expect(getByRole('tab', { name: 'Mais pedidos', selected: false })).toBeTruthy();
  });

  it('calls onSelect with the tapped tab key', () => {
    const onSelect = jest.fn();
    const { getByText } = renderWithTheme(
      <MenuTabs tabs={tabs} selectedKey="popular" onSelect={onSelect} />
    );
    fireEvent.press(getByText('Bebidas'));
    expect(onSelect).toHaveBeenCalledWith('Bebidas');
  });
});
