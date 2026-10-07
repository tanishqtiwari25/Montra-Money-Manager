import { z } from 'zod';
export function isDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + 'T00:00:00Z');
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export const calendarDateSchema = z.string().refine(isDateOnly, 'Choose a valid calendar date.');
export const rupeeAmountSchema = z.number({ invalid_type_error: 'Enter a valid amount.' }).finite().positive('Amount must be greater than zero.').max(999999999.99, 'Amount is too large.').refine(value => value === Number(value.toFixed(2)), 'Use up to two decimal places.');
export const nonNegativeRupeeSchema = z.number({ invalid_type_error: 'Enter a valid amount.' }).finite().min(0, 'Amount cannot be negative.').max(999999999.99, 'Amount is too large.').refine(value => value === Number(value.toFixed(2)), 'Use up to two decimal places.');
