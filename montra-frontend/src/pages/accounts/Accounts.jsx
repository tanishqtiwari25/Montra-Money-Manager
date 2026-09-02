import React from 'react';

// Named Export add kiya hai (AppRoutes error fix karne ke liye)
export const Accounts = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Accounts</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Manage your connected bank accounts and wallets.
      </p>
    </div>
  );
};

export default Accounts;