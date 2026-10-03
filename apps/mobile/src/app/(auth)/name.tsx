import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from 'styled-components/native';
import { AuthAction, AuthHeader, AuthScreen } from '@/features/auth/components';
import {
  Block,
  Field,
  Input,
  Label,
} from '@/features/auth/components/PhoneField/PhoneField.styles';
import { newAccount as copy } from '@/features/auth/content';
import { useAuth } from '@/hooks/useAuth';

const CREATE_DELAY_MS = 900;

/**
 * Name entry — node 74:25416, with the creating state 74:25444.
 *
 * Only reached when the verified number had no account, so it is the last step
 * before a session exists. Opening that session unmounts this stack: the root
 * navigator swaps `(auth)` for `(setup)` the moment `isAuthenticated` flips,
 * which is why nothing is pushed here afterwards.
 */
export default function NewAccountName() {
  const router = useRouter();
  const theme = useTheme();
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
  const { signIn } = useAuth();

  const [name, setName] = useState('');
  const [focused, setFocused] = useState(false);
  const [creating, setCreating] = useState(false);

  const trimmed = name.trim();
  const valid = trimmed.length > 1;

  const handleCreate = () => {
    setCreating(true);
    setTimeout(() => signIn({ phoneNumber: phoneNumber ?? '', name: trimmed }), CREATE_DELAY_MS);
  };

  return (
    <AuthScreen
      footer={
        <AuthAction
          label={copy.action}
          onPress={handleCreate}
          disabled={!valid}
          loading={creating}
        />
      }
    >
      <AuthHeader title={copy.title} description={copy.description} onBack={() => router.back()} />
      <Block>
        <Label>{copy.label}</Label>
        <Field focused={focused} invalid={false}>
          <Input
            value={name}
            onChangeText={setName}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={copy.placeholder}
            placeholderTextColor={theme.auth.color.textMuted}
            autoCapitalize="words"
            textContentType="name"
            autoComplete="name"
            accessibilityLabel={copy.label}
            returnKeyType="done"
            onSubmitEditing={() => valid && handleCreate()}
            editable={!creating}
          />
        </Field>
      </Block>
    </AuthScreen>
  );
}
