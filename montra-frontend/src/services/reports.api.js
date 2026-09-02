import apiClient from './api';

export const reportsApi = {
  getSummary: async (period = 'month') => {
    return await apiClient.get('/reports/summary', { params: { period } });
  },

  getCategoryBreakdown: async (type = 'EXPENSE') => {
    return await apiClient.get('/reports/category-breakdown', { params: { type } });
  },

  getMonthlyTrends: async (year = new Date().getFullYear()) => {
    return await apiClient.get('/reports/monthly-trends', { params: { year } });
  },
};