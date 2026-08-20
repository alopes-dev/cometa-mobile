import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { ScreenOrigin } from '@/hooks/useMeasureOnTap';

type HeroTransitionContextValue = {
  /** Morphs a ghost image from `from` to `to` (both in window coordinates) while the real navigation happens underneath. */
  startTransition: (imageUrl: string, from: ScreenOrigin, to: ScreenOrigin) => void;
};

const HeroTransitionContext = createContext<HeroTransitionContextValue>({
  startTransition: () => {},
});

export function useHeroTransition() {
  return useContext(HeroTransitionContext);
}

type Flight = { id: number; imageUrl: string; from: ScreenOrigin; to: ScreenOrigin };

const DURATION = 360;
const SOURCE_RADIUS = 16;

function HeroGhost({ imageUrl, from, to, onComplete }: Omit<Flight, 'id'> & { onComplete: () => void }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: DURATION, easing: Easing.out(Easing.cubic) }, (finished) => {
      if (finished) runOnJS(onComplete)();
    });
    // Mount-once flight — from/to/onComplete are captured at spawn time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => {
    const left = from.x + (to.x - from.x) * progress.value;
    const top = from.y + (to.y - from.y) * progress.value;
    const width = from.width + (to.width - from.width) * progress.value;
    const height = from.height + (to.height - from.height) * progress.value;
    const borderRadius = SOURCE_RADIUS * (1 - progress.value);
    return {
      position: 'absolute' as const,
      left,
      top,
      width,
      height,
      borderRadius,
      overflow: 'hidden' as const,
    };
  });

  return (
    <Animated.View style={style} pointerEvents="none">
      <Image source={{ uri: imageUrl }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
    </Animated.View>
  );
}

export function HeroTransitionProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const [flight, setFlight] = useState<Flight | null>(null);
  const flightId = useRef(0);

  const startTransition = (imageUrl: string, from: ScreenOrigin, to: ScreenOrigin) => {
    if (reducedMotion || from.width === 0 || to.width === 0) return;
    setFlight({ id: flightId.current++, imageUrl, from, to });
  };

  return (
    <HeroTransitionContext.Provider value={{ startTransition }}>
      <View style={{ flex: 1 }}>
        {children}
        {flight ? (
          <HeroGhost key={flight.id} imageUrl={flight.imageUrl} from={flight.from} to={flight.to} onComplete={() => setFlight(null)} />
        ) : null}
      </View>
    </HeroTransitionContext.Provider>
  );
}
