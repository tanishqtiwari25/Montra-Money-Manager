import type { Notification } from './types';
export function unreadNotificationCount(notifications: readonly Notification[]): number { return notifications.filter(notification => !notification.read).length; }
