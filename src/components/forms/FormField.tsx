import { type ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  error,
  hint,
  required = false,
  children,
  className = '',
}: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      <label className="flex items-center gap-1 text-xs font-mono uppercase tracking-widest text-white/50">
        {label}
        {required && (
          <span className="text-[#fa7e09cb]">*</span>
        )}
      </label>

      {children}

      {error && (
        <p className="text-xs font-mono text-red-400 tracking-wide">
          ⚠ {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs font-mono text-white/30 tracking-wide">
          {hint}
        </p>
      )}
    </div>
  );
}