import { useEffect } from 'react';
import { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { useReducedMotion } from './useReducedMotion';

export function useEntranceAnimation(delayMs = 0) {
  const reducedMotion = useReducedMotion();
  const opacity = useSharedValue(reducedMotion ? 1 : 0);
  const translateY = useSharedValue(reducedMotion ? 0 : 8);

  useEffect(() => {
    if (reducedMotion) return;
    opacity.value = withDelay(delayMs, withTiming(1, { duration: 220 }));
    translateY.value = withDelay(delayMs, withTiming(0, { duration: 220 }));
    // Intentionally mount-only: this plays once when the element first appears.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
}
