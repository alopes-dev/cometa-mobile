import { render, fireEvent } from '@testing-library/react-native';
import { MenuTabs } from './MenuTabs';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const tabs = [
  { key: 'popular', title: 'Populares agora', icon: '🔥' },
  { key: 'Pratos Principais', title: 'Pratos Principais' },
  { key: 'Bebidas', title: 'Bebidas' },
];

describe('MenuTabs', () => {
  it('renders one chip per tab, prefixing the icon when present', () => {
    const { getByText } = renderWithTheme(<MenuTabs tabs={tabs} selectedKey="popular" onSelect={() => {}} />);
    expect(getByText('🔥 Populares agora')).toBeTruthy();
    expect(getByText('Pratos Principais')).toBeTruthy();
    expect(getByText('Bebidas')).toBeTruthy();
  });

  it('calls onSelect with the tapped tab key', () => {
    const onSelect = jest.fn();
    const { getByText } = renderWithTheme(<MenuTabs tabs={tabs} selectedKey="popular" onSelect={onSelect} />);
    fireEvent.press(getByText('Bebidas'));
    expect(onSelect).toHaveBeenCalledWith('Bebidas');
  });
});
