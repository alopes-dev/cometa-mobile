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

const RestaurantRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
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
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.spacing.md}px;
`;

const StageRow = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.md}px;
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
  background-color: ${({ theme, done }) => (done ? theme.colors.primary : theme.colors.background)};
`;

const StageConnector = styled.View<{ done: boolean }>`
  width: 2px;
  flex: 1;
  min-height: 24px;
  background-color: ${({ theme, done }) => (done ? theme.colors.primary : theme.colors.divider)};
`;

const StageInfo = styled.View`
  flex: 1;
  padding-bottom: ${({ theme }) => theme.spacing.lg}px;
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
  const showDriver = activeIndex >= DRIVER_ASSIGNED_STAGE_INDEX;

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
            <Icon name="chevron-back" sf="chevron.left" size={18} color="textPrimary" />
          </BackButton>
        </Pressable>
        <Text variant="headline">Acompanhar Pedido</Text>
      </Header>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Content>
          {restaurant ? (
            <RestaurantRow>
              <RestaurantImage source={{ uri: restaurant.imageUrl }} contentFit="cover" />
              <View style={{ flex: 1, gap: 4 }}>
                <Text variant="bodyEmphasized" numberOfLines={1}>
                  {restaurant.name}
                </Text>
                <EtaRow>
                  <Icon name="time-outline" sf="clock" size={14} color="textSecondary" />
                  <Text variant="footnote" color="textSecondary">
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
                        color={done ? 'onPrimary' : 'textSecondary'}
                      />
                    </StageIconCircle>
                    {isLast ? null : <StageConnector done={index < activeIndex} />}
                  </StageIconColumn>
                  <StageInfo>
                    <Text
                      variant="bodyEmphasized"
                      color={index === activeIndex ? 'primary' : done ? 'textPrimary' : 'textSecondary'}
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
                icon={<Icon name="map-outline" sf="map" size={18} color="primary" />}
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

          <Card>
            <SummaryRow>
              <Text variant="body" color="textSecondary">
                {itemCount} {itemCount === '1' ? 'item' : 'itens'}
              </Text>
              <Text variant="bodyEmphasized" color="primary">
                {formatKwanza(Number(total))}
              </Text>
            </SummaryRow>
          </Card>
        </Content>
      </ScrollView>
    </Screen>
  );
}
