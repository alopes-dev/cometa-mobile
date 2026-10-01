import { View } from 'react-native';
import type { GestureHandlerRootView as GestureHandlerRootViewType } from 'react-native-gesture-handler';

// react-native-gesture-handler throws synchronously at require-time when its
// native module isn't linked yet (same "rebuild your app" situation as
// @rnmapbox/maps — see src/features/tracking/mapbox.ts). Because
// GestureHandlerRootView wraps the entire app in the root layout, an
// unguarded import here would crash every screen, not just one — so this
// falls back to a plain View instead of hard-crashing the whole app.
let resolvedRootView: typeof GestureHandlerRootViewType | typeof View = View;
let available = false;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  resolvedRootView = require('react-native-gesture-handler').GestureHandlerRootView;
  available = true;
} catch {
  resolvedRootView = View;
  available = false;
}

export const GestureHandlerRootView = resolvedRootView;
export const isGestureHandlerAvailable = available;
