import type * as LocationModule from 'expo-location';
import type * as NotificationsModule from 'expo-notifications';
import type { PermissionOutcome } from './types';

/**
 * Guarded access to the two permission APIs the setup flow asks for.
 *
 * `expo-location` and `expo-notifications` both resolve their native module at
 * require time and throw synchronously when it is missing — the "Cannot find
 * native module 'ExpoLocation'" error you get in a dev client built before the
 * dependency was added. Expo Router loads *every* route module up front to
 * validate the route tree, so an unguarded import inside a route does not fail
 * that screen: it takes down the whole app at startup, before anything renders.
 *
 * Same guard the rest of this codebase already uses for native modules that can
 * lag the JS bundle — see `features/tracking/mapbox.ts` and
 * `features/tracking/bottomSheet.ts`.
 */

let locationModule: typeof LocationModule | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  locationModule = require('expo-location');
} catch {
  locationModule = null;
}

let notificationsModule: typeof NotificationsModule | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  notificationsModule = require('expo-notifications');
} catch {
  notificationsModule = null;
}

export const isLocationAvailable = locationModule !== null;
export const isNotificationsAvailable = notificationsModule !== null;

function warnMissing(module: string) {
  if (__DEV__) {
    console.warn(
      `[onboarding] ${module} is not in this build, so the permission could not be requested. ` +
        'Rebuild the dev client (npx expo prebuild && npx expo run:ios) to enable it.'
    );
  }
}

/**
 * Asks for foreground location.
 *
 * Returns `unavailable` rather than `denied` when the module is missing: the
 * user was never shown a dialog, so recording a refusal they did not make would
 * permanently mark a choice that was never offered.
 */
export async function requestLocation(): Promise<PermissionOutcome> {
  if (!locationModule) {
    warnMissing('expo-location');
    return 'unavailable';
  }
  try {
    const { granted } = await locationModule.requestForegroundPermissionsAsync();
    return granted ? 'granted' : 'denied';
  } catch {
    // A dialog that cannot be raised must not strand the user mid-setup.
    return 'denied';
  }
}

/** Asks for notifications. Same contract as `requestLocation`. */
export async function requestNotifications(): Promise<PermissionOutcome> {
  if (!notificationsModule) {
    warnMissing('expo-notifications');
    return 'unavailable';
  }
  try {
    const { granted } = await notificationsModule.requestPermissionsAsync({
      ios: { allowAlert: true, allowBadge: true, allowSound: true },
    });
    return granted ? 'granted' : 'denied';
  } catch {
    return 'denied';
  }
}
