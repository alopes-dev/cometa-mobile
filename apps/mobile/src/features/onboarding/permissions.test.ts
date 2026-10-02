/**
 * These cover the failure that actually happened: a dev client built before
 * `expo-location` was added throws at require time, and because Expo Router
 * loads every route module to validate the route tree, an unguarded import
 * crashed the whole app at startup rather than just that screen.
 *
 * Each case re-requires the module under a fresh registry, because the guard
 * runs once at import and caches its result.
 */

describe('onboarding permissions', () => {
  let warn: jest.SpyInstance;

  beforeEach(() => {
    jest.resetModules();
    warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warn.mockRestore();
    jest.resetModules();
  });

  describe('location', () => {
    it('degrades instead of throwing when the native module is missing', async () => {
      jest.doMock('expo-location', () => {
        throw new Error("Cannot find native module 'ExpoLocation'");
      });

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { isLocationAvailable, requestLocation } = require('./permissions');

      expect(isLocationAvailable).toBe(false);
      await expect(requestLocation()).resolves.toBe('unavailable');
    });

    it('reports a grant', async () => {
      jest.doMock('expo-location', () => ({
        requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
      }));

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { isLocationAvailable, requestLocation } = require('./permissions');

      expect(isLocationAvailable).toBe(true);
      await expect(requestLocation()).resolves.toBe('granted');
    });

    it('reports a refusal', async () => {
      jest.doMock('expo-location', () => ({
        requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ granted: false }),
      }));

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { requestLocation } = require('./permissions');

      await expect(requestLocation()).resolves.toBe('denied');
    });

    it('treats a dialog that cannot be raised as a refusal, not a crash', async () => {
      jest.doMock('expo-location', () => ({
        requestForegroundPermissionsAsync: jest.fn().mockRejectedValue(new Error('no dialog')),
      }));

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { requestLocation } = require('./permissions');

      await expect(requestLocation()).resolves.toBe('denied');
    });
  });

  describe('notifications', () => {
    it('degrades instead of throwing when the native module is missing', async () => {
      jest.doMock('expo-notifications', () => {
        throw new Error("Cannot find native module 'ExpoNotifications'");
      });

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { isNotificationsAvailable, requestNotifications } = require('./permissions');

      expect(isNotificationsAvailable).toBe(false);
      await expect(requestNotifications()).resolves.toBe('unavailable');
    });

    it('reports a grant', async () => {
      jest.doMock('expo-notifications', () => ({
        requestPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
      }));

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { requestNotifications } = require('./permissions');

      await expect(requestNotifications()).resolves.toBe('granted');
    });

    it('reports a refusal', async () => {
      jest.doMock('expo-notifications', () => ({
        requestPermissionsAsync: jest.fn().mockResolvedValue({ granted: false }),
      }));

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { requestNotifications } = require('./permissions');

      await expect(requestNotifications()).resolves.toBe('denied');
    });
  });

  it('never reports unavailable as a refusal, so a later build can still ask', async () => {
    jest.doMock('expo-location', () => {
      throw new Error("Cannot find native module 'ExpoLocation'");
    });

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { requestLocation } = require('./permissions');

    await expect(requestLocation()).resolves.not.toBe('denied');
  });
});
