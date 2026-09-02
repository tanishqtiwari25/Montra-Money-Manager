import { useState, useEffect, useCallback } from 'react';
import { transactionsApi } from '../services/transactions.api';

export const useTransactions = (initialFilters = {}) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [filters, setFilters] = useState(initialFilters);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await transactionsApi.getTransactions({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });

      // API Data Adaptation Layer
      setTransactions(response?.data || response?.items || response || []);
      setPagination((prev) => ({
        ...prev,
        total: response?.meta?.total || response?.total || 0,
      }));
    } catch (err) {
      setError(err?.message || 'Failed to fetch transactions.');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    pagination,
    setPagination,
    filters,
    setFilters,
    refetch: fetchTransactions,
  };
};

export default useTransactions;