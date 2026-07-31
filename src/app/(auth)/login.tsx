import { Button } from '@/components/design-system/atoms';
import { PlaceholderScreen } from '@/components/PlaceholderScreen';
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const { signIn } = useAuth();

  return (
    <PlaceholderScreen label="Login">
      <Button onPress={signIn}>Log In</Button>
    </PlaceholderScreen>
  );
}
