import type { IconProps } from '@/components/design-system/atoms';

export type NotificationCategory = 'promo' | 'order' | 'system';

export type AppNotification = {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  group: string;
  read: boolean;
};

export type NotificationSection = {
  title: string;
  data: AppNotification[];
};

export type NotificationCategoryMeta = {
  icon: { name: IconProps['name']; sf?: IconProps['sf'] };
};
