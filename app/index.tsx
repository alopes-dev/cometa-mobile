import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

const KEY = 'cometa:hasOnboarded';

export default function Index() {
  const [target, setTarget] = useState<'/onboarding' | '/(tabs)' | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((v) => setTarget(v === 'true' ? '/(tabs)' : '/onboarding'))
      .catch(() => setTarget('/onboarding'));
  }, []);

  if (target === null) return null;
  return <Redirect href={target} />;
}
