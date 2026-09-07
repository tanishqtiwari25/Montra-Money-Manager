import axios from 'axios';
import { config } from '../config/config';
import { storage } from '../utils/storage';

const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Automatically attach authentication headers
apiClient.interceptors.request.use(
  (reqConfig) => {
    const token = storage.get(config.storageKeys.AUTH_TOKEN);
    const tenantId = storage.get(config.storageKeys.TENANT_ID);
    const userId = storage.get(config.storageKeys.USER_ID);

    if (token) {
      reqConfig.headers.Authorization = `Bearer ${token}`;
    }

    if (tenantId) {
      reqConfig.headers['X-Tenant-Id'] = tenantId;
    }

    if (userId) {
      reqConfig.headers['X-User-Id'] = userId;
    }

    return reqConfig;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data !== undefined ? response.data : response;
  },
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      storage.remove(config.storageKeys.AUTH_TOKEN);
      storage.remove(config.storageKeys.USER_DATA);
      storage.remove(config.storageKeys.TENANT_ID);
      storage.remove(config.storageKeys.USER_ID);

      const currentPath = window.location.pathname.toLowerCase();

      if (
        !currentPath.includes('/login') &&
        !currentPath.includes('/signup') &&
        !currentPath.includes('/register')
      ) {
        window.location.href = `${import.meta.env.BASE_URL}login`;
      }
    }

    if (status === 403) {
      console.error(
        'Access Denied: You do not have permission to perform this action.'
      );
    }

    if (status >= 500) {
      console.error('Server Error: Please try again later.');
    }

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong. Please try again.';

    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;