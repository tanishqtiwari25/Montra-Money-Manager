import { forwardRef, useId, type InputHTMLAttributes } from 'react';
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }>(function Input({ label, error, id, className = '', ...props }, ref) {
  const generated = useId(); const fieldId = id ?? generated;
  return <div className="space-y-1.5"><label className="block text-sm font-medium text-ink" htmlFor={fieldId}>{label}</label><input ref={ref} id={fieldId} aria-invalid={Boolean(error)} aria-describedby={error ? fieldId + '-error' : undefined} className={'min-h-11 w-full rounded-control border border-line bg-panel px-3 text-sm text-ink outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/20 ' + className} {...props} />{error && <p id={fieldId + '-error'} className="text-sm text-[var(--negative)]">{error}</p>}</div>;
});
