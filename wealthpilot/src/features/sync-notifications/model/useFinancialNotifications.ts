import { useEffect } from 'react';
import { useBudgets } from '@entities/budget';
import { useCards } from '@entities/card';
import { useTransactions, spendingByCategory } from '@entities/transaction';
import { useCategories, categoryName } from '@entities/category';
import { useNotifications, notificationApi, type NotificationInput } from '@entities/notification';
import { DEMO_MONTH, DEMO_TODAY } from '@shared/config';
import { formatMoney, formatDate } from '@shared/lib';
const pending = new Set<string>();
export function useFinancialNotifications(): void {
  const budgets = useBudgets(); const cards = useCards(); const transactions = useTransactions(); const categories = useCategories(); const notices = useNotifications();
  useEffect(() => {
    if (!budgets.loaded || !cards.loaded || !transactions.loaded || !categories.loaded || !notices.loaded) return;
    const alerts: NotificationInput[] = [];
    const spending = spendingByCategory(transactions.items, DEMO_MONTH);
    for (const budget of budgets.items.filter(item => item.month === DEMO_MONTH)) {
      const spent = spending.find(item => item.categoryId === budget.categoryId)?.amountPaise ?? 0;
      if (spent > budget.limitPaise) alerts.push({ kind: 'budget-exceeded', title: categoryName(categories.items, budget.categoryId) + ' budget exceeded', message: formatMoney(spent - budget.limitPaise) + ' over your monthly budget.', href: '/budgets', sourceKey: 'budget:' + budget.id + ':' + budget.month });
    }
    for (const card of cards.items) {
      if (card.type !== 'credit' || !card.dueDate) continue;
      const days = (Date.parse(card.dueDate + 'T12:00:00Z') - Date.parse(DEMO_TODAY + 'T12:00:00Z')) / 86400000;
      if (days >= 0 && days <= 7) alerts.push({ kind: 'bill-due', title: card.name + ' bill coming up', message: formatMoney(card.duePaise ?? 0) + ' due ' + formatDate(card.dueDate) + '.', href: '/accounts', sourceKey: 'bill:' + card.id + ':' + card.dueDate });
    }
    for (const alert of alerts) {
      if (pending.has(alert.sourceKey) || notices.items.some(item => item.sourceKey === alert.sourceKey)) continue;
      pending.add(alert.sourceKey);
      void notificationApi.create(alert).then(notice => useNotifications.getState().upsert(notice)).catch(() => undefined).finally(() => pending.delete(alert.sourceKey));
    }
  }, [budgets.items, budgets.loaded, cards.items, cards.loaded, transactions.items, transactions.loaded, categories.items, categories.loaded, notices.items, notices.loaded]);
}
