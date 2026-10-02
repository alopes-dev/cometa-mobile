import { NotificationBell } from '@/components/design-system/molecules';
import { Text } from '@/components/design-system/atoms';
import { discovery } from '../../content';
import { Container, TitleColumn } from './DiscoveryHeader.styles';

export type DiscoveryHeaderProps = {
  /** Shows the dot over the bell. */
  hasUnread?: boolean;
  onPressNotifications?: () => void;
};

/**
 * Discovery's header — node 48:20252.
 *
 * Deliberately not Home's `DiscoverHeader`. Home leads with the delivery
 * address because its whole feed depends on where the order is going;
 * Discovery is browsing, so the board leads with the screen's name and a line
 * saying what it is for, and carries nothing else but the bell. Two headers
 * that look alike but answer different questions should stay apart.
 */
export function DiscoveryHeader({ hasUnread = false, onPressNotifications }: DiscoveryHeaderProps) {
  return (
    <Container>
      <TitleColumn>
        <Text variant="h3">{discovery.title}</Text>
        <Text variant="micro" color="secondary">
          {discovery.subtitle}
        </Text>
      </TitleColumn>

      <NotificationBell
        hasUnread={hasUnread}
        onPress={onPressNotifications}
        accessibilityLabel={
          hasUnread
            ? `${discovery.notifications}, ${discovery.unreadNotifications}`
            : discovery.notifications
        }
      />
    </Container>
  );
}
