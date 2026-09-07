import axios from 'axios';
import { config } from '../config/config';
import { storage } from '../utils/storage';

const categoryApiClient = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

categoryApiClient.interceptors.request.use((request) => {
  const token = storage.get(config.storageKeys.AUTH_TOKEN);

  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});

export const categoryApi = {
  // GET /api/Category
  getCategories: async (tenantId, userId, type = '') => {
    const response = await categoryApiClient.get('/api/Category', {
      params: type ? { type } : {},
      headers: {
        'X-Tenant-Id': tenantId,
        'X-User-Id': userId,
      },
    });

    return response.data;
  },

  // POST /api/Category
  createCategory: async (tenantId, userId, categoryData) => {
    const response = await categoryApiClient.post(
      '/api/Category',
      categoryData,
      {
        headers: {
          'X-Tenant-Id': tenantId,
          'X-User-Id': userId,
        },
      }
    );

    return response.data;
  },

  // DELETE /api/Category/{id}
  deleteCategory: async (tenantId, userId, id) => {
    const response = await categoryApiClient.delete(
      `/api/Category/${id}`,
      {
        headers: {
          'X-Tenant-Id': tenantId,
          'X-User-Id': userId,
        },
      }
    );

    return response.data;
  },

  // POST /api/Category/subcategory
  createSubCategory: async (
    tenantId,
    userId,
    subCategoryData
  ) => {
    const response = await categoryApiClient.post(
      '/api/Category/subcategory',
      subCategoryData,
      {
        headers: {
          'X-Tenant-Id': tenantId,
          'X-User-Id': userId,
        },
      }
    );

    return response.data;
  },

  // DELETE /api/Category/subcategory/{subCategoryId}
  deleteSubCategory: async (
    tenantId,
    userId,
    subCategoryId
  ) => {
    const response = await categoryApiClient.delete(
      `/api/Category/subcategory/${subCategoryId}`,
      {
        headers: {
          'X-Tenant-Id': tenantId,
          'X-User-Id': userId,
        },
      }
    );

    return response.data;
  },
};

export default categoryApi;