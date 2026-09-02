import { useState, useEffect, useCallback } from 'react';
import { categoriesApi } from '../services/categories.api';
import { budgetsApi } from '../services/budgets.api';

export const useBudgets = (month = new Date().getMonth() + 1, year = new Date().getFullYear()) => {
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [catRes, budgetRes] = await Promise.all([
        categoriesApi.getCategories(),
        budgetsApi.getBudgets(month, year),
      ]);

      setCategories(catRes?.data || catRes || []);
      setBudgets(budgetRes?.data || budgetRes || []);
    } catch (err) {
      setError(err?.message || 'Failed to fetch categories or budgets.');
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { categories, budgets, loading, error, refetch: fetchData };
};

export default useBudgets;