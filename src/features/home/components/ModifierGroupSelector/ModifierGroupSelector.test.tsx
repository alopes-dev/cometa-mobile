import { render, fireEvent } from '@testing-library/react-native';
import { ModifierGroupSelector } from './ModifierGroupSelector';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';
import type { ModifierGroup } from '../../types';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const breadGroup: ModifierGroup = {
  id: 'pao',
  label: 'Escolha o pão',
  type: 'single',
  required: true,
  options: [
    { id: 'pao-tradicional', label: 'Tradicional', priceDelta: 0 },
    { id: 'pao-brioche', label: 'Brioche', priceDelta: 300 },
  ],
};

describe('ModifierGroupSelector', () => {
  it('renders the group label, options, and required indicator', () => {
    const { getByText } = renderWithTheme(
      <ModifierGroupSelector group={breadGroup} selectedOptionIds={[]} onToggle={() => {}} />
    );
    expect(getByText('Escolha o pão')).toBeTruthy();
    expect(getByText('Obrigatório')).toBeTruthy();
    expect(getByText('Tradicional')).toBeTruthy();
    expect(getByText('Brioche')).toBeTruthy();
    expect(getByText('+300 Kz')).toBeTruthy();
  });

  it('does not show a price for a zero-delta option', () => {
    const { queryByText } = renderWithTheme(
      <ModifierGroupSelector group={breadGroup} selectedOptionIds={[]} onToggle={() => {}} />
    );
    expect(queryByText('+0 Kz')).toBeNull();
  });

  it('fires onToggle with the pressed option id', () => {
    const onToggle = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <ModifierGroupSelector group={breadGroup} selectedOptionIds={[]} onToggle={onToggle} />
    );
    fireEvent.press(getByLabelText('Brioche'));
    expect(onToggle).toHaveBeenCalledWith('pao-brioche');
  });
});
