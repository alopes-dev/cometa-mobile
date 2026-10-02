import { useEffect, useRef } from 'react';
import { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { useReducedMotion } from './useReducedMotion';

const DURATION = 220;

/**
 * Fades and lifts an element into place the first time it mounts.
 *
 * The motion preference resolves a tick *after* mount, so this cannot decide
 * once and be done: it reacts to the answer. When reduce motion is on — even
 * if it turns on mid-flight — the element snaps to its resting state instead
 * of travelling there, and `hasPlayed` keeps a later re-render from replaying
 * an entrance that already happened.
 */
export function useEntranceAnimation(delayMs = 0) {
  const reducedMotion = useReducedMotion();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);
  const hasPlayed = useRef(false);

  useEffect(() => {
    if (reducedMotion) {
      opacity.value = 1;
      translateY.value = 0;
      return;
    }
    if (hasPlayed.current) return;
    hasPlayed.current = true;
    opacity.value = withDelay(delayMs, withTiming(1, { duration: DURATION }));
    translateY.value = withDelay(delayMs, withTiming(0, { duration: DURATION }));
  }, [delayMs, opacity, reducedMotion, translateY]);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
}
