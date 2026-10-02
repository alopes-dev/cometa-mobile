import { Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import Animated from 'react-native-reanimated';
import { Icon, Text } from '@/components/design-system/atoms';
import { usePressScale } from '@/hooks/usePressScale';
import { radius } from '@/theme';
import { home } from '../../content';
import type { ActiveOrder } from '../../types';
import { Card, Info, ProgressStep, ProgressTrack, SummaryRow } from './ActiveOrderCard.styles';

const THUMBNAIL_SIZE = 52;

export type ActiveOrderCardProps = {
  order: ActiveOrder;
  /** Opens tracking. The whole card is the target, as on the board. */
  onPress: () => void;
};

/**
 * The order in flight — node 48:19785.
 *
 * Sits directly under the search field because an order already placed
 * outranks anything Home could recommend next.
 */
export function ActiveOrderCard({ order, onPress }: ActiveOrderCardProps) {
  const { style: pressStyle, onPressIn, onPressOut } = usePressScale();
  const steps = Array.from({ length: order.totalSteps }, (_, index) => index);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityLabel={`${order.restaurantName}, ${order.statusLabel}, ${order.etaLabel}`}
      accessibilityHint={home.trackOrder}
    >
      <Animated.View style={pressStyle}>
        <Card>
          <SummaryRow>
            <Image
              source={order.imageUrl}
              style={{ width: THUMBNAIL_SIZE, height: THUMBNAIL_SIZE, borderRadius: radius.md }}
              contentFit="cover"
            />
            <Info>
              <Text variant="h6" numberOfLines={1}>
                {order.restaurantName}
              </Text>
              <Text variant="caption" color="success">
                {order.statusLabel} · {order.etaLabel}
              </Text>
            </Info>
            <Icon name="chevron-forward" sf="chevron.right" size={18} color="muted" />
          </SummaryRow>

          <ProgressTrack
            accessible
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: order.totalSteps, now: order.completedSteps }}
          >
            {steps.map((step) => (
              <ProgressStep key={step} done={step < order.completedSteps} />
            ))}
          </ProgressTrack>

          <Text variant="label" color="brand" style={{ textAlign: 'right' }}>
            {home.trackOrder}
          </Text>
        </Card>
      </Animated.View>
    </Pressable>
  );
}
