import type { RequestOptions } from '@shared/api';
export type NotificationKind = 'goal-achieved' | 'bill-due' | 'budget-exceeded' | 'reminder';
export interface Notification { id: string; kind: NotificationKind; title: string; message: string; createdAt: string; read: boolean; href: string; sourceKey: string }
export type NotificationInput = Omit<Notification, 'id' | 'createdAt' | 'read'>;
export interface Reminder { id: string; title: string; dueDate: string; createdAt: string }
export interface NotificationApi {
  list: (options?: RequestOptions) => Promise<Notification[]>;
  create: (input: NotificationInput, options?: RequestOptions) => Promise<Notification>;
  markRead: (id: string, options?: RequestOptions) => Promise<Notification>;
  markAllRead: (options?: RequestOptions) => Promise<Notification[]>;
  createReminder: (input: Pick<Reminder, 'title' | 'dueDate'>, options?: RequestOptions) => Promise<Reminder>;
  listReminders: (options?: RequestOptions) => Promise<Reminder[]>;
}
