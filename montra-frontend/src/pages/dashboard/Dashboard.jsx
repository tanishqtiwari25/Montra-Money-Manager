import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../../services/dashboard.api';
import { Card, StatsCard } from '../../components/ui/Card';
import { formatCurrency } from '../../utils/currencyFormatter';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';

const pick = (obj, keys, fallback = 0) => {
  for (const key of keys) {
    if (obj?.[key] !== undefined && obj?.[key] !== null) {
      return obj[key];
    }
  }
  return fallback;
};

export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await dashboardApi.getDashboard();
      setData(response?.data || response || {});
    } catch (err) {
      setError(err?.message || 'Dashboard data load nahi hui.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) return <Loader />;
  if (error) {
    return <ErrorState message={error} onRetry={loadDashboard} />;
  }

  const source = data?.data || data || {};

  const totalBalance = pick(
    source,
    ['totalBalance', 'balance', 'currentBalance'],
    0
  );

  const totalIncome = pick(
    source,
    ['totalIncome', 'income'],
    0
  );

  const totalExpenses = pick(
    source,
    ['totalExpenses', 'totalExpense', 'expenses', 'expense'],
    0
  );

  const savings = totalIncome - totalExpenses;

  const recentTransactions =
    source?.recentTransactions ||
    source?.transactions ||
    source?.recentTransaction ||
    [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Financial Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Live financial data from MONTRA backend.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatsCard
            title="Total Balance"
            amount={formatCurrency(Number(totalBalance) || 0)}
          />

          <StatsCard
            title="Total Income"
            amount={formatCurrency(Number(totalIncome) || 0)}
          />

          <StatsCard
            title="Total Expenses"
            amount={formatCurrency(Number(totalExpenses) || 0)}
          />

          <StatsCard
            title="Net Savings"
            amount={formatCurrency(Number(savings) || 0)}
          />
        </div>

        <Card title="Recent Transactions">
          {!Array.isArray(recentTransactions) ||
          recentTransactions.length === 0 ? (
            <p className="text-sm text-slate-400">
              No recent transactions available.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentTransactions.map((tx, index) => {
                const amount = Number(tx.amount) || 0;
                const id = tx.id || tx._id || index;

                return (
                  <div
                    key={id}
                    className="py-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {tx.description || tx.title || 'Transaction'}
                      </p>

                      <span className="text-xs text-slate-400">
                        {tx.category?.name ||
                          tx.categoryName ||
                          tx.category ||
                          'General'}
                        {tx.date
                          ? ` • ${new Date(tx.date).toLocaleDateString()}`
                          : ''}
                      </span>
                    </div>

                    <span
                      className={`text-sm font-semibold ${
                        amount > 0
                          ? 'text-emerald-500'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {amount > 0 ? '+' : ''}
                      {formatCurrency(amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
