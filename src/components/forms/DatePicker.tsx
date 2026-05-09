'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';

interface DatePickerProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      label,
      error,
      hint,
      fullWidth = false,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="text-xs font-mono uppercase tracking-widest text-white/50">
            {label}
          </label>
        )}

        <input
          ref={ref}
          type="datetime-local"
          className={`
            w-full border rounded-sm outline-none
            bg-[rgba(21,198,230,0.05)] text-white/90
            border-[#15c6e6c0]/30
            font-mono text-sm
            px-3 py-2.5
            transition-all duration-200
            focus:border-[#15c6e6c0] focus:shadow-[0_0_20px_rgba(21,198,230,0.15)]
            disabled:opacity-40 disabled:cursor-not-allowed
            [color-scheme:dark]
            ${error ? 'border-red-500/60 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />

        {error && (
          <p className="text-xs font-mono text-red-400 tracking-wide">⚠ {error}</p>
        )}
        {hint && !error && (
          <p className="text-xs font-mono text-white/30 tracking-wide">{hint}</p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';