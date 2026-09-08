import React, { useState } from 'react';
import { useAccounts } from '../../hooks/useAccounts';
import { accountsApi } from '../../services/accounts.api';
import { AccountCard } from '../../components/accounts/AccountCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

export const Accounts = () => {
  const { accounts, loading, error, refetch } = useAccounts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: '1',
    initialBalance: '',
    billingDate: '',
    dueDate: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '1',
      initialBalance: '',
      billingDate: '',
      dueDate: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await accountsApi.createAccount({
        name: formData.name,
        type: Number(formData.type),
        initialBalance: Number(formData.initialBalance) || 0,
        billingDate: Number(formData.billingDate) || 0,
        dueDate: Number(formData.dueDate) || 0,
      });

      setIsModalOpen(false);
      resetForm();
      await refetch();
    } catch (err) {
      alert(err?.message || 'Failed to create account.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id || !window.confirm('Are you sure you want to delete this account?')) {
      return;
    }

    try {
      await accountsApi.deleteAccount(id);
      await refetch();
    } catch (err) {
      alert(err?.message || 'Failed to delete account.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Accounts
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your financial accounts and balances.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)}>
          + Add Account
        </Button>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : accounts.length === 0 ? (
        <EmptyState
          title="No accounts found"
          description="Create your first account to start tracking your money."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <AccountCard
              key={account.id || account._id}
              account={{
                ...account,
                id: account.id || account._id,
                balance:
                  account.balance ??
                  account.currentBalance ??
                  account.initialBalance ??
                  0,
              }}
              onEdit={() => alert('Account update API is not available in the provided Swagger endpoints.')}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Account"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Account Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. HDFC Salary Account"
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
              Account Type
            </label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-sm focus:outline-none"
            >
              <option value="1">Type 1</option>
              <option value="2">Type 2</option>
              <option value="3">Type 3</option>
              <option value="4">Type 4</option>
            </select>
          </div>

          <Input
            label="Initial Balance"
            type="number"
            name="initialBalance"
            value={formData.initialBalance}
            onChange={handleChange}
            placeholder="0.00"
            required
          />

          <Input
            label="Billing Date"
            type="number"
            name="billingDate"
            value={formData.billingDate}
            onChange={handleChange}
            placeholder="0"
          />

          <Input
            label="Due Date"
            type="number"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            placeholder="0"
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" isLoading={submitting}>
              Create Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Accounts;
