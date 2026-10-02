import { groupNotificationsBySection, hasUnreadNotifications } from './selectors';
import type { AppNotification } from './types';

function makeNotification(overrides: Partial<AppNotification>): AppNotification {
  return {
    id: 'n1',
    category: 'system',
    title: 'Title',
    message: 'Message',
    timestamp: 'Agora',
    group: 'Hoje',
    read: false,
    ...overrides,
  };
}

describe('groupNotificationsBySection', () => {
  it('groups notifications under their section preserving first-seen order', () => {
    const notifications: AppNotification[] = [
      makeNotification({ id: '1', group: 'Hoje' }),
      makeNotification({ id: '2', group: 'Esta semana' }),
      makeNotification({ id: '3', group: 'Hoje' }),
    ];

    const sections = groupNotificationsBySection(notifications);

    expect(sections.map((section) => section.title)).toEqual(['Hoje', 'Esta semana']);
    expect(sections[0].data.map((n) => n.id)).toEqual(['1', '3']);
    expect(sections[1].data.map((n) => n.id)).toEqual(['2']);
  });

  it('returns an empty array for empty input', () => {
    expect(groupNotificationsBySection([])).toEqual([]);
  });
});

describe('hasUnreadNotifications', () => {
  it('is true while any notification is unread', () => {
    expect(
      hasUnreadNotifications([
        makeNotification({ id: '1', read: true }),
        makeNotification({ id: '2', read: false }),
      ])
    ).toBe(true);
  });

  it('is false once every notification has been read', () => {
    expect(
      hasUnreadNotifications([
        makeNotification({ id: '1', read: true }),
        makeNotification({ id: '2', read: true }),
      ])
    ).toBe(false);
  });

  it('is false when there are no notifications at all', () => {
    expect(hasUnreadNotifications([])).toBe(false);
  });
});
