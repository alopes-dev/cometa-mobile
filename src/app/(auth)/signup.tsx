import { useRouter } from 'expo-router';
import { Button } from '@/design-system/atoms';
import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function Signup() {
  const router = useRouter();

  return (
    <PlaceholderScreen label="Sign Up">
      <Button variant="text" onPress={() => router.push('/login')}>
        Already have an account? Log in
      </Button>
    </PlaceholderScreen>
  );
}
