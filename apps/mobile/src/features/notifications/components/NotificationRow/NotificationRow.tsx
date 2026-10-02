import { Icon, Text } from '@/components/design-system/atoms';
import { NOTIFICATION_CATEGORY_META } from '../../mockData';
import type { AppNotification } from '../../types';
import { Container, IconCircle, Info, TitleRow, UnreadDot } from './NotificationRow.styles';

export type NotificationRowProps = {
  notification: AppNotification;
};

export function NotificationRow({ notification }: NotificationRowProps) {
  const { icon } = NOTIFICATION_CATEGORY_META[notification.category];

  return (
    <Container>
      <IconCircle read={notification.read}>
        <Icon name={icon.name} sf={icon.sf} size={18} color={notification.read ? 'secondary' : 'primary'} />
      </IconCircle>
      <Info>
        <TitleRow>
          <Text variant="title" numberOfLines={1} style={{ flex: 1 }}>
            {notification.title}
          </Text>
          {!notification.read ? <UnreadDot testID="unread-dot" /> : null}
        </TitleRow>
        <Text variant="caption" color="secondary">
          {notification.message}
        </Text>
        <Text variant="micro" color="secondary">
          {notification.timestamp}
        </Text>
      </Info>
    </Container>
  );
}
