import { ApiError, mockCollection, mockRequest, readMockResource, readMockView, writeMockResource, requireDate, requirePaise, requireRecord } from '@shared/api';
import { DEMO_TODAY } from '@shared/config';
import type { Goal, GoalApi } from '../model/types';
const db = mockCollection<Goal>('goals', () => [
  { id: 'iphone', name: 'iPhone', targetPaise: 10000000, savedPaise: 9200000, icon: 'phone', priority: 'high', targetDate: '2027-04-07', status: 'saving', createdAt: '2026-03-01', achievementAnnounced: false },
  { id: 'laptop', name: 'MacBook Air', targetPaise: 12000000, savedPaise: 4600000, icon: 'laptop', priority: 'high', targetDate: '2027-06-01', status: 'saving', createdAt: '2026-04-01', achievementAnnounced: false },
  { id: 'goa', name: 'Goa getaway', targetPaise: 4000000, savedPaise: 2400000, icon: 'plane', priority: 'medium', targetDate: '2027-01-15', status: 'saving', createdAt: '2026-05-01', achievementAnnounced: false },
  { id: 'headphones', name: 'Noise-cancelling headphones', targetPaise: 1200000, savedPaise: 1200000, icon: 'headphones', priority: 'low', status: 'achieved', createdAt: '2026-02-01', achievementAnnounced: false },
]);
export const goalApi: GoalApi = {
  list: options => mockRequest(() => db.read(), options),
  get: (id, options) => mockRequest(() => requireRecord(db.read(), id), options),
  create: (input, options) => mockRequest(() => {
    requirePaise(input.targetPaise, 'Target price');
    if (!input.name.trim() || input.name.length > 80) throw new ApiError('VALIDATION', 'Use an item name of 1–80 characters.');
    if (!['phone', 'laptop', 'plane', 'headphones', 'sparkles'].includes(input.icon) || !['high', 'medium', 'low'].includes(input.priority)) throw new ApiError('VALIDATION', 'Choose a valid icon and priority.');
    if (input.targetDate) { requireDate(input.targetDate); if (input.targetDate < DEMO_TODAY) throw new ApiError('VALIDATION', 'Target date cannot be in the past.'); }
    if (input.imageUrl) { let url: URL; try { url = new URL(input.imageUrl); } catch { throw new ApiError('VALIDATION', 'Use a valid HTTPS image URL.'); } if (url.protocol !== 'https:') throw new ApiError('VALIDATION', 'Use a valid HTTPS image URL.'); }
    const item: Goal = { ...input, id: crypto.randomUUID(), name: input.name.trim(), savedPaise: 0, status: 'saving', createdAt: DEMO_TODAY, achievementAnnounced: false };
    db.write([...db.read(), item]); return item;
  }, options),
  contribute: (id, input, options) => mockRequest(() => {
    requirePaise(input.amountPaise, 'Contribution'); const items = db.read(); const goal = requireRecord(items, id);
    if (goal.status !== 'saving') throw new ApiError('CONFLICT', 'This goal is already funded or purchased.', 409);
    if (input.amountPaise > goal.targetPaise - goal.savedPaise) throw new ApiError('VALIDATION', 'Contribution exceeds the amount remaining.');
    const accounts = readMockView<{ id: string; type: string; balancePaise: number }[]>('account-balances');
    const user = readMockResource<{ emergencyFundPaise: number }>('user')?.items[0];
    if (!accounts || !user) throw new ApiError('NETWORK', 'Demo finances not initialized. Reload the application.', 503);
    const liquid = accounts.filter(account => account.type !== 'investment').reduce((sum, account) => sum + account.balancePaise, 0);
    const reserved = items.filter(item => item.status !== 'purchased').reduce((sum, item) => sum + item.savedPaise, 0) + user.emergencyFundPaise;
    if (input.amountPaise > Math.max(0, liquid - reserved)) throw new ApiError('VALIDATION', 'This contribution would use emergency savings or funds allocated to another goal.');
    const savedPaise = goal.savedPaise + input.amountPaise;
    const item: Goal = { ...goal, savedPaise, status: savedPaise >= goal.targetPaise ? 'achieved' : 'saving' };
    db.write(items.map(value => value.id === id ? item : value)); return item;
  }, options),
  purchase: (id, input, options) => mockRequest(() => {
    const items = db.read(); const goal = requireRecord(items, id);
    if (goal.status === 'purchased') return goal;
    if (goal.savedPaise < goal.targetPaise) throw new ApiError('CONFLICT', 'Fully fund this goal before marking it purchased.', 409);
    const account = readMockView<{ id: string; type: string; balancePaise: number }[]>('account-balances')?.find(value => value.id === input.paymentAccountId && value.type !== 'investment');
    if (!account || account.balancePaise < goal.targetPaise) throw new ApiError('VALIDATION', 'Choose a cash, bank or wallet account with enough balance.');
    interface PurchaseLedgerProjection { id: string; amountPaise: number; type: 'income' | 'expense' | 'transfer'; categoryId: string; date: string; note: string; paymentMethodId: string; tags: string[]; destinationAccountId?: string }
    const ledger = readMockResource<PurchaseLedgerProjection>('transactions');
    if (!ledger) throw new ApiError('NETWORK', 'Demo transaction dataset not initialized. Reload the application.', 503);
    const purchase: PurchaseLedgerProjection = { id: 'goal-purchase-' + goal.id, amountPaise: goal.targetPaise, type: 'expense', categoryId: 'shopping', date: DEMO_TODAY, note: goal.name + ' · goal purchase', paymentMethodId: input.paymentAccountId, tags: ['goal', 'purchase'] };
    writeMockResource('transactions', [...ledger.items, purchase]);
    const item: Goal = { ...goal, status: 'purchased', purchasedAt: DEMO_TODAY, achievementAnnounced: true };
    db.write(items.map(value => value.id === id ? item : value)); return item;
  }, options),
  acknowledgeAchievement: (id, options) => mockRequest(() => {
    const items = db.read(); const goal = requireRecord(items, id);
    if (goal.status === 'saving') throw new ApiError('CONFLICT', 'This goal has not been achieved.', 409);
    const item: Goal = { ...goal, achievementAnnounced: true };
    db.write(items.map(value => value.id === id ? item : value)); return item;
  }, options),
};
