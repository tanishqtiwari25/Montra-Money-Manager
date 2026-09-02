import apiClient from './api';

export const settingsApi = {
  getProfile: async () => {
    return await apiClient.get('/user/profile');
  },

  updateProfile: async (payload) => {
    // Payload contract: { name, currency, theme }
    return await apiClient.put('/user/profile', payload);
  },
};