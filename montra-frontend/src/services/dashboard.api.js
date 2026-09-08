import apiClient from './api.js';

export const dashboardApi = {
  getDashboard: async () => {
    return await apiClient.get('/api/Transaction/dashboard');
  },
};

export default dashboardApi;
