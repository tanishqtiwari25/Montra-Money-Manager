import { CURRENCIES, DEFAULT_CURRENCY } from '../constants/currencies';

export const formatCurrency = (amount, currencyCode = DEFAULT_CURRENCY) => {
  const numericAmount = Number(amount) || 0;
  const currencyObj = CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0];

  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyObj.code,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch (err) {
    return `${currencyObj.symbol}${numericAmount.toFixed(2)}`;
  }
};