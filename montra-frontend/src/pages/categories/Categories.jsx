import React from 'react';

export const Categories = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Categories
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your income and expense categories.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Categories management will be available here.
        </p>
      </div>
    </div>
  );
};

export default Categories;