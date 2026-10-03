import { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useReducedMotion } from './useReducedMotion';

/**
 * `duration` is the press-in timing. It is a parameter rather than a constant
 * because a Figma board can annotate its own (the product board's add-to-cart
 * button specifies 150ms — node 48:20731); callers that say nothing keep the
 * previous 100ms, so no existing press is re-tuned by this.
 */
export function usePressScale(pressedScale = 0.98, duration = 100) {
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const onPressIn = () => {
    if (reducedMotion) return;
    scale.value = withTiming(pressedScale, { duration });
  };

  const onPressOut = () => {
    if (reducedMotion) return;
    scale.value = withSpring(1, { damping: 14, stiffness: 180 });
  };

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return { style, onPressIn, onPressOut };
}
