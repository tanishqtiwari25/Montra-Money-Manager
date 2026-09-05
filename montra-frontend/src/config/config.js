// Clean URL helper function
const getCleanUrl = (url) => {
  if (!url) return '';
  return url.replace(/\s+/g, '').replace(/\/+$/, '');
};

const rawApiUrl = import.meta.env.VITE_API_BASE_URL || 'https://montra-apis-w8pd.onrender.com';

export const config = {
  // Pure string se sabhi spaces aur trailing slashes automatically clean ho jayenge
  apiBaseUrl: getCleanUrl(rawApiUrl),
  
  // App settings
  appName: import.meta.env.VITE_APP_NAME || 'Finance Tracker',
  defaultCurrency: import.meta.env.VITE_DEFAULT_CURRENCY || 'INR',
  
  // LocalStorage keys
  storageKeys: {
    AUTH_TOKEN: 'ft_auth_token',
    USER_DATA: 'ft_user_data',
    THEME: 'ft_theme_preference',
    CURRENCY: 'ft_selected_currency',
  },
};