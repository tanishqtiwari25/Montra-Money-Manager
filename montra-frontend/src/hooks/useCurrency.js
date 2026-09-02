import { useState, useEffect } from 'react';
import { DEFAULT_CURRENCY } from '../constants/currencies';
import { config } from '../config/config';
import { storage } from '../utils/storage';

export const useCurrency = () => {
  const [currency, setCurrency] = useState(() => {
    return storage.get(config.storageKeys.CURRENCY) || DEFAULT_CURRENCY;
  });

  useEffect(() => {
    storage.set(config.storageKeys.CURRENCY, currency);
  }, [currency]);

  return { currency, setCurrency };
};