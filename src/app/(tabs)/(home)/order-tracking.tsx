import { Fragment, useCallback } from 'react';
import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Text, Icon, type IconProps } from '@/components/design-system/atoms';
import { useTabBarVisibility } from '@/hooks/useTabBarVisibility';
import { getRestaurantById } from '@/features/home/data';
import { formatKwanza } from '@/features/home/format';

type Stage = {
  key: string;
  label: string;
  icon: { name: IconProps['name']; sf?: IconProps['sf'] };
};

const STAGES: Stage[] = [
  { key: 'confirmed', label: 'Confirmado', icon: { name: 'checkmark-circle', sf: 'checkmark.circle.fill' } },
  { key: 'preparing', label: 'Em preparação', icon: { name: 'restaurant-outline', sf: 'fork.knife' } },
  { key: 'on-the-way', label: 'A caminho', icon: { name: 'bicycle-outline', sf: 'bicycle' } },
  { key: 'delivered', label: 'Entregue', icon: { name: 'home-outline', sf: 'house' } },
];

const ACTIVE_STAGE_INDEX = 1;

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
  const { restaurantId, itemCount, total } = useLocalSearchParams<{
    restaurantId: string;
    itemCount: string;
    total: string;
  }>();

  useFocusEffect(
    useCallback(() => {
      setIsTabBarHidden(true);
      return () => setIsTabBarHidden(false);
    }, [setIsTabBarHidden])
  );

  const restaurant = restaurantId ? getRestaurantById(restaurantId) : undefined;

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
          {STAGES.map((stage, index) => {
            const done = index <= ACTIVE_STAGE_INDEX;
            const isLast = index === STAGES.length - 1;
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
                  {isLast ? null : <StageConnector done={index < ACTIVE_STAGE_INDEX} />}
                </StageIconColumn>
                <StageInfo>
                  <Text
                    variant="bodyEmphasized"
                    color={index === ACTIVE_STAGE_INDEX ? 'primary' : done ? 'textPrimary' : 'textSecondary'}
                  >
                    {stage.label}
                  </Text>
                </StageInfo>
              </StageRow>
            );
          })}
        </View>

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
    </Screen>
  );
}
