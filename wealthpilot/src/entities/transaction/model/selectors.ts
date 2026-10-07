import type { Transaction } from './types';
export function transactionTotals(items: readonly Transaction[], month?: string) {
  const selected = month ? items.filter(item => item.date.startsWith(month)) : items;
  const incomePaise = selected.filter(item => item.type === 'income').reduce((sum, item) => sum + item.amountPaise, 0);
  const expensePaise = selected.filter(item => item.type === 'expense').reduce((sum, item) => sum + item.amountPaise, 0);
  return { incomePaise, expensePaise, savingsPaise: incomePaise - expensePaise, savingsRate: incomePaise > 0 ? (incomePaise - expensePaise) / incomePaise * 100 : 0 };
}
export function spendingByCategory(items: readonly Transaction[], month?: string): { categoryId: string; amountPaise: number }[] {
  const map = new Map<string, number>();
  items.filter(item => item.type === 'expense' && (!month || item.date.startsWith(month))).forEach(item => map.set(item.categoryId, (map.get(item.categoryId) ?? 0) + item.amountPaise));
  return Array.from(map, ([categoryId, amountPaise]) => ({ categoryId, amountPaise })).sort((a, b) => b.amountPaise - a.amountPaise);
}
export function spendingByPaymentMethod(items: readonly Transaction[], month?: string): { paymentMethodId: string; amountPaise: number }[] {
  const map = new Map<string, number>();
  items.filter(item => item.type === 'expense' && (!month || item.date.startsWith(month))).forEach(item => map.set(item.paymentMethodId, (map.get(item.paymentMethodId) ?? 0) + item.amountPaise));
  return Array.from(map, ([paymentMethodId, amountPaise]) => ({ paymentMethodId, amountPaise })).sort((a, b) => b.amountPaise - a.amountPaise);
}
export function monthlyTrend(items: readonly Transaction[]): { month: string; incomePaise: number; expensePaise: number; savingsPaise: number; savingsRate: number }[] {
  return [...new Set(items.map(item => item.date.slice(0, 7)))].sort().map(month => ({ month, ...transactionTotals(items, month) }));
}
