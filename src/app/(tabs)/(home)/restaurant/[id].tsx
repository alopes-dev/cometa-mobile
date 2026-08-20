import { useCallback, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import Animated, {
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Text } from '@/components/design-system/atoms';
import { useTabBarVisibility } from '@/hooks/useTabBarVisibility';
import { useCart } from '@/hooks/useCart';
import { useMeasureOnTap, type ScreenOrigin } from '@/hooks/useMeasureOnTap';
import { CartSummaryBar } from '@/features/home/components/CartSummaryBar';
import { FlyToCartGhost } from '@/features/home/components/FlyToCartGhost';
import { MenuGridCard } from '@/features/home/components/MenuGridCard';
import { MenuItemRow } from '@/features/home/components/MenuItemRow';
import { MenuTabs } from '@/features/home/components/MenuTabs';
import {
  COLLAPSE_RANGE,
  HEADER_COMPACT_HEIGHT,
  HERO_MAX_HEIGHT,
  RestaurantHero,
} from '@/features/home/components/RestaurantHero';
import { getMenuItems, getRestaurantById } from '@/features/home/data';
import { buildMenuSections, POPULAR_SECTION_KEY } from '@/features/home/selectors';
import type { MenuItem } from '@/features/home/types';

const GHOST_SIZE = 40;

type Flight = {
  id: number;
  imageUrl: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
};

const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const TabsWrapper = styled.View`
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const SectionWrapper = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SectionHeader = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const SectionBody = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const GridWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const CartBarWrapper = styled.View<{ bottomInset: number }>`
  position: absolute;
  left: ${({ theme }) => theme.spacing.md}px;
  right: ${({ theme }) => theme.spacing.md}px;
  bottom: ${({ theme, bottomInset }) => bottomInset + theme.spacing.sm}px;
`;

const NotFoundScreen = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

export default function RestaurantDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setIsTabBarHidden } = useTabBarVisibility();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(0);
  const sectionOffsets = useRef<Record<string, number>>({});
  const [selectedTab, setSelectedTab] = useState<string>(POPULAR_SECTION_KEY);
  const { count: cartCount, subtotal: cartSubtotal, addItem } = useCart();
  const { ref: cartBarRef, measure: measureCartBar } = useMeasureOnTap();
  const [flights, setFlights] = useState<Flight[]>([]);
  const flightId = useRef(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // Counter-translate the tabs bar by however far scroll has gone past the
  // hero's collapse point, so it visually pins in place instead of scrolling
  // away with the rest of the content (§13's "sticky category navigation").
  const stickyTabsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: Math.max(0, scrollY.value - COLLAPSE_RANGE) }],
  }));

  useFocusEffect(
    useCallback(() => {
      setIsTabBarHidden(true);
      return () => setIsTabBarHidden(false);
    }, [setIsTabBarHidden])
  );

  const restaurant = useMemo(() => getRestaurantById(id), [id]);
  const menuItems = useMemo(() => getMenuItems(id), [id]);
  const sections = useMemo(() => buildMenuSections(menuItems), [menuItems]);
  const tabs = useMemo(() => sections.map(({ key, title, icon }) => ({ key, title, icon })), [sections]);

  const handleSelectTab = (key: string) => {
    setSelectedTab(key);
    const y = sectionOffsets.current[key];
    if (y !== undefined) {
      const target = Math.max(0, y - (HEADER_COMPACT_HEIGHT + insets.top));
      scrollTo(scrollRef, 0, target, true);
    }
  };

  const openProduct = (itemId: string) => {
    router.push({ pathname: '/product/[itemId]', params: { itemId } });
  };

  const removeFlight = (flightId: number) => {
    setFlights((current) => current.filter((flight) => flight.id !== flightId));
  };

  const handleQuickAdd = async (item: MenuItem, origin: ScreenOrigin) => {
    addItem(item);
    const target = await measureCartBar();
    // Either measurement failing (origin/target width 0) means we can't place
    // the ghost meaningfully — the item is still added, just without the flourish.
    if (origin.width === 0 || target.width === 0) return;
    const from = { x: origin.x + origin.width / 2 - GHOST_SIZE / 2, y: origin.y + origin.height / 2 - GHOST_SIZE / 2 };
    const to = { x: target.x + target.width / 2 - GHOST_SIZE / 2, y: target.y + target.height / 2 - GHOST_SIZE / 2 };
    const id = flightId.current++;
    setFlights((current) => [...current, { id, imageUrl: item.imageUrl, from, to }]);
  };

  if (!restaurant) {
    return (
      <NotFoundScreen>
        <Text color="textSecondary">Restaurante não encontrado</Text>
      </NotFoundScreen>
    );
  }

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />
      <Animated.ScrollView
        ref={scrollRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: HERO_MAX_HEIGHT + insets.top, paddingBottom: 96 }}
      >
        <Animated.View style={[{ zIndex: 10 }, stickyTabsStyle]}>
          <TabsWrapper>
            <MenuTabs tabs={tabs} selectedKey={selectedTab} onSelect={handleSelectTab} />
          </TabsWrapper>
        </Animated.View>
        {sections.map((section) => {
          const allowAdd = section.key !== POPULAR_SECTION_KEY;
          return (
            <SectionWrapper
              key={section.key}
              onLayout={(event) => {
                sectionOffsets.current[section.key] = event.nativeEvent.layout.y;
              }}
            >
              <SectionHeader>
                <Text variant="title2">{section.icon ? `${section.icon} ${section.title}` : section.title}</Text>
              </SectionHeader>
              <SectionBody>
                {section.layout === 'grid' ? (
                  <GridWrap>
                    {section.data.map((item) => {
                      const hasModifiers = Boolean(item.modifierGroups?.length);
                      return (
                        <MenuGridCard
                          key={item.id}
                          item={item}
                          onAdd={allowAdd && !hasModifiers ? (origin) => handleQuickAdd(item, origin) : undefined}
                          onPress={allowAdd && hasModifiers ? () => openProduct(item.id) : undefined}
                        />
                      );
                    })}
                  </GridWrap>
                ) : (
                  section.data.map((item) => {
                    const hasModifiers = Boolean(item.modifierGroups?.length);
                    return (
                      <MenuItemRow
                        key={item.id}
                        item={item}
                        onAdd={allowAdd && !hasModifiers ? (origin) => handleQuickAdd(item, origin) : undefined}
                        onPress={allowAdd && hasModifiers ? () => openProduct(item.id) : undefined}
                      />
                    );
                  })
                )}
              </SectionBody>
            </SectionWrapper>
          );
        })}
      </Animated.ScrollView>
      <RestaurantHero restaurant={restaurant} topInset={insets.top} scrollY={scrollY} onBack={() => router.back()} />
      <CartBarWrapper bottomInset={insets.bottom}>
        <View ref={cartBarRef}>
          <CartSummaryBar count={cartCount} total={cartSubtotal} onPress={() => router.push('/cart')} />
        </View>
      </CartBarWrapper>
      {flights.map((flight) => (
        <FlyToCartGhost
          key={flight.id}
          imageUrl={flight.imageUrl}
          from={flight.from}
          to={flight.to}
          onComplete={() => removeFlight(flight.id)}
        />
      ))}
    </Screen>
  );
}
