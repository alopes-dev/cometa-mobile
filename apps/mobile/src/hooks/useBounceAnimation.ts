import { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { useReducedMotion } from './useReducedMotion';

export function useBounceAnimation(peakScale = 1.25) {
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const bounce = () => {
    if (reducedMotion) return;
    scale.value = withSequence(withTiming(peakScale, { duration: 120 }), withTiming(1, { duration: 160 }));
  };

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return { style, bounce };
}
