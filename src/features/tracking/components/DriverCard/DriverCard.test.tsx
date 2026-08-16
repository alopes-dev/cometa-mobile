import { render, fireEvent } from '@testing-library/react-native';
import { Linking } from 'react-native';
import { DriverCard } from './DriverCard';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';
import type { Driver } from '../../types';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const driver: Driver = {
  name: 'João Manuel',
  photoUrl: 'https://picsum.photos/seed/driver/200/200',
  rating: 4.9,
  vehicle: 'Honda PCX',
  plate: 'LD-23-45-AB',
  phone: '+244923456789',
  etaMinutes: 8,
};

describe('DriverCard', () => {
  it('renders the driver name, rating, vehicle, plate, and ETA', () => {
    const { getByText } = renderWithTheme(<DriverCard driver={driver} />);
    expect(getByText('João Manuel')).toBeTruthy();
    expect(getByText('4.9')).toBeTruthy();
    expect(getByText('Honda PCX · LD-23-45-AB')).toBeTruthy();
    expect(getByText('Chega em aproximadamente 8 min')).toBeTruthy();
  });

  it('opens the phone dialer with the driver\'s number when "Ligar" is pressed', () => {
    const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
    const { getByLabelText } = renderWithTheme(<DriverCard driver={driver} />);
    fireEvent.press(getByLabelText('Ligar ao entregador'));
    expect(openURL).toHaveBeenCalledWith('tel:+244923456789');
    openURL.mockRestore();
  });
});
