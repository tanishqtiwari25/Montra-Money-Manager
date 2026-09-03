import axios from 'axios';
import { config } from '../config/config';
import { storage } from '../utils/storage';

// 1. Axios Instance Setup
const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 60000, // Cold start handling ke liye 60 sec
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 2. Request Interceptor: Automatically attach JWT Token
apiClient.interceptors.request.use(
  (reqConfig) => {
    const token = storage.get(config.storageKeys.AUTH_TOKEN);

    if (token) {
      reqConfig.headers.Authorization = `Bearer ${token}`;
    }

    return reqConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor: Handle API Success & Global Errors
apiClient.interceptors.response.use(
  (response) => {
    // Explicitly return data object
    return response.data !== undefined ? response.data : response;
  },
  (error) => {
    const status = error.response ? error.response.status : null;

    // Handle 401 Unauthorized
    if (status === 401) {
      storage.remove(config.storageKeys.AUTH_TOKEN);
      storage.remove(config.storageKeys.USER_DATA);

      const currentPath = window.location.pathname.toLowerCase();
      // Added '/signup' to prevent reload on auth pages
      if (!currentPath.includes('/login') && !currentPath.includes('/signup') && !currentPath.includes('/register')) {
        window.location.href = '/login';
      }
    }

    // Handle 403 Forbidden
    if (status === 403) {
      console.error('Access Denied: You do not have permission to perform this action.');
    }

    // Handle 500 Internal Server Error
    if (status >= 500) {
      console.error('Server Error: Please try again later.');
    }

    // Standardized error payload formatting
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong. Please try again.';

    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;