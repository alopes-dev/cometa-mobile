import { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Button, Icon, Text } from '@/components/design-system/atoms';
import { formatKwanza } from '@/features/home/format';
import { Container, IconStack, Halo, IconCircle, TextGroup, ButtonGroup } from './OrderConfirmation.styles';

export type OrderConfirmationProps = {
  restaurantName: string;
  total: number;
  onDone: () => void;
  onTrack: () => void;
};

export function OrderConfirmation({ restaurantName, total, onDone, onTrack }: OrderConfirmationProps) {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 120 });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, [scale]);

  const circleStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Container>
      <IconStack>
        <Halo />
        <Animated.View style={circleStyle}>
          <IconCircle>
            <Icon name="checkmark" sf="checkmark" size={40} color="onPrimary" />
          </IconCircle>
        </Animated.View>
      </IconStack>
      <TextGroup>
        <Text variant="title1">Pedido confirmado!</Text>
        <Text variant="body" color="textSecondary" style={{ textAlign: 'center' }}>
          O seu pedido de {formatKwanza(total)} foi enviado para {restaurantName}.
        </Text>
      </TextGroup>
      <ButtonGroup>
        <Button
          variant="primary"
          size="lg"
          shape="pill"
          icon={<Icon name="location-outline" sf="location" size={18} color="onPrimary" />}
          onPress={onTrack}
        >
          Acompanhar Pedido
        </Button>
        <Button variant="text" size="lg" onPress={onDone}>
          Voltar ao Início
        </Button>
      </ButtonGroup>
    </Container>
  );
}
