import axios from 'axios';
import { config } from '../config/config';
import { storage } from '../utils/storage';

const accountsApiClient = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

accountsApiClient.interceptors.request.use((request) => {
  const token = storage.get(config.storageKeys.AUTH_TOKEN);

  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});

export const accountsApi = {
  getAccounts: async (tenantId, userId) => {
    const response = await accountsApiClient.get('/api/Accounts', {
      headers: {
        'X-Tenant-Id': tenantId,
        'X-User-Id': userId,
      },
    });

    return response.data;
  },

  createAccount: async (tenantId, userId, accountData) => {
    const response = await accountsApiClient.post(
      '/api/Accounts',
      accountData,
      {
        headers: {
          'X-Tenant-Id': tenantId,
          'X-User-Id': userId,
        },
      }
    );

    return response.data;
  },

  deleteAccount: async (tenantId, userId, id) => {
    const response = await accountsApiClient.delete(
      `/api/Accounts/${id}`,
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