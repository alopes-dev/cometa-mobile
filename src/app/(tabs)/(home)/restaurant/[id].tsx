import { useMemo, useRef, useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { SectionList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Text } from '@/components/design-system/atoms';
import { CartSummaryBar } from '@/features/home/components/CartSummaryBar';
import { MenuItemRow } from '@/features/home/components/MenuItemRow';
import { MenuTabs } from '@/features/home/components/MenuTabs';
import { RestaurantHero } from '@/features/home/components/RestaurantHero';
import { getMenuItems, getRestaurantById } from '@/features/home/data';
import { buildMenuSections, POPULAR_SECTION_KEY, type MenuDetailSection } from '@/features/home/selectors';
import type { MenuItem } from '@/features/home/types';

const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const TabsWrapper = styled.View`
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
`;

const SectionHeader = styled.View`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background};
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
  const listRef = useRef<SectionList<MenuItem, MenuDetailSection>>(null);
  const [selectedTab, setSelectedTab] = useState<string>(POPULAR_SECTION_KEY);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const restaurant = useMemo(() => getRestaurantById(id), [id]);
  const menuItems = useMemo(() => getMenuItems(id), [id]);
  const sections = useMemo(() => buildMenuSections(menuItems), [menuItems]);
  const tabs = useMemo(() => sections.map(({ key, title, icon }) => ({ key, title, icon })), [sections]);

  const handleSelectTab = (key: string) => {
    setSelectedTab(key);
    const sectionIndex = sections.findIndex((section) => section.key === key);
    if (sectionIndex >= 0) {
      listRef.current?.scrollToLocation({ sectionIndex, itemIndex: 0, animated: true });
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
      <SectionList
        ref={listRef}
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <>
            <RestaurantHero restaurant={restaurant} topInset={insets.top} onBack={() => router.back()} />
            <TabsWrapper>
              <MenuTabs tabs={tabs} selectedKey={selectedTab} onSelect={handleSelectTab} />
            </TabsWrapper>
          </>
        }
        renderItem={({ item, section }) => (
          <MenuItemRow
            item={item}
            onAdd={section.key === POPULAR_SECTION_KEY ? undefined : () => handleAdd(item.id)}
          />
        )}
        renderSectionHeader={({ section }) => (
          <SectionHeader>
            <Text variant="title2">{section.icon ? `${section.icon} ${section.title}` : section.title}</Text>
          </SectionHeader>
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 96 }}
      />
      <CartBarWrapper bottomInset={insets.bottom}>
        <CartSummaryBar count={cartCount} total={cartTotal} />
      </CartBarWrapper>
    </Screen>
  );
}
