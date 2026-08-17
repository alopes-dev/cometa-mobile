import type {
  MapView as MapViewType,
  Camera as CameraType,
  ShapeSource as ShapeSourceType,
  LineLayer as LineLayerType,
  PointAnnotation as PointAnnotationType,
} from '@rnmapbox/maps';

type RequiredMapboxModule = {
  default: { setAccessToken: (token: string) => void };
  MapView: typeof MapViewType;
  Camera: typeof CameraType;
  ShapeSource: typeof ShapeSourceType;
  LineLayer: typeof LineLayerType;
  PointAnnotation: typeof PointAnnotationType;
};

// @rnmapbox/maps throws synchronously at require-time when its native module
// isn't linked yet (Expo Go, or a dev client built before this was added) —
// this is the standard "rebuild your app" error from their docs. Guarding the
// require lets every environment render a fallback instead of hard-crashing.
let mapboxModule: RequiredMapboxModule | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  mapboxModule = require('@rnmapbox/maps');
  const token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;
  if (mapboxModule && token) {
    mapboxModule.default.setAccessToken(token);
  }
} catch {
  mapboxModule = null;
}

export const isMapboxAvailable = mapboxModule !== null;
export const MapView = mapboxModule?.MapView as typeof MapViewType;
export const Camera = mapboxModule?.Camera as typeof CameraType;
export const ShapeSource = mapboxModule?.ShapeSource as typeof ShapeSourceType;
export const LineLayer = mapboxModule?.LineLayer as typeof LineLayerType;
export const PointAnnotation = mapboxModule?.PointAnnotation as typeof PointAnnotationType;
