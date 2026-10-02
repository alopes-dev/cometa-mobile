/**
 * Shared contracts between apps/mobile and apps/api.
 *
 * Reserved, intentionally empty: there is no API yet, so nothing here has a
 * second consumer. Domain types currently live with their feature in
 * apps/mobile/src/features/<feature>/types.ts and should only move here once
 * both sides genuinely need the same shape. Never export Prisma types or
 * persistence details from this package.
 */
export const PACKAGE_NAME = '@kometa/types';
