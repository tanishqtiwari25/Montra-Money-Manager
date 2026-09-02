import React from 'react';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils/currencyFormatter';

export const BudgetCard = ({ category, budget }) => {
  const limit = budget?.limit || 0;
  const spent = budget?.spent || 0;
  const percentage = limit > 0 ? Math.min(Math.round((spent / limit) * 100), 100) : 0;
  
  const isOverBudget = spent > limit && limit > 0;

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-xl">
            {category.icon || '🏷️'}
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">{category.name}</h4>
            <p className="text-xs text-slate-400 capitalize">{category.type.toLowerCase()}</p>
          </div>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
          isOverBudget 
            ? 'bg-rose-500/10 text-rose-500' 
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
        }`}>
          {percentage}%
        </span>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Spent: {formatCurrency(spent)}</span>
          <span className="font-medium text-slate-700 dark:text-slate-300">
            Limit: {limit > 0 ? formatCurrency(limit) : 'Not set'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isOverBudget ? 'bg-rose-500' : percentage > 80 ? 'bg-amber-500' : 'bg-brand-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </Card>
  );
};