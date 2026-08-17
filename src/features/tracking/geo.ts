import type { Coordinate } from './types';

export function interpolateCoordinate(from: Coordinate, to: Coordinate, progress: number): Coordinate {
  const clamped = Math.min(1, Math.max(0, progress));
  return {
    latitude: from.latitude + (to.latitude - from.latitude) * clamped,
    longitude: from.longitude + (to.longitude - from.longitude) * clamped,
  };
}

export function remainingMinutes(totalMinutes: number, progress: number): number {
  const clamped = Math.min(1, Math.max(0, progress));
  return Math.max(0, Math.round(totalMinutes * (1 - clamped)));
}

export const ARRIVING_THRESHOLD = 0.85;

export function isArriving(progress: number): boolean {
  return progress >= ARRIVING_THRESHOLD && progress < 1;
}

export function isDelivered(progress: number): boolean {
  return progress >= 1;
}
