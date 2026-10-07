import { ApiError, mockCollection, mockRequest, requireDate, requireRecord } from '@shared/api';
import { DEMO_TODAY } from '@shared/config';
import type { Notification, NotificationApi, Reminder } from '../model/types';
const db = mockCollection<Notification>('notifications', () => [
  { id: 'notice-headphones', kind: 'goal-achieved', title: 'A goal worth celebrating', message: 'You can now afford Noise-cancelling headphones based on your salary and savings.', createdAt: '2026-10-07T09:00:00+05:30', read: false, href: '/goals', sourceKey: 'goal:headphones' },
  { id: 'notice-card', kind: 'bill-due', title: 'HDFC card bill is coming up', message: '₹7,600 is due on 14 Oct. Keep your payment ready.', createdAt: '2026-10-07T08:30:00+05:30', read: false, href: '/accounts', sourceKey: 'bill:hdfc-credit:2026-10-14' },
  { id: 'notice-food', kind: 'budget-exceeded', title: 'Food budget exceeded', message: 'Food & groceries is ₹1,000 over your October budget.', createdAt: '2026-10-07T08:00:00+05:30', read: false, href: '/budgets', sourceKey: 'budget:budget-food:2026-10' },
]);
const reminders = mockCollection<Reminder>('reminders', () => []);
export const notificationApi: NotificationApi = {
  list: options => mockRequest(() => db.read().sort((a, b) => b.createdAt.localeCompare(a.createdAt)), options),
  create: (input, options) => mockRequest(() => {
    if (!input.title.trim() || !input.message.trim() || !input.sourceKey.trim() || !/^\/(dashboard|transactions|accounts|budgets|loans|goals|reports|settings|ask-cfo)$/.test(input.href) || !['goal-achieved', 'bill-due', 'budget-exceeded', 'reminder'].includes(input.kind)) throw new ApiError('VALIDATION', 'Invalid notification.');
    const items = db.read(); const existing = items.find(item => item.sourceKey === input.sourceKey);
    if (existing) return existing;
    const item: Notification = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString(), read: false };
    db.write([item, ...items]); return item;
  }, options),
  markRead: (id, options) => mockRequest(() => { const items = db.read(); const item = { ...requireRecord(items, id), read: true }; db.write(items.map(value => value.id === id ? item : value)); return item; }, options),
  markAllRead: options => mockRequest(() => { const items = db.read().map(item => ({ ...item, read: true })); db.write(items); return items; }, options),
  createReminder: (input, options) => mockRequest(() => {
    requireDate(input.dueDate);
    if (!input.title.trim() || input.title.length > 100 || input.dueDate < DEMO_TODAY) throw new ApiError('VALIDATION', 'Enter a title and a future reminder date.');
    const item: Reminder = { ...input, title: input.title.trim(), id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    reminders.write([...reminders.read(), item]); return item;
  }, options),
  listReminders: options => mockRequest(() => reminders.read(), options),
};
