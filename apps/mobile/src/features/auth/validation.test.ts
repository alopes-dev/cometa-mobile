import {
  OTP_LENGTH,
  focusedOtpIndex,
  formatCountdown,
  formatInternationalPhone,
  formatNationalPhone,
  isCompleteOtp,
  isValidPhone,
  normalizeOtpInput,
  normalizePhoneInput,
} from './validation';

describe('normalizePhoneInput', () => {
  it('keeps only digits', () => {
    expect(normalizePhoneInput('923 456 789')).toBe('923456789');
    expect(normalizePhoneInput('923-456-789')).toBe('923456789');
  });

  it('drops a pasted country code so it does not eat the length budget', () => {
    expect(normalizePhoneInput('+244 923 456 789')).toBe('923456789');
    expect(normalizePhoneInput('244923456789')).toBe('923456789');
  });

  it('caps input at the nine digits a national number has', () => {
    expect(normalizePhoneInput('9234567891111')).toBe('923456789');
  });
});

describe('isValidPhone', () => {
  it('accepts a nine-digit number starting with 9', () => {
    expect(isValidPhone('923456789')).toBe(true);
    expect(isValidPhone('+244 923 456 789')).toBe(true);
  });

  it('rejects a number that is too short', () => {
    expect(isValidPhone('92345678')).toBe(false);
  });

  it('rejects a number that does not start with 9', () => {
    expect(isValidPhone('823456789')).toBe(false);
  });

  it('rejects empty input', () => {
    expect(isValidPhone('')).toBe(false);
  });
});

describe('formatNationalPhone', () => {
  it('groups a full number the way the board writes it', () => {
    expect(formatNationalPhone('923456789')).toBe('923 456 789');
  });

  it('groups partial input as far as it goes, so spacing appears while typing', () => {
    expect(formatNationalPhone('9')).toBe('9');
    expect(formatNationalPhone('9234')).toBe('923 4');
    expect(formatNationalPhone('923456')).toBe('923 456');
  });

  it('leaves no trailing space at a group boundary', () => {
    expect(formatNationalPhone('923')).toBe('923');
  });
});

describe('formatInternationalPhone', () => {
  it('quotes the number back with its dial code', () => {
    expect(formatInternationalPhone('923456789', '+244')).toBe('+244 923 456 789');
  });

  it('shows the dial code alone when nothing has been typed', () => {
    expect(formatInternationalPhone('', '+244')).toBe('+244');
  });
});

describe('normalizeOtpInput', () => {
  it('takes digits only', () => {
    expect(normalizeOtpInput('1a2b3c')).toBe('123');
  });

  it('caps a paste at the number of cells', () => {
    expect(normalizeOtpInput('1234567890')).toBe('123456');
  });

  it('treats a full paste and single keystrokes identically', () => {
    expect(normalizeOtpInput('482913')).toBe('482913');
    expect(isCompleteOtp('482913')).toBe(true);
  });
});

describe('focusedOtpIndex', () => {
  it('points at the first empty cell', () => {
    expect(focusedOtpIndex('')).toBe(0);
    expect(focusedOtpIndex('48')).toBe(2);
  });

  it('stays on the last cell once the code is full, rather than running off the end', () => {
    expect(focusedOtpIndex('482913')).toBe(OTP_LENGTH - 1);
  });
});

describe('formatCountdown', () => {
  it('formats as mm:ss', () => {
    expect(formatCountdown(30)).toBe('00:30');
    expect(formatCountdown(5)).toBe('00:05');
    expect(formatCountdown(75)).toBe('01:15');
  });

  it('floors at zero rather than showing a negative clock', () => {
    expect(formatCountdown(-3)).toBe('00:00');
  });
});
