/**
 * A faithful stand-in for `expo-haptics` in tests.
 *
 * Jest's automock returns `undefined` from every function, which breaks the
 * `.catch(() => {})` that call sites use to make haptics fire-and-forget — the
 * real module returns a promise. Mocking it that way fails for a reason the
 * production code does not have, so the fakes resolve like the real thing.
 */
export const impactAsync = jest.fn(() => Promise.resolve());
export const selectionAsync = jest.fn(() => Promise.resolve());
export const notificationAsync = jest.fn(() => Promise.resolve());

export const ImpactFeedbackStyle = { Light: 'light', Medium: 'medium', Heavy: 'heavy' } as const;
export const NotificationFeedbackType = {
  Success: 'success',
  Warning: 'warning',
  Error: 'error',
} as const;
