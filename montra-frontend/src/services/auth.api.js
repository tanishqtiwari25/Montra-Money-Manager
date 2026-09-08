import apiClient from './api.js';

export const authApi = {
  register: async (userData) => {
    return await apiClient.post('/api/Auth/register', userData);
  },

  login: async (credentials) => {
    return await apiClient.post('/api/Auth/login', {
      usernameOrEmail: credentials.email,
      password: credentials.password,
    });
  },
};

export default authApi;