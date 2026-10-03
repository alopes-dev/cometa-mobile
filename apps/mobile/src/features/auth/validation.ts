/**
 * Phone and one-time-code rules for the sign-in flow.
 *
 * Pure functions, deliberately: the screens that use them are hard to assert
 * against, but "is this a valid Angolan number" and "how does a pasted code
 * land in six cells" are exactly the parts worth testing, so they live apart
 * from the rendering.
 */

/** Angolan mobile numbers are nine digits and always start with a 9. */
const NATIONAL_LENGTH = 9;
const MOBILE_PREFIX = '9';

/** Every non-digit is noise: spaces, the dial code, dashes a keyboard inserts. */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Narrows typed input to what a national number can contain.
 *
 * Strips a leading `244` (or `+244`) so pasting a full international number
 * does not push the national part past the length limit, then caps the rest.
 */
export function normalizePhoneInput(value: string): string {
  let digits = digitsOnly(value);
  if (digits.startsWith('244')) digits = digits.slice(3);
  return digits.slice(0, NATIONAL_LENGTH);
}

export function isValidPhone(value: string): boolean {
  const digits = normalizePhoneInput(value);
  return digits.length === NATIONAL_LENGTH && digits.startsWith(MOBILE_PREFIX);
}

/**
 * Groups a national number 3-3-3, the way the board writes it — "923 456 789"
 * (node 74:24725). Partial input is grouped as far as it goes, so the spacing
 * appears while typing rather than snapping in at the ninth digit.
 */
export function formatNationalPhone(value: string): string {
  const digits = normalizePhoneInput(value);
  return digits.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
}

/** The full number as the OTP screen quotes it back — "+244 923 456 789". */
export function formatInternationalPhone(value: string, dialCode: string): string {
  const national = formatNationalPhone(value);
  return national ? `${dialCode} ${national}` : dialCode;
}

export const OTP_LENGTH = 6;

/**
 * Lands typed or pasted input in the code cells.
 *
 * Takes digits only and caps at the cell count, which is what makes "paste the
 * whole code" and "type one digit" the same operation — the board draws both
 * (frames 74:25258 and 74:24940) and they differ only in how many digits
 * arrive at once.
 */
export function normalizeOtpInput(value: string): string {
  return digitsOnly(value).slice(0, OTP_LENGTH);
}

export function isCompleteOtp(value: string): boolean {
  return normalizeOtpInput(value).length === OTP_LENGTH;
}

/**
 * Which cell the caret belongs in — the first empty one, or the last once the
 * code is full. Drives the focused cell's 2px green border (node 74:24956).
 */
export function focusedOtpIndex(value: string): number {
  return Math.min(normalizeOtpInput(value).length, OTP_LENGTH - 1);
}

/** Formats the resend countdown as the board writes it — "00:30". */
export function formatCountdown(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
