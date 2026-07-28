import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { motion } from '@/constants/theme';

export function useFocusFade(delay = 0): { opacity: Animated.Value; translateY: Animated.Value } {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(6)).current;

  useFocusEffect(
    useCallback(() => {
      opacity.setValue(0);
      translateY.setValue(6);

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
    }, [delay, opacity, translateY]),
  );

  return { opacity, translateY };
}
