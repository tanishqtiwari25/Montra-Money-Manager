import React from 'react';

export const Card = ({ title, children, className = '' }) => {
  return (
    <div className={`p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm ${className}`}>
      {title && <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">{title}</h3>}
      {children}
    </div>
  );
};

export const StatsCard = ({ title, amount, trend, trendLabel }) => {
  return (
    <Card>
      <p className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">{title}</p>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{amount}</span>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            trend.startsWith('+') 
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
          }`}>
            {trend}
          </span>
        )}
      </div>
      {trendLabel && <p className="mt-1 text-xs text-slate-400">{trendLabel}</p>}
    </Card>
  );
};