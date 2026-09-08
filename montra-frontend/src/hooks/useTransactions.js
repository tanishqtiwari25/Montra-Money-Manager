import { useState, useEffect, useCallback } from 'react';
import { transactionsApi } from '../services/transactions.api';

export const useTransactions = (initialFilters = {}) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await transactionsApi.getTransactions(filters);

      const data =
        response?.data ||
        response?.items ||
        response?.transactions ||
        response ||
        [];

      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || 'Failed to fetch transactions.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    filters,
    setFilters,
    refetch: fetchTransactions,
  };
};

export default useTransactions;
