import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AuthAction, AuthHeader, AuthScreen, OtpInput } from '@/features/auth/components';
import {
  Hint,
  ResendArea,
  ResendLabel,
} from '@/features/auth/components/OtpInput/OtpInput.styles';
import { country, otp as copy } from '@/features/auth/content';
import {
  formatCountdown,
  formatInternationalPhone,
  isCompleteOtp,
} from '@/features/auth/validation';
import { useAuth } from '@/hooks/useAuth';

/** The board's countdown starts at 30 seconds — node 74:24969. */
const RESEND_SECONDS = 30;
const VERIFY_DELAY_MS = 800;
const MAX_ATTEMPTS = 3;

/**
 * Any code but this one is treated as wrong, so the error states the board
 * draws are reachable without a backend. The number is arbitrary; what matters
 * is that a wrong code has somewhere to land.
 */
const ACCEPTED_CODE = '482913';

/**
 * Numbers already registered. A number not in this list is new, and is sent on
 * to name entry rather than straight into the app — frames 74:25312 (existing)
 * versus 74:25416 (new).
 */
const REGISTERED_NUMBERS = new Set(['923456789']);

type Status = 'idle' | 'verifying' | 'incorrect' | 'locked';

/**
 * Code entry — node 74:24940, with the state frames 74:25006 (verifying),
 * 74:25091 (incorrect), 74:25177 (resend available) and 74:25216 (too many
 * attempts).
 *
 * Verification fires on the sixth digit rather than waiting for a button: the
 * board gives this screen no CTA in its resting state, because autofill and
 * paste both complete the code without the customer touching anything.
 */
export default function Otp() {
  const router = useRouter();
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
  const { signIn } = useAuth();

  const [code, setCode] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [attempts, setAttempts] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const verifyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const tick = setTimeout(() => setSecondsLeft((current) => current - 1), 1000);
    return () => clearTimeout(tick);
  }, [secondsLeft]);

  useEffect(() => () => {
    if (verifyTimer.current) clearTimeout(verifyTimer.current);
  }, []);

  const verify = useCallback(
    (entered: string) => {
      setStatus('verifying');
      verifyTimer.current = setTimeout(() => {
        if (entered === ACCEPTED_CODE) {
          if (REGISTERED_NUMBERS.has(phoneNumber ?? '')) {
            // The number already has an account, so there is no name to ask
            // for — open the session and let the root navigator take over.
            signIn({ phoneNumber: phoneNumber ?? '' });
            return;
          }
          router.push({ pathname: '/(auth)/name', params: { phoneNumber: phoneNumber ?? '' } });
          return;
        }

        const used = attempts + 1;
        setAttempts(used);
        setStatus(used >= MAX_ATTEMPTS ? 'locked' : 'incorrect');
        setCode('');
      }, VERIFY_DELAY_MS);
    },
    [attempts, phoneNumber, router, signIn]
  );

  const handleChange = (next: string) => {
    if (status === 'locked' || status === 'verifying') return;
    setCode(next);
    // Clearing the error as soon as the customer types again keeps the red
    // border from outliving the mistake it refers to.
    if (status === 'incorrect') setStatus('idle');
    if (isCompleteOtp(next)) verify(next);
  };

  const handleResend = () => {
    setSecondsLeft(RESEND_SECONDS);
    setAttempts(0);
    setCode('');
    setStatus('idle');
  };

  const canResend = secondsLeft <= 0;
  const message =
    status === 'locked'
      ? copy.tooManyAttempts
      : status === 'incorrect'
        ? copy.incorrect
        : copy.hint;

  return (
    <AuthScreen
      footer={
        status === 'locked' ? (
          <AuthAction label={copy.resendAvailable} onPress={handleResend} disabled={!canResend} />
        ) : null
      }
    >
      <AuthHeader
        title={copy.title}
        description={copy.description(formatInternationalPhone(phoneNumber ?? '', country.dialCode))}
        onBack={() => router.back()}
      />
      <OtpInput
        value={code}
        onChangeText={handleChange}
        invalid={status === 'incorrect' || status === 'locked'}
        editable={status !== 'verifying' && status !== 'locked'}
        autoFocus
      />
      <ResendArea>
        {canResend ? (
          <Pressable onPress={handleResend} accessibilityRole="button" hitSlop={8}>
            <ResendLabel actionable>{copy.resendAvailable}</ResendLabel>
          </Pressable>
        ) : (
          <ResendLabel>{copy.resendIn(formatCountdown(secondsLeft))}</ResendLabel>
        )}
      </ResendArea>
      <Hint invalid={status === 'incorrect' || status === 'locked'}>
        {status === 'verifying' ? copy.verifying : message}
      </Hint>
    </AuthScreen>
  );
}
