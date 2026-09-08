import React, { useEffect, useState } from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import { transactionsApi } from '../../services/transactions.api';
import { categoriesApi } from '../../services/categories.api';
import { TransactionForm } from '../../components/forms/TransactionForm';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { formatCurrency } from '../../utils/currencyFormatter';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

export const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [categories, setCategories] = useState([]);
  const [categoryError, setCategoryError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    transactions = [],
    loading,
    error,
    setFilters,
    refetch,
  } = useTransactions();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoriesApi.getCategories();
        const data = response?.data || response?.items || response || [];
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        setCategoryError(err?.message || 'Categories load nahi hui.');
      }
    };

    loadCategories();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilters((prev) => ({
      ...prev,
      search: value || undefined,
    }));
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setSelectedType(value);
    setFilters((prev) => ({
      ...prev,
      type: value === 'ALL' ? undefined : value,
    }));
  };

  const handleCreateTransaction = async (payload) => {
    setSubmitting(true);

    try {
      // Keep the payload close to the fields already used by the project.
      await transactionsApi.createTransaction({
        amount: payload.amount,
        type: payload.type,
        categoryId: payload.categoryId || null,
        date: payload.date,
        description: payload.title,
      });

      setIsModalOpen(false);
      await refetch();
    } catch (err) {
      alert(err?.message || 'Transaction create nahi hui.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id || !window.confirm('Delete this transaction?')) {
      return;
    }

    try {
      await transactionsApi.deleteTransaction(id);
      await refetch();
    } catch (err) {
      alert(err?.message || 'Transaction delete nahi hui.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Transactions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor all incomes and expenses.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)}>
          + Add Transaction
        </Button>
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search by description..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <select
          value={selectedType}
          onChange={handleTypeChange}
          className="px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-200"
        >
          <option value="ALL">All Types</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>
      </div>

      {categoryError && (
        <div className="text-sm text-amber-500">
          {categoryError}
        </div>
      )}

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : transactions.length === 0 ? (
        <EmptyState
          title="No transactions found"
          description="Add your first income or expense."
        />
      ) : (
        <Table headers={['Description', 'Category', 'Date', 'Type', 'Amount', 'Action']}>
          {transactions.map((tx) => {
            const id = tx.id || tx._id;
            const isIncome =
              String(tx.type || '').toUpperCase() === 'INCOME' ||
              Number(tx.amount) > 0;

            return (
              <TableRow key={id}>
                <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                  {tx.description || tx.title || 'Untitled Transaction'}
                </TableCell>

                <TableCell>
                  {tx.category?.name || tx.categoryName || tx.category || 'General'}
                </TableCell>

                <TableCell>
                  {tx.date
                    ? new Date(tx.date).toLocaleDateString()
                    : 'N/A'}
                </TableCell>

                <TableCell>
                  <Badge variant={isIncome ? 'success' : 'danger'}>
                    {isIncome ? 'INCOME' : 'EXPENSE'}
                  </Badge>
                </TableCell>

                <TableCell className={`font-semibold ${
                  isIncome
                    ? 'text-emerald-500'
                    : 'text-slate-900 dark:text-slate-100'
                }`}>
                  {isIncome ? '+' : ''}
                  {formatCurrency(Number(tx.amount) || 0)}
                </TableCell>

                <TableCell>
                  <button
                    onClick={() => handleDelete(id)}
                    className="text-xs text-rose-500 hover:text-rose-600 font-medium"
                  >
                    Delete
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </Table>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Transaction"
      >
        <TransactionForm
          categories={categories}
          onSubmit={handleCreateTransaction}
          submitting={submitting}
        />
      </Modal>
    </div>
  );
};

export default Transactions;
