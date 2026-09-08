import apiClient from './api.js';

export const accountsApi = {
  getAccounts: async () => {
    return await apiClient.get('/api/Accounts');
  },

  createAccount: async (accountData) => {
    return await apiClient.post('/api/Accounts', accountData);
  },

  deleteAccount: async (id) => {
    return await apiClient.delete(`/api/Accounts/${id}`);
  },
};

export default accountsApi;
