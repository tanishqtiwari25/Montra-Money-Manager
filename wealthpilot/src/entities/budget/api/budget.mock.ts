import { mockCollection, mockRequest, requirePaise, requireRecord } from '@shared/api';
import { DEMO_MONTH } from '@shared/config';
import type { Budget, BudgetApi } from '../model/types';
const db = mockCollection<Budget>('budgets', () => [
  { id: 'budget-housing', categoryId: 'housing', month: DEMO_MONTH, limitPaise: 1800000 },
  { id: 'budget-food', categoryId: 'food', month: DEMO_MONTH, limitPaise: 400000 },
  { id: 'budget-shopping', categoryId: 'shopping', month: DEMO_MONTH, limitPaise: 600000 },
  { id: 'budget-transport', categoryId: 'transport', month: DEMO_MONTH, limitPaise: 300000 },
  { id: 'budget-subscriptions', categoryId: 'subscriptions', month: DEMO_MONTH, limitPaise: 100000 },
  { id: 'budget-utilities', categoryId: 'utilities', month: DEMO_MONTH, limitPaise: 200000 },
  { id: 'budget-family', categoryId: 'family', month: DEMO_MONTH, limitPaise: 300000 },
  { id: 'budget-emi', categoryId: 'emi', month: DEMO_MONTH, limitPaise: 580000 },
]);
export const budgetApi: BudgetApi = {
  list: (month, options) => mockRequest(() => db.read().filter(item => !month || item.month === month), options),
  update: (id, input, options) => mockRequest(() => { requirePaise(input.limitPaise, 'Budget'); const items = db.read(); const item = { ...requireRecord(items, id), limitPaise: input.limitPaise }; db.write(items.map(value => value.id === id ? item : value)); return item; }, options),
};
