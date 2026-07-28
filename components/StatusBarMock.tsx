import { StyleSheet, Text, View } from 'react-native';
import { BatteryFull, Signal, Wifi } from 'lucide-react-native';
import { colors, font } from '@/constants/theme';

export function StatusBarMock() {
  return (
    <View style={styles.row}>
      <Text style={styles.time}>9:41</Text>
      <View style={styles.icons}>
        <Signal size={16} color={colors.textOnDark} strokeWidth={2} />
        <Wifi size={16} color={colors.textOnDark} strokeWidth={2} />
        <BatteryFull size={20} color={colors.textOnDark} strokeWidth={2} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 24,
  },
  time: { fontFamily: font.semibold, fontSize: 15, color: colors.textOnDark },
  icons: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
