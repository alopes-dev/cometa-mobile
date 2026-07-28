import type { Animated } from 'react-native';

export function useInterpolatedColor(
  progress: Animated.Value,
  from: string,
  to: string
): Animated.AnimatedInterpolation<string> {
  return progress.interpolate({
    inputRange: [0, 1],
    outputRange: [from, to],
  });
}
