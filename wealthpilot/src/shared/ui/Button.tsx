import { forwardRef, type ButtonHTMLAttributes } from 'react';
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; busy?: boolean };
export const Button = forwardRef<HTMLButtonElement, Props>(function Button({ variant = 'primary', busy = false, className = '', disabled, children, type = 'button', ...props }, ref) {
  const colors = { primary: 'bg-indigo text-white hover:bg-indigo-800', secondary: 'border border-line bg-panel text-ink hover:bg-canvas', ghost: 'text-muted hover:bg-canvas hover:text-ink', danger: 'bg-rose-700 text-white hover:bg-rose-800' };
  return <button ref={ref} type={type} disabled={disabled || busy} aria-busy={busy} className={'inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo disabled:cursor-not-allowed disabled:opacity-60 ' + colors[variant] + ' ' + className} {...props}>{busy && <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}{children}</button>;
});
