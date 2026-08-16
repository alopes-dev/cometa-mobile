import { render, fireEvent } from '@testing-library/react-native';
import { OptionCard } from './OptionCard';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('OptionCard', () => {
  it('renders the title and subtitle', () => {
    const { getByText } = renderWithTheme(
      <OptionCard
        icon={{ name: 'bicycle-outline', sf: 'bicycle' }}
        title="Entrega"
        subtitle="Entregar no meu endereço"
        selected={false}
        onPress={() => {}}
      />
    );
    expect(getByText('Entrega')).toBeTruthy();
    expect(getByText('Entregar no meu endereço')).toBeTruthy();
  });

  it('exposes its selected state via accessibilityState', () => {
    const { getByRole } = renderWithTheme(
      <OptionCard icon={{ name: 'bicycle-outline', sf: 'bicycle' }} title="Entrega" selected onPress={() => {}} />
    );
    expect(getByRole('radio').props.accessibilityState).toEqual({ checked: true });
  });

  it('fires onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = renderWithTheme(
      <OptionCard icon={{ name: 'bicycle-outline', sf: 'bicycle' }} title="Entrega" selected={false} onPress={onPress} />
    );
    fireEvent.press(getByRole('radio'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
