import { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { House, MapPin, ShoppingCart, Tag, User, type LucideIcon } from 'lucide-react-native';
import { colors, font, layout, motion, navShadow, radius } from '@/constants/theme';
import { useCart } from '@/store/cart';
import { Touchable } from './Touchable';

const ROUTE_ICONS: Record<string, LucideIcon> = {
  index: House,
  offers: Tag,
  orders: MapPin,
  cart: ShoppingCart,
  profile: User,
};

export default function BottomNav({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const { count } = useCart();

  const pillWidth = screenWidth - 2 * layout.navSideMargin;
  const slot = (pillWidth - 2 * layout.navInnerPadding) / state.routes.length;
  const circleTarget = (index: number) =>
    layout.navInnerPadding + index * slot + (slot - layout.navActiveCircle) / 2;

  const circleX = useRef(new Animated.Value(circleTarget(state.index))).current;

  useEffect(() => {
    Animated.spring(circleX, {
      toValue: circleTarget(state.index),
      useNativeDriver: true,
      tension: motion.easing.spring.tension,
      friction: motion.easing.spring.friction,
    }).start();
  }, [state.index, circleX, screenWidth]);

  return (
    <View
      style={[
        styles.wrap,
        {
          bottom: insets.bottom + layout.navBottomOffset,
          left: layout.navSideMargin,
          right: layout.navSideMargin,
        },
        Platform.OS === 'ios' ? navShadow.ios : navShadow.android,
      ]}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.circle,
          {
            width: layout.navActiveCircle,
            height: layout.navActiveCircle,
            top: (layout.navHeight - layout.navActiveCircle) / 2,
            transform: [{ translateX: circleX }],
          },
        ]}
      />
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const Icon = ROUTE_ICONS[route.name] ?? House;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (navigation as any).navigate(route.name, route.params);
            }
          };

          return (
            <Touchable
              key={route.key}
              onPress={onPress}
              accessibilityLabel={`${route.name} tab`}
              accessibilityRole="tab"
              style={[styles.slot, { width: slot }]}
            >
              <NavIcon Icon={Icon} focused={isFocused} showBadge={route.name === 'cart'} badgeCount={count} />
            </Touchable>
          );
        })}
      </View>
    </View>
  );
}

function NavIcon({
  Icon,
  focused,
  showBadge,
  badgeCount,
}: {
  Icon: LucideIcon;
  focused: boolean;
  showBadge: boolean;
  badgeCount: number;
}) {
  const scale = useRef(new Animated.Value(focused ? 1 : 0.9)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1 : 0.9,
      useNativeDriver: true,
      tension: motion.easing.spring.tension,
      friction: motion.easing.spring.friction,
    }).start();
  }, [focused, scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Icon
        size={layout.navIconSize}
        color={focused ? colors.textPrimary : colors.textOnDark}
        strokeWidth={layout.navIconStroke}
      />
      {showBadge && badgeCount > 0 ? (
        <View style={styles.badge}>
          <Animated.Text style={styles.badgeText}>{badgeCount}</Animated.Text>
        </View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    height: layout.navHeight,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceDark,
    overflow: 'visible',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.navInnerPadding,
    height: layout.navHeight,
  },
  slot: { alignItems: 'center', justifyContent: 'center', height: layout.navHeight },
  circle: {
    position: 'absolute',
    left: 0,
    backgroundColor: colors.accentLime,
    borderRadius: radius.pill,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.accentLime,
    borderWidth: 2,
    borderColor: colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontFamily: font.bold, fontSize: 10, color: colors.textPrimary },
});
