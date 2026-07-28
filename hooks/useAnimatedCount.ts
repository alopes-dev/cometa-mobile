import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { motion } from '@/constants/theme';

export function useAnimatedCount(value: number) {
  const scale = useRef(new Animated.Value(1)).current;
  const previous = useRef(value);

  useEffect(() => {
    if (value > previous.current) {
      Animated.sequence([
        Animated.spring(scale, {
          toValue: 1.25,
          useNativeDriver: true,
          tension: motion.easing.springBouncy.tension,
          friction: motion.easing.springBouncy.friction,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: motion.easing.springBouncy.tension,
          friction: motion.easing.springBouncy.friction,
        }),
      ]).start();
    }
    previous.current = value;
  }, [value, scale]);

  return { scale };
}
