import type { ReactNode } from 'react';
export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'positive' | 'negative' | 'warning' | 'brand' }) {
  const style = { neutral: 'bg-canvas text-muted', positive: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200', negative: 'bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-200', warning: 'bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-200', brand: 'bg-indigo-50 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200' };
  return <span className={'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ' + style[tone]}>{children}</span>;
}
