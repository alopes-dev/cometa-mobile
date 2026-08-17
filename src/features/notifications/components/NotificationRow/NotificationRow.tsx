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
        <Icon name={icon.name} sf={icon.sf} size={18} color={notification.read ? 'textSecondary' : 'primary'} />
      </IconCircle>
      <Info>
        <TitleRow>
          <Text variant="bodyEmphasized" numberOfLines={1} style={{ flex: 1 }}>
            {notification.title}
          </Text>
          {!notification.read ? <UnreadDot testID="unread-dot" /> : null}
        </TitleRow>
        <Text variant="footnote" color="textSecondary">
          {notification.message}
        </Text>
        <Text variant="caption" color="textSecondary">
          {notification.timestamp}
        </Text>
      </Info>
    </Container>
  );
}
