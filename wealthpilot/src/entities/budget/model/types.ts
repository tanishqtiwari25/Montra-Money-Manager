import type { RequestOptions } from '@shared/api';
export interface Budget { id: string; categoryId: string; month: string; limitPaise: number }
export interface BudgetInput { limitPaise: number }
export interface BudgetApi { list: (month?: string, options?: RequestOptions) => Promise<Budget[]>; update: (id: string, input: BudgetInput, options?: RequestOptions) => Promise<Budget> }
