import { Text, View } from 'react-native';
import { colors, font } from '@/constants/theme';

export default function Home() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceLight }}>
      <Text style={{ fontFamily: font.semibold, color: colors.textPrimary }}>Home (placeholder)</Text>
    </View>
  );
}
