import { useCallback } from 'react';
import { FlatList, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Icon, Text } from '@/components/design-system/atoms';
import { OfferCard } from '@/features/home/components/OfferCard';
import { useTabBarVisibility } from '@/hooks/useTabBarVisibility';
import { getOffers } from '@/features/home/data';
import type { Offer } from '@/features/home/types';

const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.View<{ topInset: number }>`
  padding-top: ${({ theme, topInset }) => theme.spacing.md + topInset}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme }) => theme.spacing.sm}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const BackButton = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.surface};
`;

export default function Offers() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setIsTabBarHidden } = useTabBarVisibility();
  const offers = getOffers();

  useFocusEffect(
    useCallback(() => {
      setIsTabBarHidden(true);
      return () => setIsTabBarHidden(false);
    }, [setIsTabBarHidden])
  );

  return (
    <Screen>
      <FlatList
        data={offers}
        keyExtractor={(item: Offer) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, gap: 16 }}
        ListHeaderComponent={
          <Header topInset={insets.top}>
            <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar" hitSlop={8}>
              <BackButton>
                <Icon name="chevron-back" sf="chevron.left" size={18} color="textPrimary" />
              </BackButton>
            </Pressable>
            <Text variant="headline">Ofertas Especiais</Text>
          </Header>
        }
        renderItem={({ item }) => <OfferCard offer={item} fullWidth />}
      />
    </Screen>
  );
}
