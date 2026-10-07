import type { Page, PageQuery, RequestOptions } from '@shared/api';
export type TransactionType = 'income' | 'expense' | 'transfer';
export interface Transaction {
  id: string; amountPaise: number; type: TransactionType; categoryId: string;
  date: string; note: string; paymentMethodId: string; tags: string[];
  destinationAccountId?: string;
}
export type TransactionInput = Omit<Transaction, 'id'>;
export interface TransactionQuery extends PageQuery {
  search?: string; from?: string; to?: string; categoryId?: string;
  paymentMethodId?: string; type?: TransactionType; minPaise?: number; maxPaise?: number;
  sort?: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';
}
export interface TransactionApi {
  list: (query?: TransactionQuery, options?: RequestOptions) => Promise<Page<Transaction>>;
  get: (id: string, options?: RequestOptions) => Promise<Transaction>;
  create: (input: TransactionInput, options?: RequestOptions) => Promise<Transaction>;
  update: (id: string, input: TransactionInput, options?: RequestOptions) => Promise<Transaction>;
  remove: (id: string, options?: RequestOptions) => Promise<{ id: string }>;
}
