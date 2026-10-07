import { z } from 'zod';
import { calendarDateSchema, rupeeAmountSchema, rupeesToPaise } from '@shared/lib';
import type { Transaction, TransactionInput } from './types';
export const transactionFormSchema = z.object({
  amount: rupeeAmountSchema,
  type: z.enum(['income', 'expense', 'transfer']),
  categoryId: z.string().min(1, 'Choose a category.'),
  date: calendarDateSchema,
  note: z.string().trim().min(1, 'Add a short note.').max(200),
  paymentMethodId: z.string().min(1, 'Choose an account or card.'),
  tags: z.string().max(200).refine(value => {
    const tags = value.split(',').map(tag => tag.trim()).filter(Boolean);
    return tags.length <= 8 && tags.every(tag => tag.length <= 24);
  }, 'Use up to eight comma-separated tags, each at most 24 characters.'),
  destinationAccountId: z.string().optional(),
}).superRefine((value, context) => {
  if (value.type !== 'transfer') return;
  const source = value.paymentMethodId === 'hdfc-debit' ? 'hdfc' : value.paymentMethodId === 'icici-debit' ? 'icici' : value.paymentMethodId;
  if (!value.destinationAccountId || value.destinationAccountId === source) context.addIssue({ code: 'custom', path: ['destinationAccountId'], message: 'Choose a different destination account.' });
  if (value.paymentMethodId.includes('credit')) context.addIssue({ code: 'custom', path: ['paymentMethodId'], message: 'Choose a bank, wallet, cash or debit account for transfers.' });
});
export type TransactionFormValues = z.infer<typeof transactionFormSchema>;
export function transactionToForm(transaction: Transaction): TransactionFormValues {
  return { amount: transaction.amountPaise / 100, type: transaction.type, categoryId: transaction.categoryId, date: transaction.date, note: transaction.note, paymentMethodId: transaction.paymentMethodId, tags: transaction.tags.join(', '), destinationAccountId: transaction.destinationAccountId ?? '' };
}
export function transactionFormToInput(value: TransactionFormValues): TransactionInput {
  return { amountPaise: rupeesToPaise(value.amount), type: value.type, categoryId: value.categoryId, date: value.date, note: value.note.trim(), paymentMethodId: value.paymentMethodId, tags: value.tags.split(',').map(tag => tag.trim()).filter(Boolean), ...(value.type === 'transfer' ? { destinationAccountId: value.destinationAccountId } : {}) };
}
