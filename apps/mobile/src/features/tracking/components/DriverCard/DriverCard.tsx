import { Linking, Pressable } from 'react-native';
import { Text, Icon } from '@/components/design-system/atoms';
import type { Driver } from '../../types';
import { Container, HeaderRow, Photo, Info, RatingRow, ActionsRow, ActionButton } from './DriverCard.styles';

export type DriverCardProps = {
  driver: Driver;
};

export function DriverCard({ driver }: DriverCardProps) {
  const handleCall = () => {
    Linking.openURL(`tel:${driver.phone}`).catch(() => {});
  };

  return (
    <Container>
      <HeaderRow>
        <Photo source={{ uri: driver.photoUrl }} contentFit="cover" />
        <Info>
          <Text variant="title">{driver.name}</Text>
          <RatingRow>
            <Icon name="star" sf="star.fill" size={12} color="warning" />
            <Text variant="caption" color="secondary">
              {driver.rating.toFixed(1)}
            </Text>
          </RatingRow>
          <Text variant="caption" color="secondary">
            {driver.vehicle} · {driver.plate}
          </Text>
        </Info>
      </HeaderRow>
      <Text variant="caption" color="brand">
        Chega em aproximadamente {driver.etaMinutes} min
      </Text>
      <ActionsRow>
        <Pressable onPress={() => {}} accessibilityRole="button" accessibilityLabel="Abrir chat com o entregador">
          <ActionButton>
            <Icon name="chatbubble-outline" sf="bubble.left" size={16} color="primary" />
            <Text variant="caption">Chat</Text>
          </ActionButton>
        </Pressable>
        <Pressable onPress={handleCall} accessibilityRole="button" accessibilityLabel="Ligar ao entregador">
          <ActionButton>
            <Icon name="call-outline" sf="phone.fill" size={16} color="primary" />
            <Text variant="caption">Ligar</Text>
          </ActionButton>
        </Pressable>
      </ActionsRow>
    </Container>
  );
}
