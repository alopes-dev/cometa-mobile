import { ARRIVING_THRESHOLD, interpolateCoordinate, isArriving, isDelivered, remainingMinutes } from './geo';

const from = { latitude: 0, longitude: 0 };
const to = { latitude: 10, longitude: 20 };

describe('interpolateCoordinate', () => {
  it('returns the start coordinate at progress 0', () => {
    expect(interpolateCoordinate(from, to, 0)).toEqual({ latitude: 0, longitude: 0 });
  });

  it('returns the end coordinate at progress 1', () => {
    expect(interpolateCoordinate(from, to, 1)).toEqual({ latitude: 10, longitude: 20 });
  });

  it('returns the midpoint at progress 0.5', () => {
    expect(interpolateCoordinate(from, to, 0.5)).toEqual({ latitude: 5, longitude: 10 });
  });

  it('clamps progress above 1', () => {
    expect(interpolateCoordinate(from, to, 1.5)).toEqual({ latitude: 10, longitude: 20 });
  });

  it('clamps progress below 0', () => {
    expect(interpolateCoordinate(from, to, -0.5)).toEqual({ latitude: 0, longitude: 0 });
  });
});

describe('remainingMinutes', () => {
  it('returns the full ETA at progress 0', () => {
    expect(remainingMinutes(8, 0)).toBe(8);
  });

  it('returns 0 at progress 1', () => {
    expect(remainingMinutes(8, 1)).toBe(0);
  });

  it('rounds to the nearest minute midway', () => {
    expect(remainingMinutes(9, 0.5)).toBe(5);
  });
});

describe('isArriving / isDelivered', () => {
  it('is not arriving before the threshold', () => {
    expect(isArriving(ARRIVING_THRESHOLD - 0.01)).toBe(false);
  });

  it('is arriving at and after the threshold, until fully delivered', () => {
    expect(isArriving(ARRIVING_THRESHOLD)).toBe(true);
    expect(isArriving(0.99)).toBe(true);
  });

  it('is delivered only at progress 1', () => {
    expect(isDelivered(0.99)).toBe(false);
    expect(isDelivered(1)).toBe(true);
    expect(isArriving(1)).toBe(false);
  });
});
