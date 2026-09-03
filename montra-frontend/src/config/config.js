export const config = {
  // Backend API URL (agar .env me nahi milta toh default fallback use karega)
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://montra-apis-w8pd.onrender.com ',
  
  // App settings
  appName: import.meta.env.VITE_APP_NAME || 'Finance Tracker',
  defaultCurrency: import.meta.env.VITE_DEFAULT_CURRENCY || 'INR',
  
  // LocalStorage keys (pure app me standard keys use karne ke liye)
  storageKeys: {
    AUTH_TOKEN: 'ft_auth_token',
    USER_DATA: 'ft_user_data',
    THEME: 'ft_theme_preference',
    CURRENCY: 'ft_selected_currency',
  },
};