import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';
import { discovery } from '../../content';
import type { NearbyPin } from '../../types';
import { NearbyMapCard } from './NearbyMapCard';

const pins: NearbyPin[] = [
  { id: 'p1', x: 0.1, y: 0.2 },
  { id: 'p2', x: 0.4, y: 0.4 },
  { id: 'p3', x: 0.7, y: 0.6 },
];

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('NearbyMapCard', () => {
  it('marks every merchant on the preview', () => {
    const { getAllByLabelText } = renderWithTheme(<NearbyMapCard pins={pins} onPress={() => {}} />);
    expect(getAllByLabelText(discovery.merchantPin)).toHaveLength(pins.length);
  });

  it('names the action it leads to', () => {
    const { getByText } = renderWithTheme(<NearbyMapCard pins={pins} onPress={() => {}} />);
    expect(getByText(discovery.openMap)).toBeTruthy();
  });

  /** A 180pt picture of a map that ignores a tap reads as broken. */
  it('opens the map from anywhere on the card, not just the pill', () => {
    const onPress = jest.fn();
    const { getByLabelText } = renderWithTheme(<NearbyMapCard pins={pins} onPress={onPress} />);
    fireEvent.press(getByLabelText(discovery.openMap));
    expect(onPress).toHaveBeenCalled();
  });
});
