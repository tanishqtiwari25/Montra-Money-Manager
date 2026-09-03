import apiClient from './api.js';

export const authApi = {
  register: async (userData) => {
    const response = await apiClient.post('/api/Auth/register', userData);
    return response.data || response;
  },

  login: async (credentials) => {
    const response = await apiClient.post('/api/Auth/login', {
      usernameOrEmail: credentials.email,
      password: credentials.password,
    });
    return response.data || response;
  },
};