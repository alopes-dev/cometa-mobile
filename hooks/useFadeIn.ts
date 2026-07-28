import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { motion } from '@/constants/theme';

export function useFadeIn(delay = 0) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: motion.duration.base,
        delay,
        easing: motion.easing.emphasized,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: motion.duration.base,
        delay,
        easing: motion.easing.emphasized,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, opacity, translateY]);

  return { opacity, translateY };
}
