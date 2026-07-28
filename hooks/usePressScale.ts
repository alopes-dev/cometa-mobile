import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import { motion, pressed } from '@/constants/theme';

export function usePressScale() {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: pressed.scale,
      useNativeDriver: true,
      tension: motion.easing.spring.tension,
      friction: motion.easing.spring.friction,
    }).start();
  }, [scale]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: motion.easing.spring.tension,
      friction: motion.easing.spring.friction,
    }).start();
  }, [scale]);

  return { scale, onPressIn, onPressOut };
}
