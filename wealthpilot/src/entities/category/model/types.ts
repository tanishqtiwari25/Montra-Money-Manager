import type { RequestOptions } from '@shared/api';
export interface Category { id: string; name: string; color: string; icon: string }
export interface CategoryApi { list: (options?: RequestOptions) => Promise<Category[]> }
