import { fireEvent, render } from '@testing-library/react-native';
import { SectionHeader } from './SectionHeader';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';
import { layout, typography } from '@/theme';
import * as Haptics from 'expo-haptics';

beforeEach(() => {
  jest.clearAllMocks();
});

/** `hitSlop` is either a number applied on all sides or a per-side object. */
function verticalSlop(hitSlop: number | { top?: number; bottom?: number } | undefined): number {
  if (typeof hitSlop === 'number') return hitSlop * 2;
  return (hitSlop?.top ?? 0) + (hitSlop?.bottom ?? 0);
}

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('SectionHeader', () => {
  it('renders the title', () => {
    const { getByText } = renderWithTheme(<SectionHeader title="Para ti" />);
    expect(getByText('Para ti')).toBeTruthy();
  });

  it('omits the action when no label is given', () => {
    const { queryByRole } = renderWithTheme(<SectionHeader title="Para ti" />);
    expect(queryByRole('button')).toBeNull();
  });

  it('gives the action a touch target of at least the HIG minimum', () => {
    const { getByRole } = renderWithTheme(<SectionHeader title="Para ti" actionLabel="Ver tudo" />);
    // The label is only as tall as its line box, so the target has to come from
    // hitSlop. Derived from the type token rather than hardcoded, so changing
    // the variant cannot silently shrink the target below 44pt.
    const touchableHeight =
      typography.label.lineHeight + verticalSlop(getByRole('button').props.hitSlop);
    expect(touchableHeight).toBeGreaterThanOrEqual(layout.minHitTarget);
  });

  it('gives impact feedback when the action is pressed', () => {
    const { getByRole } = renderWithTheme(
      <SectionHeader title="Para ti" actionLabel="Ver tudo" onPressAction={() => {}} />
    );
    fireEvent.press(getByRole('button'));
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });
});
