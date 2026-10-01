import type BottomSheetType from '@gorhom/bottom-sheet';
import type { BottomSheetScrollView as BottomSheetScrollViewType } from '@gorhom/bottom-sheet';

type RequiredBottomSheetModule = {
  default: typeof BottomSheetType;
  BottomSheetScrollView: typeof BottomSheetScrollViewType;
};

// @gorhom/bottom-sheet relies on react-native-gesture-handler's native module
// under the hood — same unlinked-native-module situation as Mapbox
// (src/features/tracking/mapbox.ts) and GestureHandlerRootView
// (src/components/SafeGestureHandlerRootView.tsx). Guarding the require here
// lets the Live Tracking screen fall back to a plain, non-draggable panel
// instead of crashing when the dev client hasn't been rebuilt yet.
let mod: RequiredBottomSheetModule | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  mod = require('@gorhom/bottom-sheet');
} catch {
  mod = null;
}

export const isBottomSheetAvailable = mod !== null;
export const BottomSheet = mod?.default as typeof BottomSheetType;
export const BottomSheetScrollView = mod?.BottomSheetScrollView as typeof BottomSheetScrollViewType;
