import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Text, Icon } from '@/components/design-system/atoms';
import { useTabBarVisibility } from '@/hooks/useTabBarVisibility';
import { useCart } from '@/hooks/useCart';
import { useCheckoutFlow } from '@/hooks/useCheckoutFlow';
import { getRestaurantById } from '@/features/home/data';
import { DetailsRow } from '@/features/checkout/components/DetailsRow';
import { OrderSummaryCard } from '@/features/checkout/components/OrderSummaryCard';
import { PlaceOrderBar } from '@/features/checkout/components/PlaceOrderBar';
import { OrderConfirmation } from '@/features/checkout/components/OrderConfirmation';
import { mockAddresses, mockPaymentMethod } from '@/features/checkout/mockData';
import { computeOrderSummary } from '@/features/checkout/pricing';

const PLACING_DELAY = 1200;

type CheckoutStatus = 'idle' | 'placing' | 'success';

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
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.lg}px;
  padding-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const SectionRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const SectionLabel = styled.Text`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
`;

const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const CardDivider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.divider};
`;

const BottomBar = styled.View<{ bottomInset: number }>`
  position: absolute;
  left: ${({ theme }) => theme.spacing.md}px;
  right: ${({ theme }) => theme.spacing.md}px;
  bottom: ${({ theme, bottomInset }) => bottomInset + theme.spacing.sm}px;
`;

const EmptyState = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md}px;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

export default function Checkout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setIsTabBarHidden } = useTabBarVisibility();
  const { items, restaurantId, subtotal, clearCart } = useCart();
  const { deliveryType, schedule, addressId, tipPercent, couponCode, discountPercent, reset: resetCheckoutFlow } =
    useCheckoutFlow();
  const [status, setStatus] = useState<CheckoutStatus>('idle');
  const placingTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useFocusEffect(
    useCallback(() => {
      setIsTabBarHidden(true);
      return () => setIsTabBarHidden(false);
    }, [setIsTabBarHidden])
  );

  useEffect(() => () => clearTimeout(placingTimeout.current), []);

  const handlePlaceOrder = () => {
    setStatus('placing');
    placingTimeout.current = setTimeout(() => setStatus('success'), PLACING_DELAY);
  };

  const restaurant = restaurantId ? getRestaurantById(restaurantId) : undefined;
  const summary = computeOrderSummary(subtotal, restaurant?.deliveryFee ?? 0, discountPercent, tipPercent);
  const selectedAddress = mockAddresses.find((address) => address.id === addressId);

  const handleDone = () => {
    clearCart();
    resetCheckoutFlow();
    router.replace('/');
  };

  const handleTrack = () => {
    const trackedRestaurantId = restaurantId;
    const itemCount = items.length;
    const { total } = summary;
    clearCart();
    resetCheckoutFlow();
    router.push({
      pathname: '/order-tracking',
      params: { restaurantId: trackedRestaurantId ?? '', itemCount: String(itemCount), total: String(total) },
    });
  };

  if (status === 'success') {
    return (
      <Screen>
        <OrderConfirmation
          restaurantName={restaurant?.name ?? ''}
          total={summary.total}
          onDone={handleDone}
          onTrack={handleTrack}
        />
      </Screen>
    );
  }

  if (items.length === 0) {
    return (
      <Screen>
        <EmptyState>
          <Text variant="title2">O seu carrinho está vazio</Text>
          <Pressable onPress={() => router.back()} accessibilityRole="button">
            <Text color="primary">Voltar</Text>
          </Pressable>
        </EmptyState>
      </Screen>
    );
  }

  const deliveryTitle = deliveryType === 'pickup' ? 'Retirada no restaurante' : selectedAddress?.label ?? 'Entrega';
  const deliverySubtitle =
    deliveryType === 'pickup'
      ? restaurant?.name ?? 'Selecione o restaurante'
      : selectedAddress?.details ?? 'Escolha um endereço de entrega';

  const scheduleTitle = !schedule ? 'Agora' : schedule.type === 'now' ? 'Agora' : schedule.label;

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 96 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <Header topInset={insets.top}>
          <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar" hitSlop={8}>
            <BackButton>
              <Icon name="chevron-back" sf="chevron.left" size={18} color="textPrimary" />
            </BackButton>
          </Pressable>
          <Text variant="headline">Checkout</Text>
        </Header>
        <Content>
          <View>
            <SectionRow>
              <SectionLabel>Entrega</SectionLabel>
            </SectionRow>
            <Card>
              <DetailsRow
                icon={{
                  name: deliveryType === 'pickup' ? 'storefront-outline' : 'location-outline',
                  sf: deliveryType === 'pickup' ? 'storefront' : 'location',
                }}
                title={deliveryTitle}
                subtitle={deliverySubtitle}
                trailing="chevron"
                onPress={() => router.push(deliveryType === 'pickup' ? '/delivery-type' : '/address')}
              />
              <CardDivider />
              <DetailsRow
                icon={{ name: 'time-outline', sf: 'clock' }}
                title={scheduleTitle}
                subtitle="Quando"
                trailing="chevron"
                onPress={() => router.push('/schedule')}
              />
            </Card>
          </View>

          <View>
            <SectionRow>
              <SectionLabel>Pagamento</SectionLabel>
            </SectionRow>
            <Card>
              <DetailsRow
                icon={{ name: 'card-outline', sf: 'creditcard' }}
                title={`${mockPaymentMethod.brand} ····${mockPaymentMethod.last4}`}
                subtitle={`EXPIRES ${mockPaymentMethod.expiry}`}
                trailing="Edit"
              />
            </Card>
          </View>

          {tipPercent > 0 || couponCode ? (
            <View>
              <SectionRow>
                <SectionLabel>Gorjeta e Cupão</SectionLabel>
              </SectionRow>
              <Card>
                {tipPercent > 0 ? (
                  <DetailsRow
                    icon={{ name: 'heart-outline', sf: 'heart' }}
                    title={`Gorjeta ${tipPercent}%`}
                    subtitle="Para o entregador"
                    trailing="chevron"
                    onPress={() => router.push('/cart')}
                  />
                ) : null}
                {tipPercent > 0 && couponCode ? <CardDivider /> : null}
                {couponCode ? (
                  <DetailsRow
                    icon={{ name: 'pricetag-outline', sf: 'tag' }}
                    title={couponCode}
                    subtitle={`${discountPercent}% de desconto`}
                    trailing="chevron"
                    onPress={() => router.push('/cart')}
                  />
                ) : null}
              </Card>
            </View>
          ) : null}

          <View>
            <SectionRow>
              <SectionLabel>Resumo</SectionLabel>
            </SectionRow>
            <OrderSummaryCard summary={summary} />
          </View>
        </Content>
      </ScrollView>
      <BottomBar bottomInset={insets.bottom}>
        <PlaceOrderBar total={summary.total} isLoading={status === 'placing'} onPress={handlePlaceOrder} />
      </BottomBar>
    </Screen>
  );
}
