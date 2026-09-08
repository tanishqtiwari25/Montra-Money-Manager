import apiClient from './api.js';

export const categoriesApi = {
  // GET /api/Category
  getCategories: async (type = '') => {
    return await apiClient.get('/api/Category', {
      params: type ? { type } : {},
    });
  },

  // POST /api/Category
  createCategory: async (categoryData) => {
    return await apiClient.post(
      '/api/Category',
      categoryData
    );
  },

  // DELETE /api/Category/{id}
  deleteCategory: async (id) => {
    return await apiClient.delete(
      `/api/Category/${id}`
    );
  },

  // POST /api/Category/subcategory
  createSubCategory: async (subCategoryData) => {
    return await apiClient.post(
      '/api/Category/subcategory',
      subCategoryData
    );
  },

  // DELETE /api/Category/subcategory/{subCategoryId}
  deleteSubCategory: async (subCategoryId) => {
    return await apiClient.delete(
      `/api/Category/subcategory/${subCategoryId}`
    );
  },
};

export default categoriesApi;