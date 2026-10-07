import { forwardRef, useId, type SelectHTMLAttributes } from 'react';
export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string }>(function Select({ label, error, id, children, className = '', ...props }, ref) {
  const generated = useId(); const fieldId = id ?? generated;
  return <div className="space-y-1.5"><label htmlFor={fieldId} className="block text-sm font-medium text-ink">{label}</label><select ref={ref} id={fieldId} aria-invalid={Boolean(error)} aria-describedby={error ? fieldId + '-error' : undefined} className={'min-h-11 w-full rounded-control border border-line bg-panel px-3 text-sm text-ink focus:border-indigo focus:outline-none focus:ring-2 focus:ring-indigo/20 ' + className} {...props}>{children}</select>{error && <p id={fieldId + '-error'} className="text-sm text-[var(--negative)]">{error}</p>}</div>;
});
