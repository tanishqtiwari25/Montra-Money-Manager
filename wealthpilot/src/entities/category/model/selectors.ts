import type { Category } from './types';
export function categoryName(categories: readonly Category[], id: string): string { return categories.find(category => category.id === id)?.name ?? 'Other'; }
