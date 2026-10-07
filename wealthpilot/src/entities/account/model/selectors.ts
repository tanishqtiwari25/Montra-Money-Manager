import type { Account } from './types';
export function liquidBalance(accounts: readonly Account[]): number { return accounts.filter(account => account.type !== 'investment').reduce((sum, account) => sum + account.balancePaise, 0); }
export function investmentBalance(accounts: readonly Account[]): number { return accounts.filter(account => account.type === 'investment').reduce((sum, account) => sum + account.balancePaise, 0); }
