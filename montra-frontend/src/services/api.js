import axios from 'axios';
import { config } from '../config/config';
import { storage } from '../utils/storage';

// 1. Axios Instance Setup
const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000, // 10 seconds timeout
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
    // Directly return response payload data
    return response.data;
  },
  (error) => {
    const status = error.response ? error.response.status : null;

    // Handle 401 Unauthorized (Expired or invalid token)
    if (status === 401) {
      storage.remove(config.storageKeys.AUTH_TOKEN);
      storage.remove(config.storageKeys.USER_DATA);

      // Redirect to login if user is not already on login or register page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
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