import { KpiOverview } from '@widgets/kpi-overview';
import { FinancialCharts } from '@widgets/cashflow-chart';
import { RecentTransactions } from '@widgets/recent-transactions';
import { GoalsOverview } from '@widgets/goals-overview';
import { FinancialHealth } from '@widgets/financial-health';
import { GettingStarted } from '@widgets/getting-started';
import { AddTransaction } from '@features/add-transaction';
import { PageHeader, Badge } from '@shared/ui';
import { DEMO_TODAY } from '@shared/config';
import { formatDate } from '@shared/lib';
export function DashboardPage() { return <div className="space-y-6"><PageHeader eyebrow="YOUR FINANCIAL OVERVIEW" title="Your money at a glance" description="See what came in, what went out, and what you’re working towards." action={<div className="flex items-center gap-3"><Badge>As of {formatDate(DEMO_TODAY, { day: 'numeric', month: 'short' })}</Badge><AddTransaction /></div>} /><GettingStarted /><KpiOverview /><FinancialCharts /><div className="dashboard-content-grid"><div className="space-y-6"><RecentTransactions /></div><div className="space-y-6"><GoalsOverview compact /><FinancialHealth /></div></div></div>; }
