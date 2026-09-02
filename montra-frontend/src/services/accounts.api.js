import apiClient from './api';

export const accountsApi = {
  getAccounts: async () => {
    return await apiClient.get('/accounts');
  },

  getAccountById: async (id) => {
    return await apiClient.get(`/accounts/${id}`);
  },

  createAccount: async (payload) => {
    // Expected contract: { name, type, balance, accountNumber }
    return await apiClient.post('/accounts', payload);
  },

  updateAccount: async (id, payload) => {
    return await apiClient.put(`/accounts/${id}`, payload);
  },

  deleteAccount: async (id) => {
    return await apiClient.delete(`/accounts/${id}`);
  },
};