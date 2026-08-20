import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import type BottomSheetType from '@gorhom/bottom-sheet';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components/native';
import { Button, Icon, Text } from '@/components/design-system/atoms';
import { useTabBarVisibility } from '@/hooks/useTabBarVisibility';
import { getRestaurantById } from '@/features/home/data';
import { formatKwanza } from '@/features/home/format';
import { DriverCard } from '@/features/tracking/components/DriverCard';
import { CUSTOMER_COORDINATE, RESTAURANT_COORDINATE, ROUTE_COORDINATES, mockDriver } from '@/features/tracking/mockData';
import { interpolateCoordinate, isArriving, isDelivered, remainingMinutes } from '@/features/tracking/geo';
import { isMapboxAvailable, MapView, Camera, ShapeSource, LineLayer, PointAnnotation } from '@/features/tracking/mapbox';
import { isBottomSheetAvailable, BottomSheet, BottomSheetScrollView } from '@/features/tracking/bottomSheet';

const PROGRESS_TICK_MS = 400;
const PROGRESS_STEP = 1 / 30;

const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const BackButtonWrapper = styled.View<{ topInset: number }>`
  position: absolute;
  top: ${({ theme, topInset }) => theme.spacing.sm + topInset}px;
  left: ${({ theme }) => theme.spacing.md}px;
`;

const BackButton = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
  shadow-color: #000000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.15;
  shadow-radius: 3px;
  elevation: 3;
`;

const MarkerCircle = styled.View<{ variant: 'restaurant' | 'customer' | 'driver' }>`
  width: ${({ variant }) => (variant === 'driver' ? 40 : 32)}px;
  height: ${({ variant }) => (variant === 'driver' ? 40 : 32)}px;
  border-radius: ${({ variant }) => (variant === 'driver' ? 20 : 16)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, variant }) => (variant === 'restaurant' ? theme.colors.background : theme.colors.primary)};
  border-width: ${({ variant }) => (variant === 'restaurant' ? 2 : 0)}px;
  border-color: ${({ theme }) => theme.colors.primary};
  shadow-color: #000000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.2;
  shadow-radius: 3px;
  elevation: 4;
`;

const SheetContent = styled.View`
  gap: ${({ theme }) => theme.spacing.lg}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const StatusHeader = styled.View`
  gap: 2px;
`;

const Section = styled.View`
  gap: 4px;
`;

const SectionLabel = styled.Text`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
`;

const SectionDivider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.divider};
`;

const SummaryRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const SupportRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const MapFallback = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.xl}px;
  background-color: ${({ theme }) => theme.colors.surface};
`;

const StaticSheet = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 55%;
  border-top-left-radius: ${({ theme }) => theme.radius.xl}px;
  border-top-right-radius: ${({ theme }) => theme.radius.xl}px;
  background-color: ${({ theme }) => theme.colors.background};
  shadow-color: #000000;
  shadow-offset: 0px -2px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 8;
`;

const StaticSheetHandle = styled.View`
  align-self: center;
  width: 36px;
  height: 4px;
  border-radius: 2px;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: 4px;
  background-color: ${({ theme }) => theme.colors.divider};
`;

export default function LiveTracking() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { setIsTabBarHidden } = useTabBarVisibility();
  const { restaurantId, itemCount, total, deliverySummary, paymentSummary } = useLocalSearchParams<{
    restaurantId: string;
    itemCount: string;
    total: string;
    deliverySummary: string;
    paymentSummary: string;
  }>();

  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const sheetRef = useRef<BottomSheetType>(null);
  const snapPoints = useMemo(() => ['32%', '80%'], []);

  useFocusEffect(
    useCallback(() => {
      setIsTabBarHidden(true);
      return () => setIsTabBarHidden(false);
    }, [setIsTabBarHidden])
  );

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProgress((current) => {
        const next = current + PROGRESS_STEP;
        if (next >= 1) {
          clearInterval(intervalRef.current);
          return 1;
        }
        return next;
      });
    }, PROGRESS_TICK_MS);
    return () => clearInterval(intervalRef.current);
  }, []);

  const restaurant = restaurantId ? getRestaurantById(restaurantId) : undefined;
  const driverCoordinate = interpolateCoordinate(RESTAURANT_COORDINATE, CUSTOMER_COORDINATE, progress);
  const remaining = remainingMinutes(mockDriver.etaMinutes, progress);
  const arriving = isArriving(progress);
  const delivered = isDelivered(progress);
  const liveDriver = { ...mockDriver, etaMinutes: remaining };

  const statusText = delivered ? 'Pedido entregue' : arriving ? 'Seu pedido está chegando' : 'Seu pedido está a caminho';

  const routeGeoJson = {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'LineString' as const,
      coordinates: ROUTE_COORDINATES.map((coordinate) => [coordinate.longitude, coordinate.latitude]),
    },
  };

  const sheetBody = (
    <SheetContent>
      <StatusHeader>
        <Text variant="title2">{statusText}</Text>
        {!delivered ? (
          <Text variant="footnote" color="textSecondary">
            {remaining} min
          </Text>
        ) : null}
      </StatusHeader>

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
      ) : (
        <DriverCard driver={liveDriver} />
      )}

      <SectionDivider />

      <Section>
        <SectionLabel>Pedido</SectionLabel>
        <SummaryRow>
          <Text variant="body" color="textSecondary">
            {itemCount} {itemCount === '1' ? 'item' : 'itens'}
          </Text>
          <Text variant="bodyEmphasized" color="primary">
            {formatKwanza(Number(total))}
          </Text>
        </SummaryRow>
      </Section>

      {restaurant ? (
        <Section>
          <SectionLabel>Restaurante</SectionLabel>
          <Text variant="body">{restaurant.name}</Text>
        </Section>
      ) : null}

      <Section>
        <SectionLabel>Endereço</SectionLabel>
        <Text variant="body">{deliverySummary}</Text>
      </Section>

      <Section>
        <SectionLabel>Pagamento</SectionLabel>
        <Text variant="body">{paymentSummary}</Text>
      </Section>

      <Section>
        <SectionLabel>Suporte</SectionLabel>
        <SupportRow>
          <Icon name="help-circle-outline" sf="questionmark.circle" size={18} color="primary" />
          <Text variant="body" color="primary">
            Precisa de ajuda? Contacte o suporte
          </Text>
        </SupportRow>
      </Section>
    </SheetContent>
  );

  return (
    <Screen>
      {isMapboxAvailable ? (
        <MapView style={{ flex: 1 }}>
          <Camera centerCoordinate={[driverCoordinate.longitude, driverCoordinate.latitude]} zoomLevel={13.5} animationDuration={PROGRESS_TICK_MS} />

          <ShapeSource id="routeSource" shape={routeGeoJson}>
            <LineLayer id="routeLine" style={{ lineColor: theme.colors.primary, lineWidth: 4, lineCap: 'round', lineJoin: 'round' }} />
          </ShapeSource>

          <PointAnnotation id="restaurant-marker" coordinate={[RESTAURANT_COORDINATE.longitude, RESTAURANT_COORDINATE.latitude]}>
            <MarkerCircle variant="restaurant">
              <Icon name="restaurant-outline" sf="fork.knife" size={14} color="primary" />
            </MarkerCircle>
          </PointAnnotation>

          <PointAnnotation id="customer-marker" coordinate={[CUSTOMER_COORDINATE.longitude, CUSTOMER_COORDINATE.latitude]}>
            <MarkerCircle variant="customer">
              <Icon name="home" sf="house.fill" size={14} color="onPrimary" />
            </MarkerCircle>
          </PointAnnotation>

          <PointAnnotation id="driver-marker" coordinate={[driverCoordinate.longitude, driverCoordinate.latitude]}>
            <MarkerCircle variant="driver">
              <Icon name="bicycle-outline" sf="bicycle" size={18} color="onPrimary" />
            </MarkerCircle>
          </PointAnnotation>
        </MapView>
      ) : (
        <MapFallback>
          <Icon name="map-outline" sf="map" size={32} color="textSecondary" />
          <Text variant="bodyEmphasized" style={{ textAlign: 'center' }}>
            Mapa indisponível nesta build
          </Text>
          <Text variant="footnote" color="textSecondary" style={{ textAlign: 'center' }}>
            O Mapbox requer uma app compilada com o cliente de desenvolvimento (ver .env.example).
          </Text>
        </MapFallback>
      )}

      <BackButtonWrapper topInset={insets.top}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar" hitSlop={8}>
          <BackButton>
            <Icon name="chevron-back" sf="chevron.left" size={18} color="textPrimary" />
          </BackButton>
        </Pressable>
      </BackButtonWrapper>

      {isBottomSheetAvailable ? (
        <BottomSheet ref={sheetRef} index={0} snapPoints={snapPoints} enablePanDownToClose={false}>
          <BottomSheetScrollView showsVerticalScrollIndicator={false}>{sheetBody}</BottomSheetScrollView>
        </BottomSheet>
      ) : (
        <StaticSheet>
          <StaticSheetHandle />
          <ScrollView showsVerticalScrollIndicator={false}>{sheetBody}</ScrollView>
        </StaticSheet>
      )}
    </Screen>
  );
}
