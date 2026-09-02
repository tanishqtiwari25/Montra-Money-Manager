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
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">{name}</h3>
            {accountNumber && (
              <p className="text-xs text-slate-400 font-mono">•••• {accountNumber.slice(-4)}</p>
            )}
          </div>
        </div>
        <Badge variant="neutral">{type}</Badge>
      </div>

      <div className="mt-6 flex items-baseline justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Balance</p>
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



// A N O T H E R


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
    type: 'BANK',
    balance: '',
    accountNumber: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await accountsApi.createAccount({
        ...formData,
        balance: parseFloat(formData.balance) || 0,
      });
      setIsModalOpen(false);
      setFormData({ name: '', type: 'BANK', balance: '', accountNumber: '' });
      refetch();
    } catch (err) {
      alert(err?.message || 'Failed to save account');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this account?')) {
      try {
        await accountsApi.deleteAccount(id);
        refetch();
      } catch (err) {
        alert(err?.message || 'Delete failed');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Accounts</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your liquid assets, bank accounts, and credit cards.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Add Account</Button>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : accounts.length === 0 ? (
        <EmptyState
          title="No accounts linked"
          description="Create your first financial account to begin tracking balances."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((acc) => (
            <AccountCard
              key={acc.id}
              account={acc}
              onEdit={() => alert('Edit view modal hook')}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add Account Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Account">
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
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="BANK">Bank Account</option>
              <option value="CASH">Cash</option>
              <option value="SAVINGS">Savings</option>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="WALLET">Digital Wallet</option>
            </select>
          </div>
          <Input
            label="Initial Balance"
            type="number"
            name="balance"
            value={formData.balance}
            onChange={handleChange}
            placeholder="0.00"
            required
          />
          <Input
            label="Account Number (Optional)"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            placeholder="e.g. 1234567890"
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Save Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};