import { mockCollection, mockRequest, requireRecord } from '@shared/api';
import type { Loan, LoanApi } from '../model/types';
const db = mockCollection<Loan>('loans', () => [{ id: 'personal-loan', name: 'Personal loan', lender: 'HDFC Bank', principalPaise: 20000000, outstandingPaise: 10000000, annualInterestRate: 12.5, emiPaise: 580000, nextDueDate: '2026-11-07', remainingMonths: 20, status: 'active', paymentAccountId: 'hdfc' }]);
export const loanApi: LoanApi = { list: options => mockRequest(() => db.read(), options), get: (id, options) => mockRequest(() => requireRecord(db.read(), id), options) };
