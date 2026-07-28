import { Animated, StyleSheet, Text, View } from 'react-native';
import { useFadeIn } from '@/hooks/useFadeIn';
import { colors, font, layout } from '@/constants/theme';

export function PlaceholderScreen({ title }: { title: string }) {
  const { opacity, translateY } = useFadeIn();
  return (
    <View style={styles.wrap}>
      <Animated.View style={{ opacity, transform: [{ translateY }] }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Coming soon</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingBottom: layout.scrollBottomPadding,
  },
  title: { fontFamily: font.bold, fontSize: 24, color: colors.textPrimary, textAlign: 'center' },
  subtitle: {
    fontFamily: font.regular,
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});
