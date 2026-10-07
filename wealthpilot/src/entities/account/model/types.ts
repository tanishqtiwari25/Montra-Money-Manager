import type { RequestOptions } from '@shared/api';
export type AccountType = 'bank' | 'wallet' | 'cash' | 'investment';
export interface Account { id: string; name: string; institution: string; type: AccountType; balancePaise: number; lastFour?: string; color: string }
export interface AccountApi { list: (options?: RequestOptions) => Promise<Account[]>; get: (id: string, options?: RequestOptions) => Promise<Account> }
