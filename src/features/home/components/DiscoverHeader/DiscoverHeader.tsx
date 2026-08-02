import { Pressable } from 'react-native';
import { Text, Icon, Avatar } from '@/components/design-system/atoms';
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
  return (
    <Container>
      <Pressable onPress={onPressAddress} accessibilityRole="button" style={{ flex: 1 }}>
        <AddressSection>
          <Avatar source={{ uri: avatarUrl }} size={44} />
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
        onPress={onPressNotifications}
        accessibilityRole="button"
        accessibilityLabel="Notificações"
        hitSlop={8}
      >
        <BellButton>
          <Icon name="notifications-outline" sf="bell" size={20} color="textPrimary" />
        </BellButton>
      </Pressable>
    </Container>
  );
}
