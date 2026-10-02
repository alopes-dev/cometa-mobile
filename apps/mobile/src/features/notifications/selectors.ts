import type { AppNotification, NotificationSection } from './types';

export function groupNotificationsBySection(
  notifications: AppNotification[]
): NotificationSection[] {
  const bySection = new Map<string, AppNotification[]>();
  for (const notification of notifications) {
    const existing = bySection.get(notification.group) ?? [];
    existing.push(notification);
    bySection.set(notification.group, existing);
  }
  return Array.from(bySection.entries()).map(([title, data]) => ({ title, data }));
}

/**
 * Whether anything is waiting in the notification centre.
 *
 * Drives the dot over the bell on Discovery (node 48:20258). A count would be
 * more information than the board shows and more than the glance is for —
 * the dot says "there is something", the screen behind it says what.
 */
export function hasUnreadNotifications(notifications: AppNotification[]): boolean {
  return notifications.some((notification) => !notification.read);
}
