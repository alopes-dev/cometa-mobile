import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius } from '@/constants/theme';

export function HomeIndicator() {
  const insets = useSafeAreaInsets();
  if (insets.bottom > 0) return null;
  return (
    <View style={styles.wrapper} pointerEvents="none">
      <View style={styles.bar} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 8,
    alignItems: 'center',
  },
  bar: {
    width: 134,
    height: 5,
    backgroundColor: colors.textPrimary,
    borderRadius: radius.pill,
  },
});
