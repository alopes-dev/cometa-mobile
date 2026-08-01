import { useCallback, useMemo, useRef, useState } from 'react';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { scrollTo, useAnimatedRef, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Text } from '@/components/design-system/atoms';
import { useTabBarVisibility } from '@/hooks/useTabBarVisibility';
import { CartSummaryBar } from '@/features/home/components/CartSummaryBar';
import { MenuGridCard } from '@/features/home/components/MenuGridCard';
import { MenuItemRow } from '@/features/home/components/MenuItemRow';
import { MenuTabs } from '@/features/home/components/MenuTabs';
import { HEADER_COMPACT_HEIGHT, HERO_MAX_HEIGHT, RestaurantHero } from '@/features/home/components/RestaurantHero';
import { getMenuItems, getRestaurantById } from '@/features/home/data';
import { restaurantDetailPalette as palette } from '@/features/home/restaurantDetailPalette';
import { buildMenuSections, POPULAR_SECTION_KEY } from '@/features/home/selectors';

const Screen = styled.View`
  flex: 1;
  background-color: ${palette.background};
`;

const TabsWrapper = styled.View`
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
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
  background-color: ${palette.background};
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
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

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

  const handleAdd = (itemId: string) => {
    setQuantities((current) => ({ ...current, [itemId]: (current[itemId] ?? 0) + 1 }));
  };

  const cartCount = Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0);
  const cartTotal = menuItems.reduce((sum, item) => sum + (quantities[item.id] ?? 0) * item.price, 0);

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
        <TabsWrapper>
          <MenuTabs tabs={tabs} selectedKey={selectedTab} onSelect={handleSelectTab} />
        </TabsWrapper>
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
                    {section.data.map((item) => (
                      <MenuGridCard key={item.id} item={item} onAdd={allowAdd ? () => handleAdd(item.id) : undefined} />
                    ))}
                  </GridWrap>
                ) : (
                  section.data.map((item) => (
                    <MenuItemRow key={item.id} item={item} onAdd={allowAdd ? () => handleAdd(item.id) : undefined} />
                  ))
                )}
              </SectionBody>
            </SectionWrapper>
          );
        })}
      </Animated.ScrollView>
      <RestaurantHero restaurant={restaurant} topInset={insets.top} scrollY={scrollY} onBack={() => router.back()} />
      <CartBarWrapper bottomInset={insets.bottom}>
        <CartSummaryBar count={cartCount} total={cartTotal} />
      </CartBarWrapper>
    </Screen>
  );
}
