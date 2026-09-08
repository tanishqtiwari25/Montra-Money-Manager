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

/*
|--------------------------------------------------------------------------
| REQUEST INTERCEPTOR
|--------------------------------------------------------------------------
| Har API request ke saath automatically:
| 1. JWT Token
| 2. Tenant ID
| 3. User ID
| attach honge.
*/

apiClient.interceptors.request.use(
  (reqConfig) => {
    const token = storage.get(
      config.storageKeys.AUTH_TOKEN
    );

    const tenantId = storage.get(
      config.storageKeys.TENANT_ID
    );

    const userId = storage.get(
      config.storageKeys.USER_ID
    );

    // JWT Authentication
    if (token) {
      reqConfig.headers.Authorization = `Bearer ${token}`;
    }

    // Tenant ID
    if (tenantId) {
      reqConfig.headers['X-Tenant-Id'] = tenantId;
    }

    // User ID
    if (userId) {
      reqConfig.headers['X-User-Id'] = userId;
    }

    return reqConfig;
  },

  (error) => {
    return Promise.reject(error);
  }
);


/*
|--------------------------------------------------------------------------
| RESPONSE INTERCEPTOR
|--------------------------------------------------------------------------
| Successful response me directly response.data return karega.
| Isliye services me response.data likhne ki zarurat nahi hogi.
*/

apiClient.interceptors.response.use(
  (response) => {
    return response.data !== undefined
      ? response.data
      : response;
  },

  (error) => {
    const status = error.response?.status;

    /*
    |--------------------------------------------------------------------------
    | 401 - Unauthorized
    |--------------------------------------------------------------------------
    */

    if (status === 401) {
      storage.remove(
        config.storageKeys.AUTH_TOKEN
      );

      storage.remove(
        config.storageKeys.USER_DATA
      );

      storage.remove(
        config.storageKeys.TENANT_ID
      );

      storage.remove(
        config.storageKeys.USER_ID
      );

      const currentPath =
        window.location.pathname.toLowerCase();

      /*
      | Login / Signup page par redirect loop avoid karna
      */

      if (
        !currentPath.includes('/login') &&
        !currentPath.includes('/signup') &&
        !currentPath.includes('/register')
      ) {
        window.location.href =
          `${import.meta.env.BASE_URL}login`;
      }
    }


    /*
    |--------------------------------------------------------------------------
    | 403 - Forbidden
    |--------------------------------------------------------------------------
    */

    if (status === 403) {
      console.error(
        'Access Denied: You do not have permission to perform this action.'
      );
    }


    /*
    |--------------------------------------------------------------------------
    | 404 - Not Found
    |--------------------------------------------------------------------------
    */

    if (status === 404) {
      console.error(
        'API Error: Requested resource was not found.'
      );
    }


    /*
    |--------------------------------------------------------------------------
    | 500+ - Server Error
    |--------------------------------------------------------------------------
    */

    if (status >= 500) {
      console.error(
        'Server Error: Please try again later.'
      );
    }


    /*
    |--------------------------------------------------------------------------
    | Error Message
    |--------------------------------------------------------------------------
    */

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong. Please try again.';


    return Promise.reject(
      new Error(errorMessage)
    );
  }
);


export default apiClient;