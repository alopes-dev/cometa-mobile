import { render, fireEvent } from '@testing-library/react-native';
import { DetailsRow } from './DetailsRow';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('DetailsRow', () => {
  it('renders the title and subtitle', () => {
    const { getByText } = renderWithTheme(
      <DetailsRow icon={{ name: 'location-outline', sf: 'location' }} title="Home" subtitle="Rua Major Kanhangulo, 123" />
    );
    expect(getByText('Home')).toBeTruthy();
    expect(getByText('Rua Major Kanhangulo, 123')).toBeTruthy();
  });

  it('renders a text trailing label', () => {
    const { getByText } = renderWithTheme(
      <DetailsRow icon={{ name: 'card-outline', sf: 'creditcard' }} title="Visa ····4242" subtitle="EXPIRES 12/26" trailing="Edit" />
    );
    expect(getByText('Edit')).toBeTruthy();
  });

  it('fires onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = renderWithTheme(
      <DetailsRow
        icon={{ name: 'location-outline', sf: 'location' }}
        title="Home"
        subtitle="Rua Major Kanhangulo, 123"
        trailing="chevron"
        onPress={onPress}
      />
    );
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
