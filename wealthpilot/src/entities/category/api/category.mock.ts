import { mockCollection, mockRequest } from '@shared/api';
import type { Category, CategoryApi } from '../model/types';
const db = mockCollection<Category>('categories', () => [
  { id: 'salary', name: 'Salary', color: '#047857', icon: 'briefcase' },
  { id: 'housing', name: 'Rent & housing', color: '#4338ca', icon: 'home' },
  { id: 'food', name: 'Food & groceries', color: '#d97706', icon: 'utensils' },
  { id: 'shopping', name: 'Shopping', color: '#be185d', icon: 'shopping-bag' },
  { id: 'subscriptions', name: 'Subscriptions', color: '#7c3aed', icon: 'play' },
  { id: 'transport', name: 'Transport & fuel', color: '#0369a1', icon: 'car' },
  { id: 'utilities', name: 'Utilities', color: '#0e7490', icon: 'zap' },
  { id: 'investment', name: 'Investments', color: '#059669', icon: 'trending-up' },
  { id: 'emi', name: 'Loan repayments', color: '#64748b', icon: 'landmark' },
  { id: 'family', name: 'Family', color: '#c2410c', icon: 'heart' },
  { id: 'other', name: 'Other', color: '#475569', icon: 'more-horizontal' },
]);
export const categoryApi: CategoryApi = { list: options => mockRequest(() => db.read(), options) };
