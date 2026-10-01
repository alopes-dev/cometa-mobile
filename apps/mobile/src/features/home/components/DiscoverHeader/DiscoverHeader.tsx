import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { Text, Icon, Avatar } from '@/components/design-system/atoms';
import { useBounceAnimation } from '@/hooks/useBounceAnimation';
import { Container, AddressSection, AddressColumn, AddressRow, BellButton } from './DiscoverHeader.styles';

export type DiscoverHeaderProps = {
  avatarUrl: string;
  address: string;
  onPressAddress?: () => void;
  onPressNotifications?: () => void;
};

export function DiscoverHeader({
  avatarUrl,
  address,
  onPressAddress,
  onPressNotifications,
}: DiscoverHeaderProps) {
  const { style: avatarBounceStyle, bounce: bounceAvatar } = useBounceAnimation(0.96);
  const { style: bellBounceStyle, bounce: bounceBell } = useBounceAnimation(0.9);

  const handlePressAddress = () => {
    bounceAvatar();
    onPressAddress?.();
  };

  const handlePressNotifications = () => {
    bounceBell();
    onPressNotifications?.();
  };

  return (
    <Container>
      <Pressable onPress={handlePressAddress} accessibilityRole="button" style={{ flex: 1 }}>
        <AddressSection>
          <Animated.View style={avatarBounceStyle}>
            <Avatar source={{ uri: avatarUrl }} size={44} />
          </Animated.View>
          <AddressColumn>
            <Text variant="footnote" color="textSecondary">
              Entrega para
            </Text>
            <AddressRow>
              <Text variant="bodyEmphasized" numberOfLines={1}>
                {address}
              </Text>
              <Icon name="chevron-down" sf="chevron.down" size={16} color="textPrimary" />
            </AddressRow>
          </AddressColumn>
        </AddressSection>
      </Pressable>
      <Pressable
        onPress={handlePressNotifications}
        accessibilityRole="button"
        accessibilityLabel="Notificações"
        hitSlop={8}
      >
        <Animated.View style={bellBounceStyle}>
          <BellButton>
            <Icon name="notifications-outline" sf="bell" size={20} color="textPrimary" />
          </BellButton>
        </Animated.View>
      </Pressable>
    </Container>
  );
}
