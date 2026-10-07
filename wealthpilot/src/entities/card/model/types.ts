import type { RequestOptions } from '@shared/api';
export interface PaymentCard {
  id: string; accountId: string; name: string; issuer: string; network: 'Visa' | 'Mastercard';
  type: 'credit' | 'debit'; lastFour: string; gradient: string;
  balancePaise: number; limitPaise?: number; duePaise?: number; dueDate?: string;
}
export interface CardApi { list: (options?: RequestOptions) => Promise<PaymentCard[]>; get: (id: string, options?: RequestOptions) => Promise<PaymentCard> }
