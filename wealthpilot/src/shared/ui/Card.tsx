import type { HTMLAttributes, ReactNode } from 'react';
export function Card({ children, className = '', title, action, ...props }: Omit<HTMLAttributes<HTMLElement>, 'title'> & { title?: string; action?: ReactNode }) {
  return <section className={'rounded-card border border-line bg-panel p-5 shadow-card sm:p-6 ' + className} {...props}>{(title || action) && <div className="mb-5 flex items-center justify-between gap-3">{title && <h2 className="text-base font-semibold text-ink">{title}</h2>}{action}</div>}{children}</section>;
}
