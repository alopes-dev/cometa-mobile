import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { colors, font, layout, motion, radius } from '@/constants/theme';
import { Touchable } from './Touchable';

type Props = {
  visible: boolean;
  count: number;
  bottom: number;
  onPress?: () => void;
};

export function FloatingCartCTA({ visible, count, bottom, onPress }: Props) {
  const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const translateY = useRef(new Animated.Value(visible ? 0 : 8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        duration: motion.duration.quick,
        easing: motion.easing.emphasized,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: visible ? 0 : 8,
        duration: motion.duration.quick,
        easing: motion.easing.emphasized,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, opacity, translateY]);

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[
        styles.wrap,
        { bottom, opacity, transform: [{ translateY }] },
      ]}
    >
      <Touchable
        onPress={onPress}
        accessibilityLabel={`Check out ${count} products`}
        style={styles.button}
      >
        <Animated.Text style={styles.label}>Check out {count} products</Animated.Text>
      </Touchable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: layout.screenPadding,
    right: layout.screenPadding,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 8,
  },
  button: {
    height: layout.ctaHeight,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontFamily: font.semibold, fontSize: 16, color: colors.textOnDark },
});
