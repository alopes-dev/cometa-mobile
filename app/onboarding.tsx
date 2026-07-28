import { Text, View } from 'react-native';
import { colors, font } from '@/constants/theme';

export default function Onboarding() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceLight }}>
      <Text style={{ fontFamily: font.semibold, color: colors.textPrimary }}>Onboarding (placeholder)</Text>
    </View>
  );
}
