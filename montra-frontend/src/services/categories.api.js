import apiClient from './api';

export const categoriesApi = {
  getCategories: async () => {
    return await apiClient.get('/categories');
  },

  createCategory: async (payload) => {
    // Payload contract: { name, type, color, icon }
    return await apiClient.post('/categories', payload);
  },

  deleteCategory: async (id) => {
    return await apiClient.delete(`/categories/${id}`);
  },
};