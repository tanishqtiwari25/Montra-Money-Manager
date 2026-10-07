import assert from 'node:assert/strict';
import { formatMoney, formatDate, addMonths } from '../src/shared/lib';
import { ApiError, failNextMockRequests, resetMockData, requireDate, paginate } from '../src/shared/api';
import { transactionApi, transactionTotals, monthlyTrend } from '../src/entities/transaction';
import { accountApi } from '../src/entities/account';
import { cardApi } from '../src/entities/card';
import { userApi } from '../src/entities/user';
import { goalApi, goalAffordability, allocatedToGoals } from '../src/entities/goal';
import { loanApi } from '../src/entities/loan';
import { budgetApi } from '../src/entities/budget';
import { notificationApi } from '../src/entities/notification';
import { categoryApi } from '../src/entities/category';

const storage = new Map<string, string>();
Object.defineProperty(globalThis, 'localStorage', { value: {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
  key: (index: number) => [...storage.keys()][index] ?? null,
  get length() { return storage.size; },
} });
const check = async (name: string, test: () => void | Promise<void>) => { await test(); console.log('PASS ' + name); };

async function main() {
  resetMockData();
  await check('INR and IST formatting; month-end calendar arithmetic', () => {
    assert.equal(formatMoney(10000000), '₹1,00,000');
    assert.equal(formatMoney(1500000000, { compact: true }), '₹1.5 Cr');
    assert.equal(addMonths('2026-01-31', 1), '2026-02-28');
    assert.equal(addMonths('2028-01-31', 1), '2028-02-29');
    assert.equal(formatDate('2026-10-06T20:00:00Z', { day: 'numeric', month: 'short' }), '7 Oct');
    assert.throws(() => requireDate('2026-02-31'), ApiError);
    assert.deepEqual(paginate([1, 2, 3], { page: NaN, pageSize: NaN }).items, [1, 2, 3]);
  });
  await check('all ten APIs load realistic demo seeds and 12 months', async () => {
    const [transactions, accounts, cards, user, goals, loans, budgets, categories, notices] = await Promise.all([
      transactionApi.list({ pageSize: 500 }), accountApi.list(), cardApi.list(), userApi.get(), goalApi.list(), loanApi.list(), budgetApi.list(), categoryApi.list(), notificationApi.list(),
    ]);
    assert.equal(transactions.total, 144);
    assert.equal(monthlyTrend(transactions.items).length, 12);
    assert.equal(accounts.filter(account => account.type === 'bank').length, 3);
    assert.equal(cards.filter(card => card.type === 'credit').length, 2);
    assert.equal(user.monthlySalaryPaise, 6000000);
    assert.equal(user.emergencyFundPaise, 4500000);
    assert.equal(goals.filter(goal => goal.status === 'achieved').length, 1);
    assert.equal(loans.filter(loan => loan.status === 'active').length, 1);
    assert.equal(budgets.length, 8);
    assert.equal(categories.length, 11);
    assert.equal(notices.length, 3);
  });
  await check('transaction filtering, pagination and transfers excluded from cashflow', async () => {
    const month = await transactionApi.list({ from: '2026-10-01', to: '2026-10-31', pageSize: 500 });
    assert.equal(month.total, 12);
    assert.equal(transactionTotals(month.items).incomePaise, 6000000);
    assert.equal(transactionTotals(month.items).expensePaise, 4119900);
    const filtered = await transactionApi.list({ search: 'swiggy', type: 'expense', paymentMethodId: 'hdfc-credit', minPaise: 100000, maxPaise: 150000, page: 2, pageSize: 3 });
    assert.equal(filtered.total, 10);
    assert.equal(filtered.items.length, 3);
  });
  await check('creating/editing/removing transactions adjusts bank and debit-card balances', async () => {
    const initial = await accountApi.get('hdfc');
    const input = { amountPaise: 3000000, type: 'expense' as const, categoryId: 'shopping', date: '2026-10-07', note: 'Demo purchase', paymentMethodId: 'hdfc-debit', tags: ['test'] };
    const item = await transactionApi.create(input);
    assert.equal((await accountApi.get('hdfc')).balancePaise, initial.balancePaise - 3000000);
    assert.equal((await cardApi.get('hdfc-debit')).balancePaise, initial.balancePaise - 3000000);
    await transactionApi.update(item.id, { ...input, amountPaise: 4000000 });
    assert.equal((await accountApi.get('hdfc')).balancePaise, initial.balancePaise - 4000000);
    await transactionApi.remove(item.id);
    assert.equal((await accountApi.get('hdfc')).balancePaise, initial.balancePaise);
  });
  await check('credit purchases increase card debt without reducing bank cash', async () => {
    const initialBank = await accountApi.get('hdfc'); const initialCard = await cardApi.get('hdfc-credit');
    const item = await transactionApi.create({ amountPaise: 70000, type: 'expense', categoryId: 'food', date: '2026-10-07', note: 'Credit purchase', paymentMethodId: 'hdfc-credit', tags: [] });
    assert.equal((await cardApi.get('hdfc-credit')).balancePaise, initialCard.balancePaise + 70000);
    assert.equal((await accountApi.get('hdfc')).balancePaise, initialBank.balancePaise);
    await transactionApi.remove(item.id);
  });
  await check('goal threshold, protected allocation and idempotent purchase ledger', async () => {
    const before = await accountApi.get('hdfc');
    const achieved = await goalApi.contribute('iphone', { amountPaise: 800000 });
    assert.equal(achieved.status, 'achieved');
    assert.equal((await accountApi.get('hdfc')).balancePaise, before.balancePaise);
    await goalApi.purchase('iphone', { paymentAccountId: 'hdfc' });
    await goalApi.purchase('iphone', { paymentAccountId: 'hdfc' });
    assert.equal((await accountApi.get('hdfc')).balancePaise, before.balancePaise - 10000000);
    const purchase = await transactionApi.list({ search: 'iPhone · goal purchase' });
    assert.equal(purchase.total, 1);
    await assert.rejects(goalApi.purchase('headphones', { paymentAccountId: 'paytm' }), (error: unknown) => error instanceof ApiError && error.code === 'VALIDATION');
    assert.equal((await goalApi.get('headphones')).status, 'achieved');
    const expensive = await goalApi.create({ name: 'Studio', targetPaise: 100000000, icon: 'sparkles', priority: 'high' });
    await assert.rejects(goalApi.contribute(expensive.id, { amountPaise: 30000000 }), ApiError);
    assert.equal((await goalApi.get(expensive.id)).savedPaise, 0);
    const goals = await goalApi.list(); assert.equal(allocatedToGoals(goals), 8200000);
    assert.ok(storage.size > 0);
  });
  await check('affordability handles emergency gap, active debt and zero savings', () => {
    const base = { liquidSavingsPaise: 10000000, emergencyReservedPaise: 4500000, emergencyTargetPaise: 18000000, totalGoalAllocationsPaise: 9200000, monthlySavingsPaise: 1200000, activeLoanOutstandingPaise: 10000000 };
    const goal = { id: 'x', name: 'Phone', targetPaise: 10000000, savedPaise: 9200000, icon: 'phone' as const, priority: 'high' as const, status: 'saving' as const, createdAt: '2026-01-01', achievementAnnounced: false };
    assert.equal(goalAffordability(goal, base).months, 21);
    assert.equal(goalAffordability(goal, { ...base, monthlySavingsPaise: 0 }).label, 'Not yet');
  });
  await check('notification source-key deduplication, read state and reminders', async () => {
    const input = { kind: 'goal-achieved' as const, title: 'Goal reached', message: 'Ready to buy.', href: '/goals', sourceKey: 'goal:test' };
    const first = await notificationApi.create(input); const second = await notificationApi.create(input);
    assert.equal(first.id, second.id);
    await notificationApi.markRead(first.id);
    assert.equal((await notificationApi.list()).find(item => item.id === first.id)?.read, true);
    const reminder = await notificationApi.createReminder({ title: 'Review iPhone plan', dueDate: '2027-04-07' });
    assert.equal((await notificationApi.listReminders())[0]?.id, reminder.id);
  });
  await check('API failure/retry, cancellation and reset restore initial state', async () => {
    failNextMockRequests(); await assert.rejects(accountApi.list(), (error: unknown) => error instanceof ApiError && error.code === 'NETWORK');
    assert.equal((await accountApi.list()).length, 6);
    const controller = new AbortController();
    const pending = transactionApi.create({ amountPaise: 10000, type: 'expense', categoryId: 'other', date: '2026-10-07', note: 'Cancelled request', paymentMethodId: 'hdfc', tags: [] }, { signal: controller.signal });
    controller.abort(); await assert.rejects(pending, (error: unknown) => error instanceof ApiError && error.code === 'ABORTED');
    assert.equal((await transactionApi.list({ search: 'Cancelled request' })).total, 0);
    resetMockData();
    assert.equal((await goalApi.get('iphone')).savedPaise, 9200000);
    assert.equal((await accountApi.get('hdfc')).balancePaise, 25200000);
    assert.equal((await transactionApi.list()).total, 144);
    assert.equal((await notificationApi.list()).length, 3);
  });
}
main().catch(error => { console.error(error); process.exitCode = 1; });
