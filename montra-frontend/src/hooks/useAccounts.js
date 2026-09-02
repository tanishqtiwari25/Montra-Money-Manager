import { useState, useEffect, useCallback } from 'react';
import { accountsApi } from '../services/accounts.api';

export const useAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await accountsApi.getAccounts();
      setAccounts(response?.data || response || []);
    } catch (err) {
      setError(err?.message || 'Failed to fetch account list.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return {
    accounts,
    loading,
    error,
    refetch: fetchAccounts,
  };
};