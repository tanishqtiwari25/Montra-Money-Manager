import type { RequestOptions } from '@shared/api';
export interface Loan {
  id: string; name: string; lender: string; principalPaise: number; outstandingPaise: number;
  annualInterestRate: number; emiPaise: number; nextDueDate: string; remainingMonths: number;
  status: 'active' | 'paid'; paymentAccountId: string;
}
export interface LoanApi { list: (options?: RequestOptions) => Promise<Loan[]>; get: (id: string, options?: RequestOptions) => Promise<Loan> }
