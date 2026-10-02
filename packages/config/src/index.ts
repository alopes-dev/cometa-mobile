/**
 * Configuration shared across workspaces.
 *
 * Reserved, intentionally empty. Client-safe values (EXPO_PUBLIC_*) and server
 * values must stay in separate entry points when this is filled in. Never
 * export DATABASE_URL, JWT secrets, or any API secret from this package — it
 * is reachable from the mobile bundle.
 */
export const PACKAGE_NAME = '@kometa/config';
