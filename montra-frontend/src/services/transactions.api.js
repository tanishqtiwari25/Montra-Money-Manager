import apiClient from './api.js';

export const transactionsApi = {
  // GET /api/Transaction
  getTransactions: async (params = {}) => {
    return await apiClient.get('/api/Transaction', {
      params,
    });
  },

  // POST /api/Transaction
  createTransaction: async (transactionData) => {
    return await apiClient.post(
      '/api/Transaction',
      transactionData
    );
  },

  // DELETE /api/Transaction/{id}
  deleteTransaction: async (id) => {
    return await apiClient.delete(
      `/api/Transaction/${id}`
    );
  },

  // GET /api/Transaction/dashboard
  getDashboard: async () => {
    return await apiClient.get(
      '/api/Transaction/dashboard'
    );
  },
};

export default transactionsApi;
