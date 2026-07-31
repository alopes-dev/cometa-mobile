import { render } from '@testing-library/react-native';
import { Avatar } from './Avatar';
import { ThemeProvider } from '@/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Avatar', () => {
  it('renders initials when no source is given', () => {
    const { getByText } = renderWithTheme(<Avatar initials="AL" />);
    expect(getByText('AL')).toBeTruthy();
  });
});
