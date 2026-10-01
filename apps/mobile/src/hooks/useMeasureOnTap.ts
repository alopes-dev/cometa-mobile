import { useRef } from 'react';
import { View } from 'react-native';

export type ScreenOrigin = { x: number; y: number; width: number; height: number };

const EMPTY_ORIGIN: ScreenOrigin = { x: 0, y: 0, width: 0, height: 0 };
const MEASURE_TIMEOUT_MS = 200;

export function useMeasureOnTap() {
  const ref = useRef<View>(null);

  const measure = (): Promise<ScreenOrigin> =>
    new Promise((resolve) => {
      if (!ref.current) {
        resolve(EMPTY_ORIGIN);
        return;
      }

      let settled = false;
      // Some environments (older bridges, or a native view whose window
      // measurement callback never fires) would otherwise leave this promise
      // pending forever — fall back to "no origin" rather than hang the caller.
      const timeout = setTimeout(() => {
        if (settled) return;
        settled = true;
        resolve(EMPTY_ORIGIN);
      }, MEASURE_TIMEOUT_MS);

      ref.current.measureInWindow((x, y, width, height) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        resolve({ x, y, width, height });
      });
    });

  return { ref, measure };
}
