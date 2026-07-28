import { useRef } from 'react';
import { Animated, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, ShoppingCart } from 'lucide-react-native';
import { colors, font, layout, motion, radius } from '@/constants/theme';
import { useCart } from '@/store/cart';
import { useAnimatedCount } from '@/hooks/useAnimatedCount';
import { StatusBarMock } from './StatusBarMock';
import { Touchable } from './Touchable';

type Props = {
  query: string;
  onChangeQuery: (v: string) => void;
  onCartPress?: () => void;
  scrollY?: Animated.Value;
};

export function HeaderDark({ query, onChangeQuery, onCartPress, scrollY }: Props) {
  const insets = useSafeAreaInsets();
  const { count } = useCart();
  const { scale } = useAnimatedCount(count);

  const focusProgress = useRef(new Animated.Value(0)).current;
  const borderColor = focusProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.surfaceDark2, colors.accentLime],
  });

  // Scroll-linked header per spec §7. useNativeDriver: false because
  // height + borderRadius are not transform props. Isolated to this header.
  const searchHeight = scrollY
    ? scrollY.interpolate({ inputRange: [40, 100], outputRange: [52, 44], extrapolate: 'clamp' })
    : 52;
  const headerBottomRadius = scrollY
    ? scrollY.interpolate({ inputRange: [40, 100], outputRange: [radius.header, 20], extrapolate: 'clamp' })
    : radius.header;

  const onFocus = () =>
    Animated.timing(focusProgress, {
      toValue: 1,
      duration: motion.duration.quick,
      easing: motion.easing.standard,
      useNativeDriver: false,
    }).start();

  const onBlur = () =>
    Animated.timing(focusProgress, {
      toValue: 0,
      duration: motion.duration.quick,
      easing: motion.easing.standard,
      useNativeDriver: false,
    }).start();

  return (
    <Animated.View
      style={[
        styles.header,
        {
          paddingTop: Math.max(insets.top, 12),
          borderBottomLeftRadius: headerBottomRadius,
          borderBottomRightRadius: headerBottomRadius,
        },
      ]}
    >
      <StatusBarMock />

      <View style={styles.brandRow}>
        <Text style={styles.brand}>Cometa</Text>

        <Touchable
          onPress={onCartPress}
          accessibilityLabel={`Cart, ${count} items`}
          style={styles.cartPill}
        >
          <ShoppingCart size={18} color={colors.textPrimary} strokeWidth={2} />
          <Animated.Text
            style={[styles.cartCount, { transform: [{ scale }] }]}
            accessibilityLiveRegion="polite"
          >
            {count}
          </Animated.Text>
        </Touchable>
      </View>

      <Animated.View style={[styles.searchWrap, { borderColor, height: searchHeight }]}>
        <Search size={20} color={colors.textOnDarkMuted} strokeWidth={2} />
        <TextInput
          value={query}
          onChangeText={onChangeQuery}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="Search for something tasty..."
          placeholderTextColor={colors.textOnDarkMuted}
          style={styles.searchInput}
          returnKeyType="search"
          accessibilityLabel="Search products"
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surfaceDark,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 40, // includes 20px behind the sheet
  },
  brandRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: { fontFamily: font.bold, fontSize: 24, color: colors.textOnDark },
  cartPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 40,
    paddingHorizontal: 14,
    borderRadius: radius.cartButton,
    backgroundColor: colors.accentLime,
  },
  cartCount: { fontFamily: font.bold, fontSize: 14, color: colors.textPrimary },
  searchWrap: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 52,
    paddingHorizontal: 14,
    borderRadius: radius.search,
    backgroundColor: colors.surfaceDark2,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontFamily: font.regular,
    fontSize: 15,
    color: colors.textOnDark,
    padding: 0,
  },
});
