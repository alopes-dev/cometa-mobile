import { useEffect } from 'react';
import { Image } from 'expo-image';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export type FlyToCartGhostProps = {
  imageUrl: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  onComplete: () => void;
};

const DURATION = 480;
const GHOST_SIZE = 40;
const FADE_START = 0.7;

export function FlyToCartGhost({ imageUrl, from, to, onComplete }: FlyToCartGhostProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: DURATION, easing: Easing.out(Easing.cubic) }, (finished) => {
      if (finished) runOnJS(onComplete)();
    });
    // Mount-once flight — from/to/onComplete are captured at spawn time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => {
    const x = from.x + (to.x - from.x) * progress.value;
    const y = from.y + (to.y - from.y) * progress.value;
    const scale = 1 - 0.6 * progress.value;
    const opacity = progress.value < FADE_START ? 1 : 1 - (progress.value - FADE_START) / (1 - FADE_START);
    return {
      position: 'absolute' as const,
      left: x,
      top: y,
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View style={style} pointerEvents="none">
      <Image
        source={{ uri: imageUrl }}
        style={{ width: GHOST_SIZE, height: GHOST_SIZE, borderRadius: GHOST_SIZE / 2 }}
        contentFit="cover"
      />
    </Animated.View>
  );
}
