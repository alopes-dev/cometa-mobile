import { act, render } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import Animated from 'react-native-reanimated';
import { useEntranceAnimation } from './useEntranceAnimation';

function Probe() {
  return <Animated.View testID="probe" style={useEntranceAnimation()} />;
}

/**
 * Lets the `isReduceMotionEnabled` promise resolve and gives Reanimated a
 * single frame to apply the result — far short of the 220ms an entrance takes,
 * so a view that is animating is still visibly mid-flight here.
 */
async function flushPreferences() {
  await act(async () => {});
  await act(async () => {
    jest.advanceTimersByTime(16);
  });
}

describe('useEntranceAnimation', () => {
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('is at rest as soon as reduce motion is known, without playing first', async () => {
    // The preference resolves a tick after mount. With the clock frozen, a view
    // that is still transparent here is one that started an entrance it should
    // never have started.
    jest.useFakeTimers();
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);

    const { getByTestId } = render(<Probe />);
    await flushPreferences();

    expect(getByTestId('probe')).toHaveAnimatedStyle({
      opacity: 1,
      transform: [{ translateY: 0 }],
    });
  });

  it('starts hidden and offset when motion is allowed', async () => {
    jest.useFakeTimers();
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);

    const { getByTestId } = render(<Probe />);

    // Asserted on the first frame, before the preference resolves: the element
    // must begin hidden and offset so there is an entrance to play at all.
    expect(getByTestId('probe')).toHaveAnimatedStyle({
      opacity: 0,
      transform: [{ translateY: 8 }],
    });
  });
});
