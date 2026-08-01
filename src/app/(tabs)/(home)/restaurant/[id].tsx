import { useMemo } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { SectionList } from 'react-native';
import { Image } from 'expo-image';
import styled from 'styled-components/native';
import { Text, Icon } from '@/components/design-system/atoms';
import { MenuItemRow } from '@/features/home/components/MenuItemRow';
import { getMenuItems, getRestaurantById } from '@/features/home/data';
import type { MenuItem } from '@/features/home/types';

const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const HeaderInfo = styled.View`
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding: ${({ theme }) => theme.spacing.md}px;
`;

const MetaRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const RatingRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const SectionHeader = styled.View`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const NotFoundScreen = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

type MenuSection = {
  title: string;
  data: MenuItem[];
};

export default function RestaurantDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const restaurant = useMemo(() => getRestaurantById(id), [id]);
  const menuItems = useMemo(() => getMenuItems(id), [id]);

  const sections = useMemo<MenuSection[]>(() => {
    const byCategory = new Map<string, MenuItem[]>();
    for (const item of menuItems) {
      const existing = byCategory.get(item.category) ?? [];
      existing.push(item);
      byCategory.set(item.category, existing);
    }
    return Array.from(byCategory.entries()).map(([title, data]) => ({ title, data }));
  }, [menuItems]);

  if (!restaurant) {
    return (
      <NotFoundScreen>
        <Text color="textSecondary">Restaurante não encontrado</Text>
      </NotFoundScreen>
    );
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: restaurant.name }} />
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <Image
              source={{ uri: restaurant.imageUrl }}
              style={{ width: '100%', height: 180 }}
              contentFit="cover"
            />
            <HeaderInfo>
              <Text variant="title1">{restaurant.name}</Text>
              <MetaRow>
                <RatingRow>
                  <Icon name="star" sf="star.fill" size={14} color="warning" />
                  <Text variant="footnote" color="textSecondary">
                    {restaurant.rating.toFixed(1)}
                  </Text>
                </RatingRow>
                <Text variant="footnote" color="textSecondary">
                  {restaurant.cuisine}
                </Text>
                <Text variant="footnote" color="textSecondary">
                  {restaurant.deliveryTimeMinutes} min · {restaurant.deliveryFee} Kz
                </Text>
              </MetaRow>
            </HeaderInfo>
          </>
        }
        renderItem={({ item }) => <MenuItemRow item={item} />}
        renderSectionHeader={({ section }) => (
          <SectionHeader>
            <Text variant="title2">{section.title}</Text>
          </SectionHeader>
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
      />
    </Screen>
  );
}
