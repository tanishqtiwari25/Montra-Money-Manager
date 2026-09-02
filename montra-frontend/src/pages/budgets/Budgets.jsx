import React, { useState } from 'react';
import { useBudgets } from '../../hooks/useBudgets';
import { budgetsApi } from '../../services/budgets.api';
import { BudgetCard } from '../../components/budgets/BudgetCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

export const Budgets = () => {
  const currentDate = new Date();
  const [selectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear] = useState(currentDate.getFullYear());

  const { categories, budgets, loading, error, refetch } = useBudgets(selectedMonth, selectedYear);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    categoryId: '',
    limit: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await budgetsApi.setBudget({
        categoryId: formData.categoryId,
        limit: parseFloat(formData.limit) || 0,
        month: selectedMonth,
        year: selectedYear,
      });
      setIsModalOpen(false);
      setFormData({ categoryId: '', limit: '' });
      refetch();
    } catch (err) {
      alert(err?.message || 'Failed to update budget limit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Budgets</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Set monthly spending targets for your expense categories.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Set Category Budget</Button>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : categories.length === 0 ? (
        <EmptyState title="No categories found" description="Create expense categories first to configure budget limits." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const categoryBudget = budgets.find((b) => b.categoryId === category.id);
            return <BudgetCard key={category.id} category={category} budget={categoryBudget} />;
          })}
        </div>
      )}

      {/* Set Budget Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Set Budget Limit">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
              Select Category
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={(e) => setFormData((p) => ({ ...p, categoryId: e.target.value }))}
              required
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="">Choose Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Monthly Limit Amount"
            type="number"
            value={formData.limit}
            onChange={(e) => setFormData((p) => ({ ...p, limit: e.target.value }))}
            placeholder="e.g. 15000"
            required
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Save Budget Target
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};