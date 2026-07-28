import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors, font, motion, radius } from '@/constants/theme';
import type { Category } from '@/data/catalog';
import { Touchable } from './Touchable';

type Props = { category: Category; isActive: boolean; onPress: () => void };

export function CategoryChip({ category, isActive, onPress }: Props) {
  const progress = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: isActive ? 1 : 0,
      duration: motion.duration.quick,
      easing: motion.easing.standard,
      useNativeDriver: false,
    }).start();
  }, [isActive, progress]);

  const bg = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.surfaceLight, colors.surfaceDark],
  });
  const textColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.textPrimary, colors.textOnDark],
  });
  const inactiveOpacity = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const activeOpacity = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  const { Icon } = category;

  return (
    <Touchable
      onPress={onPress}
      accessibilityLabel={`${category.label} category`}
      accessibilityRole="button"
    >
      <Animated.View style={[styles.chip, { backgroundColor: bg }]}>
        <View style={styles.iconWrap}>
          <Animated.View style={[StyleSheet.absoluteFill, styles.iconSlot, { opacity: inactiveOpacity }]}>
            <Icon size={20} color={category.color} strokeWidth={2} />
          </Animated.View>
          <Animated.View style={[StyleSheet.absoluteFill, styles.iconSlot, { opacity: activeOpacity }]}>
            <Icon size={20} color={colors.textOnDark} strokeWidth={2} />
          </Animated.View>
        </View>
        <Animated.Text style={[styles.label, { color: textColor }]}>{category.label}</Animated.Text>
      </Animated.View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconWrap: { width: 20, height: 20 },
  iconSlot: { alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: font.medium, fontSize: 15 },
});
