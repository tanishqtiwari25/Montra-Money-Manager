import type { Loan } from './types';
export function activeLoanOutstanding(loans: readonly Loan[]): number { return loans.filter(loan => loan.status === 'active').reduce((sum, loan) => sum + loan.outstandingPaise, 0); }
export function monthlyEmi(loans: readonly Loan[]): number { return loans.filter(loan => loan.status === 'active').reduce((sum, loan) => sum + loan.emiPaise, 0); }
export function loanPayoffProgress(loan: Loan): number { return loan.principalPaise > 0 ? Math.max(0, Math.min(100, (1 - loan.outstandingPaise / loan.principalPaise) * 100)) : 100; }
