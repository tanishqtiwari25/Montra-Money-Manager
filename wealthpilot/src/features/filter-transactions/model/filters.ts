import { z } from 'zod';
import { calendarDateSchema, nonNegativeRupeeSchema, rupeesToPaise } from '@shared/lib';
import type { TransactionQuery } from '@entities/transaction';
export const transactionFilterSchema = z.object({
  search: z.string().max(200), from: z.union([z.literal(''), calendarDateSchema]), to: z.union([z.literal(''), calendarDateSchema]),
  categoryId: z.string(), paymentMethodId: z.string(), type: z.enum(['', 'income', 'expense', 'transfer']),
  min: z.union([z.literal(''), z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter a non-negative amount with up to two decimals.').refine(value => nonNegativeRupeeSchema.safeParse(Number(value)).success, 'Enter a valid minimum.')]),
  max: z.union([z.literal(''), z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter a non-negative amount with up to two decimals.').refine(value => nonNegativeRupeeSchema.safeParse(Number(value)).success, 'Enter a valid maximum.')]),
  sort: z.enum(['date-desc', 'date-asc', 'amount-desc', 'amount-asc']),
}).superRefine((values, context) => {
  if (values.from && values.to && values.from > values.to) context.addIssue({ code: 'custom', path: ['to'], message: 'End date must be on or after the start.' });
  if (values.min && values.max && Number(values.min) > Number(values.max)) context.addIssue({ code: 'custom', path: ['max'], message: 'Maximum must be at least the minimum.' });
});
export type TransactionFilters = z.infer<typeof transactionFilterSchema>;
export const initialTransactionFilters: TransactionFilters = { search: '', from: '', to: '', categoryId: '', paymentMethodId: '', type: '', min: '', max: '', sort: 'date-desc' };
export function filtersToQuery(values: TransactionFilters): TransactionQuery {
  return { search: values.search.trim() || undefined, from: values.from || undefined, to: values.to || undefined, categoryId: values.categoryId || undefined, paymentMethodId: values.paymentMethodId || undefined, type: values.type || undefined, minPaise: values.min === '' ? undefined : rupeesToPaise(Number(values.min)), maxPaise: values.max === '' ? undefined : rupeesToPaise(Number(values.max)), sort: values.sort };
}
