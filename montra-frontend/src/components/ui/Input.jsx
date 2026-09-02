import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  type = 'text',
  className = '',
  id,
  required = false,
  ...props
}, ref) => {
  const inputId = id || props.name;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold tracking-wide uppercase text-slate-600 dark:text-slate-400">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        className={`w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border text-slate-900 dark:text-slate-100 rounded-lg text-sm transition-colors duration-150 focus:outline-none focus:ring-2 ${
          error
            ? 'border-rose-500 focus:ring-rose-500/20'
            : 'border-slate-300 dark:border-slate-800 focus:border-brand-500 focus:ring-brand-500/20'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-rose-500">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';