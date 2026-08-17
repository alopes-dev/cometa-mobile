import type { AppNotification, NotificationSection } from './types';

export function groupNotificationsBySection(notifications: AppNotification[]): NotificationSection[] {
  const bySection = new Map<string, AppNotification[]>();
  for (const notification of notifications) {
    const existing = bySection.get(notification.group) ?? [];
    existing.push(notification);
    bySection.set(notification.group, existing);
  }
  return Array.from(bySection.entries()).map(([title, data]) => ({ title, data }));
}
