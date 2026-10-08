import { useOverview } from '@entities/overview';
import { Wallet, ArrowDownLeft, ArrowUpRight, PiggyBank, TrendingUp, ArrowUpRight as Arrow } from 'lucide-react';
import { useAccounts, liquidBalance, investmentBalance } from '@entities/account';
import { useCards, creditCardDebt } from '@entities/card';
import { useLoans, activeLoanOutstanding } from '@entities/loan';
import { useTransactions, transactionTotals } from '@entities/transaction';
import { AsyncState } from '@shared/ui';
import { IS_DEMO, DEMO_MONTH } from '@shared/config';
import { formatMoney } from '@shared/lib';
export function KpiOverview() {
  const accounts = useAccounts(); const cards = useCards(); const loans = useLoans(); const transactions = useTransactions();
  const overview = useOverview(); const summary = overview.dashboard?.summary;
  const totals = !IS_DEMO && summary ? { incomePaise: summary.actualMonthlyIncomePaise, expensePaise: summary.actualMonthlyExpensesPaise, savingsPaise: summary.actualMonthlySavingsPaise, savingsRate: summary.savingsRatePercent } : transactionTotals(transactions.items, DEMO_MONTH); const balance = !IS_DEMO && summary ? summary.liquidBalancePaise : liquidBalance(accounts.items); const netWorth = !IS_DEMO && summary ? summary.netWorthPaise : balance + investmentBalance(accounts.items) - creditCardDebt(cards.items) - activeLoanOutstanding(loans.items);
  const metrics = [{ label: 'Total balance', value: formatMoney(balance), note: 'Across your liquid accounts', icon: Wallet, tone: 'balance' }, { label: 'Monthly income', value: formatMoney(totals.incomePaise), note: 'Income received this month', icon: ArrowDownLeft, tone: 'positive' }, { label: 'Monthly expenses', value: formatMoney(totals.expensePaise), note: 'Transfers excluded', icon: ArrowUpRight, tone: 'negative' }, { label: 'Savings rate', value: totals.savingsRate.toFixed(1) + '%', note: formatMoney(totals.savingsPaise) + ' monthly surplus', icon: PiggyBank, tone: 'brand' }, { label: 'Net worth', value: formatMoney(netWorth), note: 'Assets minus loans & card debt', icon: TrendingUp, tone: 'brand' }];
  return <AsyncState loading={IS_DEMO ? !accounts.loaded || !cards.loaded || !loans.loaded || !transactions.loaded : !summary} error={overview.error ?? accounts.error ?? cards.error ?? loans.error ?? transactions.error} onRetry={() => { if (!IS_DEMO) void overview.load(true); void accounts.load(true); void cards.load(true); void loans.load(true); void transactions.load(true); }}><div className="kpi-grid">{metrics.map(metric => <section key={metric.label} className={'kpi-card ' + (metric.tone === 'balance' ? 'kpi-featured' : '')}><div className="flex items-center justify-between"><p className="kpi-label">{metric.label}</p><span className={'kpi-icon ' + metric.tone}><metric.icon size={17} strokeWidth={1.7} aria-hidden="true" /></span></div><p className="kpi-value">{metric.value}</p><p className="kpi-note">{metric.tone === 'balance' && <Arrow size={13} aria-hidden="true" />}{metric.note}</p></section>)}</div></AsyncState>;
}
