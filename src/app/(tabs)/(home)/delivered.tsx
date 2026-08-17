import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import styled from 'styled-components/native';
import { Button, Icon, Text } from '@/components/design-system/atoms';
import { useTabBarVisibility } from '@/hooks/useTabBarVisibility';
import { getRestaurantById } from '@/features/home/data';
import { formatKwanza } from '@/features/home/format';

const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const IconCircle = styled.View`
  width: 72px;
  height: 72px;
  border-radius: 36px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primary};
`;

const TextGroup = styled.View`
  gap: 2px;
  align-items: center;
`;

const Card = styled.View`
  width: 100%;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg}px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const RestaurantRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const RestaurantImage = styled(Image)`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.md}px;
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.divider};
`;

const ButtonGroup = styled.View`
  width: 100%;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export default function Delivered() {
  const router = useRouter();
  const { setIsTabBarHidden } = useTabBarVisibility();
  const { restaurantId, itemCount, total } = useLocalSearchParams<{
    restaurantId: string;
    itemCount: string;
    total: string;
  }>();
  const [deliveredAt] = useState(() => new Date());

  useFocusEffect(
    useCallback(() => {
      setIsTabBarHidden(true);
      return () => setIsTabBarHidden(false);
    }, [setIsTabBarHidden])
  );

  const restaurant = restaurantId ? getRestaurantById(restaurantId) : undefined;

  return (
    <Screen>
      <IconCircle>
        <Icon name="checkmark" sf="checkmark" size={36} color="onPrimary" />
      </IconCircle>
      <TextGroup>
        <Text variant="title1">Pedido entregue</Text>
        <Text variant="body" color="textSecondary">
          Entregue às {formatTime(deliveredAt)}
        </Text>
      </TextGroup>

      <Card>
        {restaurant ? (
          <>
            <RestaurantRow>
              <RestaurantImage source={{ uri: restaurant.imageUrl }} contentFit="cover" />
              <Text variant="bodyEmphasized" numberOfLines={1}>
                {restaurant.name}
              </Text>
            </RestaurantRow>
            <Divider />
          </>
        ) : null}
        <Row>
          <Text variant="body" color="textSecondary">
            {itemCount} {itemCount === '1' ? 'item' : 'itens'}
          </Text>
          <Text variant="bodyEmphasized" color="primary">
            {formatKwanza(Number(total))}
          </Text>
        </Row>
      </Card>

      <ButtonGroup>
        <Button
          variant="primary"
          size="lg"
          shape="pill"
          onPress={() => router.push({ pathname: '/rating', params: { restaurantId: restaurantId ?? '' } })}
        >
          Avaliar Pedido
        </Button>
        <Button variant="text" size="lg" onPress={() => router.replace('/')}>
          Voltar ao Início
        </Button>
      </ButtonGroup>
    </Screen>
  );
}
