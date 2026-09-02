import apiClient from './api';

export const budgetsApi = {
  getBudgets: async (month, year) => {
    return await apiClient.get('/budgets', { params: { month, year } });
  },

  setBudget: async (payload) => {
    // Payload contract: { categoryId, limit, month, year }
    return await apiClient.post('/budgets', payload);
  },

  deleteBudget: async (id) => {
    return await apiClient.delete(`/budgets/${id}`);
  },
};