import { useState, useEffect } from 'react';
import { THEMES } from '../constants/theme';
import { config } from '../config/config';
import { storage } from '../utils/storage';

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    return storage.get(config.storageKeys.THEME) || THEMES.SYSTEM;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === THEMES.SYSTEM) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    storage.set(config.storageKeys.THEME, theme);
  }, [theme]);

  return { theme, setTheme };
};