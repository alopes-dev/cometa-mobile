/** The address collected by step 2 — node 44:22454. */
export type DeliveryAddress = {
  street: string;
  number: string;
  district: string;
  city: string;
  complement: string;
  reference: string;
};

export const emptyAddress: DeliveryAddress = {
  street: '',
  number: '',
  district: '',
  city: '',
  complement: '',
  reference: '',
};

/**
 * Whether the user was asked for a permission and what they answered.
 *
 * `skipped` is a real answer, not a missing one: the board's own rule — "'Agora
 * não' permanece visível e legítimo" — means declining has to be recorded and
 * respected rather than re-asked on the next launch.
 *
 * `unavailable` is the one outcome that is *not* an answer: the native module
 * was absent so no dialog was ever shown. Kept distinct from `denied` so a
 * later build can still ask, rather than inheriting a refusal the user never
 * made. See `features/onboarding/permissions.ts`.
 */
export type PermissionOutcome = 'granted' | 'denied' | 'skipped' | 'unavailable';

/** What the post-authentication setup collects, persisted between launches. */
export type SetupState = {
  address: DeliveryAddress | null;
  categories: readonly string[];
  location: PermissionOutcome | null;
  notifications: PermissionOutcome | null;
};

export const emptySetupState: SetupState = {
  address: null,
  categories: [],
  location: null,
  notifications: null,
};
