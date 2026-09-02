import React, { useState, useEffect } from 'react';
import { reportsApi } from '../../services/reports.api';
import { Card } from '../../components/ui/Card';
import { formatCurrency } from '../../utils/currencyFormatter';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';

export const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);

  const fetchReportsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumRes, catRes] = await Promise.all([
        reportsApi.getSummary('month'),
        reportsApi.getCategoryBreakdown('EXPENSE'),
      ]);
      setSummary(sumRes?.data || sumRes || {});
      setCategoryData(catRes?.data || catRes || []);
    } catch (err) {
      setError(err?.message || 'Reports data load karne me issue aaya.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} onRetry={fetchReportsData} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Financial Reports</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Detailed income, expense breakdowns aur analytics velocity tracking.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Total Income</p>
          <p className="text-2xl font-bold text-emerald-500 mt-2">
            {formatCurrency(summary?.totalIncome || 0)}
          </p>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Total Expense</p>
          <p className="text-2xl font-bold text-rose-500 mt-2">
            {formatCurrency(summary?.totalExpense || 0)}
          </p>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Net Savings</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
            {formatCurrency((summary?.totalIncome || 0) - (summary?.totalExpense || 0))}
          </p>
        </Card>
      </div>

      {/* Expense Category Breakdown */}
      <Card className="space-y-4">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Category Expense Distribution</h3>
        <div className="space-y-3">
          {categoryData.length === 0 ? (
            <p className="text-sm text-slate-400">Is period me koi expenses recorded nahi hain.</p>
          ) : (
            categoryData.map((item) => (
              <div key={item.id || item.categoryName} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{item.categoryName || 'General'}</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(item.amount)}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full"
                    style={{ width: `${Math.min(item.percentage || 0, 100)}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};