import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Button, Text, Icon } from '@/components/design-system/atoms';
import { useTabBarVisibility } from '@/hooks/useTabBarVisibility';
import { getRestaurantById } from '@/features/home/data';
import { formatKwanza } from '@/features/home/format';
import { DriverCard } from '@/features/tracking/components/DriverCard';
import { DRIVER_ASSIGNED_STAGE_INDEX, STAGE_INTERVAL_MS, TRACKING_STAGES, mockDriver } from '@/features/tracking/mockData';

const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const Header = styled.View<{ topInset: number }>`
  padding-top: ${({ theme, topInset }) => theme.spacing[16] + topInset}px;
  padding-horizontal: ${({ theme }) => theme.spacing[16]}px;
  padding-bottom: ${({ theme }) => theme.spacing[8]}px;
  gap: ${({ theme }) => theme.spacing[8]}px;
`;

const BackButton = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.surface.primary};
`;

const Content = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing[16]}px;
  gap: ${({ theme }) => theme.spacing[24]}px;
  padding-bottom: ${({ theme }) => theme.spacing[32]}px;
`;

const RestaurantRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[16]}px;
`;

const RestaurantImage = styled(Image)`
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.radius.md}px;
`;

const EtaRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.surface.primary};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.spacing[16]}px;
`;

const StageRow = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing[16]}px;
`;

const StageIconColumn = styled.View`
  align-items: center;
`;

const StageIconCircle = styled.View<{ done: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, done }) => (done ? theme.colors.brand.base : theme.colors.background.primary)};
`;

const StageConnector = styled.View<{ done: boolean }>`
  width: 2px;
  flex: 1;
  min-height: 24px;
  background-color: ${({ theme, done }) => (done ? theme.colors.brand.base : theme.colors.border.subtle)};
`;

const StageInfo = styled.View`
  flex: 1;
  padding-bottom: ${({ theme }) => theme.spacing[24]}px;
  justify-content: center;
`;

const SummaryRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export default function OrderTracking() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setIsTabBarHidden } = useTabBarVisibility();
  const { restaurantId, itemCount, total, deliverySummary, paymentSummary } = useLocalSearchParams<{
    restaurantId: string;
    itemCount: string;
    total: string;
    deliverySummary: string;
    paymentSummary: string;
  }>();
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useFocusEffect(
    useCallback(() => {
      setIsTabBarHidden(true);
      return () => setIsTabBarHidden(false);
    }, [setIsTabBarHidden])
  );

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((current) => {
        const next = current + 1;
        if (next >= TRACKING_STAGES.length - 1) {
          clearInterval(intervalRef.current);
          return TRACKING_STAGES.length - 1;
        }
        return next;
      });
    }, STAGE_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, []);

  const restaurant = restaurantId ? getRestaurantById(restaurantId) : undefined;
  const delivered = activeIndex === TRACKING_STAGES.length - 1;
  const showDriver = activeIndex >= DRIVER_ASSIGNED_STAGE_INDEX && !delivered;

  return (
    <Screen>
      <Header topInset={insets.top}>
        <Pressable
          onPress={() => router.replace('/')}
          accessibilityRole="button"
          accessibilityLabel="Voltar ao início"
          hitSlop={8}
        >
          <BackButton>
            <Icon name="chevron-back" sf="chevron.left" size={18} color="primary" />
          </BackButton>
        </Pressable>
        <Text variant="bodyStrong">Acompanhar Pedido</Text>
      </Header>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Content>
          {restaurant ? (
            <RestaurantRow>
              <RestaurantImage source={restaurant.imageUrl} contentFit="cover" />
              <View style={{ flex: 1, gap: 4 }}>
                <Text variant="bodyStrong" numberOfLines={1}>
                  {restaurant.name}
                </Text>
                <EtaRow>
                  <Icon name="time-outline" sf="clock" size={14} color="secondary" />
                  <Text variant="caption" color="secondary">
                    Chegada estimada: {restaurant.deliveryTimeMinutes} min
                  </Text>
                </EtaRow>
              </View>
            </RestaurantRow>
          ) : null}

          <View>
            {TRACKING_STAGES.map((stage, index) => {
              const done = index <= activeIndex;
              const isLast = index === TRACKING_STAGES.length - 1;
              return (
                <StageRow key={stage.key}>
                  <StageIconColumn>
                    <StageIconCircle done={done}>
                      <Icon
                        name={stage.icon.name}
                        sf={stage.icon.sf}
                        size={16}
                        color={done ? 'onBrand' : 'secondary'}
                      />
                    </StageIconCircle>
                    {isLast ? null : <StageConnector done={index < activeIndex} />}
                  </StageIconColumn>
                  <StageInfo>
                    <Text
                      variant="bodyStrong"
                      color={index === activeIndex ? 'brand' : done ? 'primary' : 'secondary'}
                    >
                      {stage.label}
                    </Text>
                  </StageInfo>
                </StageRow>
              );
            })}
          </View>

          {showDriver ? (
            <View style={{ gap: 12 }}>
              <DriverCard driver={mockDriver} />
              <Button
                variant="outline"
                size="lg"
                shape="pill"
                icon={<Icon name="map-outline" sf="map" size={18} color="brand" />}
                onPress={() =>
                  router.push({
                    pathname: '/live-tracking',
                    params: { restaurantId: restaurantId ?? '', itemCount, total, deliverySummary, paymentSummary },
                  })
                }
              >
                Ver no mapa
              </Button>
            </View>
          ) : null}

          {delivered ? (
            <Button
              variant="primary"
              size="lg"
              shape="pill"
              onPress={() =>
                router.push({
                  pathname: '/delivered',
                  params: { restaurantId: restaurantId ?? '', itemCount, total },
                })
              }
            >
              Ver Resumo do Pedido
            </Button>
          ) : null}

          <Card>
            <SummaryRow>
              <Text variant="body" color="secondary">
                {itemCount} {itemCount === '1' ? 'item' : 'itens'}
              </Text>
              <Text variant="bodyStrong" color="brand">
                {formatKwanza(Number(total))}
              </Text>
            </SummaryRow>
          </Card>
        </Content>
      </ScrollView>
    </Screen>
  );
}
