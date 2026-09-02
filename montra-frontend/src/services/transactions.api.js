import apiClient from './api';

export const transactionsApi = {
  getTransactions: async (params = {}) => {
    // Expected query params: { page, limit, search, category, type, startDate, endDate, sortBy, sortOrder }
    return await apiClient.get('/transactions', { params });
  },

  getTransactionById: async (id) => {
    return await apiClient.get(`/transactions/${id}`);
  },

  createTransaction: async (payload) => {
    // Payload contract: { amount, type, categoryId, accountId, date, description }
    return await apiClient.post('/transactions', payload);
  },

  updateTransaction: async (id, payload) => {
    return await apiClient.put(`/transactions/${id}`, payload);
  },

  deleteTransaction: async (id) => {
    return await apiClient.delete(`/transactions/${id}`);
  },
};