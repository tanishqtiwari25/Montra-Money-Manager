import React, { useState } from 'react';
import { useTransactions } from '@/hooks/useTransactions.js';
import { Table, TableRow, TableCell } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/utils/currencyFormatter';

// Imports aligned for both named & default patterns
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';

export const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');

  const { transactions = [], loading, error, setFilters, refetch } = useTransactions();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setSelectedType(value);
    setFilters((prev) => ({ ...prev, type: value === 'ALL' ? undefined : value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Transactions</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor and audit all workspace incomes and expenses.
          </p>
        </div>
        <Button onClick={() => alert('Modal workflow for creating transactions can be wired here')}>
          + Add Transaction
        </Button>
      </div>

      {/* Control Panel: Search & Filters */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search by description or title..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedType}
            onChange={handleTypeChange}
            className="px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="ALL">All Types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : transactions.length === 0 ? (
        <EmptyState
          title="No transactions found"
          description="Try modifying your search criteria or add a new transaction."
        />
      ) : (
        <Table headers={['Description', 'Category', 'Date', 'Type', 'Amount']}>
          {transactions.map((tx) => {
            const isIncome = tx.type === 'INCOME' || tx.amount > 0;
            return (
              <TableRow key={tx.id || tx._id}>
                <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                  {tx.description || tx.title || 'Untitled Transaction'}
                </TableCell>
                <TableCell>{tx.category || 'General'}</TableCell>
                <TableCell>{tx.date ? new Date(tx.date).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant={isIncome ? 'success' : 'danger'}>
                    {isIncome ? 'INCOME' : 'EXPENSE'}
                  </Badge>
                </TableCell>
                <TableCell className={`font-semibold ${isIncome ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-100'}`}>
                  {isIncome ? '+' : ''}{formatCurrency(tx.amount)}
                </TableCell>
              </TableRow>
            );
          })}
        </Table>
      )}
    </div>
  );
};

export default Transactions;