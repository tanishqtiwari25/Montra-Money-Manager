import React from 'react';
import { StatsCard, Card } from '../../components/ui/Card';
import { formatCurrency } from '../../utils/currencyFormatter';

export const Dashboard = () => {
  // Temporary structured mock presentation state prior to backend API readiness
  const summary = {
    totalBalance: 125400.5,
    totalIncome: 45000.0,
    totalExpenses: 18250.0,
    savings: 26750.0,
  };

  const recentTransactions = [
    { id: 1, title: 'AWS Cloud Services', category: 'Infrastructure', amount: -240.0, date: '2026-03-30' },
    { id: 2, title: 'Stripe Payout', category: 'Revenue', amount: 4500.0, date: '2026-03-29' },
    { id: 3, title: 'Office Supplies', category: 'Operations', amount: -150.5, date: '2026-03-28' },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Financial Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time stats and account summary.</p>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Balance"
          amount={formatCurrency(summary.totalBalance)}
          trend="+12.4%"
          trendLabel="vs last month"
        />
        <StatsCard
          title="Total Income"
          amount={formatCurrency(summary.totalIncome)}
          trend="+8.1%"
          trendLabel="vs last month"
        />
        <StatsCard
          title="Total Expenses"
          amount={formatCurrency(summary.totalExpenses)}
          trend="-3.2%"
          trendLabel="vs last month"
        />
        <StatsCard
          title="Net Savings"
          amount={formatCurrency(summary.savings)}
          trend="+15.0%"
          trendLabel="vs last month"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Table Placeholder */}
        <Card title="Recent Transactions" className="lg:col-span-2">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{tx.title}</p>
                  <span className="text-xs text-slate-400">{tx.category} • {tx.date}</span>
                </div>
                <span className={`text-sm font-semibold ${tx.amount > 0 ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-100'}`}>
                  {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Expense Breakdown Card */}
        <Card title="Budget Health Overview">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-400">Engineering & Tech</span>
                <span className="text-slate-900 dark:text-slate-100">75%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-400">Marketing & Sales</span>
                <span className="text-slate-900 dark:text-slate-100">42%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};