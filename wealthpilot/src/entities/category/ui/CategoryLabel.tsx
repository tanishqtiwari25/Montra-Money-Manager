import type { Category } from '../model/types';
export function CategoryLabel({ category }: { category: Category }) { return <span className="inline-flex items-center gap-2 text-sm text-ink"><span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: category.color }} />{category.name}</span>; }
