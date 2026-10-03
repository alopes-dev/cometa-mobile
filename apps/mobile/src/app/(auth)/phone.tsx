import { useState } from 'react';
import { useRouter } from 'expo-router';
import { AuthAction, AuthHeader, AuthScreen, PhoneField } from '@/features/auth/components';
import { phone as copy } from '@/features/auth/content';
import { isValidPhone } from '@/features/auth/validation';

/** How long the mock "send the SMS" round trip takes. */
const SEND_DELAY_MS = 900;

/**
 * Phone entry — node 74:24703, with the state frames 74:24735 (typing),
 * 74:24794 (valid), 74:24827 (invalid) and 74:24862 (loading).
 *
 * Validation only bites once the number is the full nine digits: flagging a
 * number as invalid while it is still being typed would mark every number red
 * for the first eight keystrokes.
 */
export default function Phone() {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [sending, setSending] = useState(false);
  const [touched, setTouched] = useState(false);

  const complete = value.length === 9;
  const valid = isValidPhone(value);
  const invalid = touched || complete ? complete && !valid : false;

  const handleContinue = () => {
    if (!valid) {
      setTouched(true);
      return;
    }
    setSending(true);
    // Stands in for the SMS request. The delay is kept so the loading state
    // the board draws (node 74:24862) is actually reachable.
    setTimeout(() => {
      setSending(false);
      router.push({ pathname: '/(auth)/otp', params: { phoneNumber: value } });
    }, SEND_DELAY_MS);
  };

  return (
    <AuthScreen
      footer={
        <AuthAction
          label={copy.action}
          onPress={handleContinue}
          disabled={!valid}
          loading={sending}
        />
      }
    >
      <AuthHeader title={copy.title} description={copy.description} onBack={() => router.back()} />
      <PhoneField value={value} onChangeText={setValue} invalid={invalid} />
    </AuthScreen>
  );
}
