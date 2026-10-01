import { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useReducedMotion } from './useReducedMotion';

export function usePressScale(pressedScale = 0.98) {
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const onPressIn = () => {
    if (reducedMotion) return;
    scale.value = withTiming(pressedScale, { duration: 100 });
  };

  const onPressOut = () => {
    if (reducedMotion) return;
    scale.value = withSpring(1, { damping: 14, stiffness: 180 });
  };

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return { style, onPressIn, onPressOut };
}
