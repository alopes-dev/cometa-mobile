import { useCallback } from 'react';
import { Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Button, Icon, Text } from '@/components/design-system/atoms';
import { useTabBarVisibility } from '@/hooks/useTabBarVisibility';
import { useCart } from '@/hooks/useCart';
import { useCheckoutFlow } from '@/hooks/useCheckoutFlow';
import type { DeliveryType } from '@/hooks/CheckoutFlowProvider';
import { getRestaurantById } from '@/features/home/data';
import { formatDeliveryFee } from '@/features/home/format';
import { OptionCard } from '@/features/checkout/components/OptionCard';

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

const Content = styled.View`
  flex: 1;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const BottomBar = styled.View<{ bottomInset: number }>`
  padding: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme, bottomInset }) => bottomInset + theme.spacing.md}px;
`;

export default function DeliveryTypeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setIsTabBarHidden } = useTabBarVisibility();
  const { restaurantId } = useCart();
  const { deliveryType, setDeliveryType } = useCheckoutFlow();

  useFocusEffect(
    useCallback(() => {
      setIsTabBarHidden(true);
      return () => setIsTabBarHidden(false);
    }, [setIsTabBarHidden])
  );

  const restaurant = restaurantId ? getRestaurantById(restaurantId) : undefined;

  const handleSelect = (type: DeliveryType) => setDeliveryType(type);

  return (
    <Screen>
      <Header topInset={insets.top}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar" hitSlop={8}>
          <BackButton>
            <Icon name="chevron-back" sf="chevron.left" size={18} color="textPrimary" />
          </BackButton>
        </Pressable>
        <Text variant="headline">Entrega ou Retirada</Text>
      </Header>
      <Content>
        <OptionCard
          icon={{ name: 'bicycle-outline', sf: 'bicycle' }}
          title="Entrega"
          subtitle={
            restaurant ? `Entregar no meu endereço · ${formatDeliveryFee(restaurant.deliveryFee)}` : 'Entregar no meu endereço'
          }
          selected={deliveryType === 'delivery'}
          onPress={() => handleSelect('delivery')}
        />
        <OptionCard
          icon={{ name: 'storefront-outline', sf: 'storefront' }}
          title="Pickup"
          subtitle={restaurant ? `Retirar em ${restaurant.name}` : 'Vou buscar no restaurante'}
          selected={deliveryType === 'pickup'}
          onPress={() => handleSelect('pickup')}
        />
      </Content>
      <BottomBar bottomInset={insets.bottom}>
        <Button
          variant="primary"
          size="lg"
          shape="pill"
          disabled={!deliveryType}
          onPress={() => router.push('/schedule')}
        >
          Continuar
        </Button>
      </BottomBar>
    </Screen>
  );
}
