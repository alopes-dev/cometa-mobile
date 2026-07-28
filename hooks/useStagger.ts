import { useMemo } from 'react';
import { Animated } from 'react-native';
import { motion } from '@/constants/theme';
import { useFadeIn } from './useFadeIn';

export function useStagger(count: number, step = motion.stagger) {
  // Compute delays once — the hook order is stable because `count` and `step`
  // should be constant per component instance.
  const delays = useMemo(
    () => Array.from({ length: count }, (_, i) => i * step),
    [count, step]
  );

  // Hooks must be called unconditionally; we allocate a fixed pool for
  // reasonable staggered sections (up to 8 children). Callers requesting more
  // will get a runtime error, which is what we want — force a redesign.
  if (count > 8) throw new Error('useStagger supports up to 8 children');

  const s0 = useFadeIn(delays[0] ?? 0);
  const s1 = useFadeIn(delays[1] ?? 0);
  const s2 = useFadeIn(delays[2] ?? 0);
  const s3 = useFadeIn(delays[3] ?? 0);
  const s4 = useFadeIn(delays[4] ?? 0);
  const s5 = useFadeIn(delays[5] ?? 0);
  const s6 = useFadeIn(delays[6] ?? 0);
  const s7 = useFadeIn(delays[7] ?? 0);

  const all: Array<{ opacity: Animated.Value; translateY: Animated.Value }> =
    [s0, s1, s2, s3, s4, s5, s6, s7];

  return all.slice(0, count);
}
