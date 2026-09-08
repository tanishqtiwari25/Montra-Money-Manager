import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatCurrency } from '../../utils/currencyFormatter';

const typeIcons = {
  CASH: '💵',
  BANK: '🏦',
  SAVINGS: '🪙',
  CREDIT_CARD: '💳',
  WALLET: '📱',
};

export const AccountCard = ({ account, onEdit, onDelete }) => {
  const { name, type, balance, accountNumber } = account;

  return (
    <Card className="relative overflow-hidden transition-all hover:border-slate-300 dark:hover:border-slate-700">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
            {typeIcons[type] || '💰'}
          </span>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              {name}
            </h3>

            {accountNumber && (
              <p className="text-xs text-slate-400 font-mono">
                •••• {accountNumber.slice(-4)}
              </p>
            )}
          </div>
        </div>

        <Badge variant="neutral">{type}</Badge>
      </div>

      <div className="mt-6 flex items-baseline justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">
            Balance
          </p>

          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {formatCurrency(balance)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(account)}
            className="text-xs text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 font-medium"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(account.id)}
            className="text-xs text-rose-500 hover:text-rose-600 font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </Card>
  );
};