import { useMemo } from 'react';
import type { Transaction } from '@entities/transaction';
import { monthlyTrend, spendingByCategory } from '@entities/transaction';
import type { Category } from '@entities/category';
import { Card, CartesianChart, ChartDataTable, type ChartPoint } from '@shared/ui';
import { formatMoney, formatDate } from '@shared/lib';
const axisMoney = (value: number) => formatMoney(value, { compact: true });
export function CategoryTrends({ transactions, categories, period, selected }: { transactions: Transaction[]; categories: Category[]; period: 'month' | 'year'; selected: string }) {
  const series = useMemo(() => spendingByCategory(transactions.filter(item => item.date.startsWith(selected))).slice(0, 3).map(item => ({ key: item.categoryId, label: categories.find(category => category.id === item.categoryId)?.name ?? 'Other', color: categories.find(category => category.id === item.categoryId)?.color ?? '#64748b' })), [transactions, categories, selected]);
  const points = useMemo(() => { const all = monthlyTrend(transactions); const months = period === 'month' ? all.filter(item => item.month <= selected).slice(-6) : all.filter(item => item.month.startsWith(selected)); return months.map(item => { const spending = spendingByCategory(transactions, item.month); const point: ChartPoint = { label: formatDate(item.month + '-01', { month: 'short' }) }; for (const category of series) point[category.key] = spending.find(value => value.categoryId === category.key)?.amountPaise ?? 0; return point; }); }, [transactions, period, selected, series]);
  return <Card title="Category trends over time" className="mt-6"><p className="mb-3 text-xs text-muted">Top three categories across the available months. Yearly views cover the demo months in that calendar year.</p><CartesianChart data={points} series={series} xKey="label" label="Monthly trend for the three largest spending categories" variant="bar" formatValue={formatMoney} formatAxis={axisMoney} /><ChartDataTable data={points} series={series} xKey="label" formatValue={formatMoney} caption="Monthly category spending trends" /></Card>;
}
