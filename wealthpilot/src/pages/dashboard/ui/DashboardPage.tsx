import { Link } from 'react-router-dom';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { KpiOverview } from '@widgets/kpi-overview';
import { FinancialCharts } from '@widgets/cashflow-chart';
import { RecentTransactions } from '@widgets/recent-transactions';
import { GoalsOverview } from '@widgets/goals-overview';
import { FinancialHealth } from '@widgets/financial-health';
import { CfoChat } from '@widgets/cfo-chat';
import { AddTransaction } from '@features/add-transaction';
import { PageHeader, Badge } from '@shared/ui';
import { DEMO_TODAY } from '@shared/config';
import { formatDate } from '@shared/lib';
export function DashboardPage() { return <div className="space-y-6"><PageHeader eyebrow="YOUR FINANCIAL OVERVIEW" title="Your money, in perspective." description="A clearer picture of today. More possibilities for tomorrow." action={<div className="flex items-center gap-3"><Badge>As of {formatDate(DEMO_TODAY, { day: 'numeric', month: 'short' })}</Badge><AddTransaction /></div>} /><KpiOverview /><div className="insight-banner"><span className="rounded-xl bg-indigo-100 p-2.5 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200"><Sparkles size={22} /></span><div className="flex-1"><p className="text-sm font-semibold">A new phone? A dream trip? Let’s make a plan.</p><p className="mt-1 text-xs opacity-80">Your CFO connects the dots between your next purchase and your bigger goals.</p></div><Link to="/ask-cfo" className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-semibold">Ask your CFO <ArrowUpRight size={16} /></Link></div><FinancialCharts /><div className="dashboard-content-grid"><div className="space-y-6"><RecentTransactions /><CfoChat /></div><div className="space-y-6"><GoalsOverview compact /><FinancialHealth /></div></div></div>; }
