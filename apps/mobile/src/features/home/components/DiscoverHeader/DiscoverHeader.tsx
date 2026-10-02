import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { Badge, Icon, Text } from '@/components/design-system/atoms';
import { useBounceAnimation } from '@/hooks/useBounceAnimation';
import { home } from '../../content';
import {
  Actions,
  ActionButton,
  AddressColumn,
  AddressRow,
  BadgeSlot,
  CartSlot,
  Container,
  LabelRow,
} from './DiscoverHeader.styles';

export type DiscoverHeaderProps = {
  /** The delivery address, e.g. "Talatona, Luanda". */
  address: string;
  /** Items in the cart; the badge hides itself at zero. */
  cartCount?: number;
  onPressAddress?: () => void;
  onPressNotifications?: () => void;
  onPressCart?: () => void;
};

/**
 * Home's header — node 48:19769.
 *
 * The address is the primary control here, not decoration: the board gives it
 * a chevron and the whole block is the tap target for changing where the
 * order goes.
 */
export function DiscoverHeader({
  address,
  cartCount = 0,
  onPressAddress,
  onPressNotifications,
  onPressCart,
}: DiscoverHeaderProps) {
  const { style: bellBounceStyle, bounce: bounceBell } = useBounceAnimation(0.9);
  const { style: cartBounceStyle, bounce: bounceCart } = useBounceAnimation(0.9);

  const handlePressNotifications = () => {
    bounceBell();
    onPressNotifications?.();
  };

  const handlePressCart = () => {
    bounceCart();
    onPressCart?.();
  };

  return (
    <Container>
      <Pressable
        onPress={onPressAddress}
        accessibilityRole="button"
        accessibilityLabel={`${home.deliverTo}: ${address}`}
        style={{ flexShrink: 1 }}
      >
        <AddressColumn>
          <LabelRow>
            <Icon name="location-outline" sf="mappin" size={12} color="muted" />
            <Text variant="micro" color="muted">
              {home.deliverTo}
            </Text>
          </LabelRow>
          <AddressRow>
            <Text variant="h6" numberOfLines={1}>
              {address}
            </Text>
            <Icon name="chevron-down" sf="chevron.down" size={14} color="primary" />
          </AddressRow>
        </AddressColumn>
      </Pressable>

      <Actions>
        <Pressable
          onPress={handlePressNotifications}
          accessibilityRole="button"
          accessibilityLabel={home.notifications}
          hitSlop={8}
        >
          <Animated.View style={bellBounceStyle}>
            <ActionButton>
              <Icon name="notifications-outline" sf="bell" size={20} color="primary" />
            </ActionButton>
          </Animated.View>
        </Pressable>

        <Pressable
          onPress={handlePressCart}
          accessibilityRole="button"
          accessibilityLabel={cartCount > 0 ? `${home.cart}, ${cartCount}` : home.cart}
          hitSlop={8}
        >
          <Animated.View style={cartBounceStyle}>
            <CartSlot>
              <ActionButton>
                <Icon name="bag-outline" sf="bag" size={20} color="primary" />
              </ActionButton>
              <BadgeSlot>
                <Badge count={cartCount} />
              </BadgeSlot>
            </CartSlot>
          </Animated.View>
        </Pressable>
      </Actions>
    </Container>
  );
}
