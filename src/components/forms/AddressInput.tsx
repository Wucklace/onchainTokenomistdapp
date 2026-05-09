'use client';

import { forwardRef, useState } from 'react';
import { type InputHTMLAttributes } from 'react';
import { sanitizeAddress } from '@/utils/sanitize';

interface AddressInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  onValidAddress?: (address: string) => void;
  fullWidth?: boolean;
}

export const AddressInput = forwardRef<HTMLInputElement, AddressInputProps>(
  (
    {
      label,
      error,
      hint,
      onValidAddress,
      fullWidth = false,
      onChange,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isValid, setIsValid] = useState<boolean | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      onChange?.(e);

      if (!value) {
        setIsValid(null);
        return;
      }

      const sanitized = sanitizeAddress(value);
      if (sanitized) {
        setIsValid(true);
        onValidAddress?.(sanitized);
      } else {
        setIsValid(false);
      }
    };

    const borderStyle =
      isValid === true
        ? 'border-emerald-500/60 focus:border-emerald-500 focus:shadow-[0_0_20px_rgba(16,185,129,0.15)]'
        : isValid === false
        ? 'border-red-500/60 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.15)]'
        : 'border-[#15c6e6c0]/30 focus:border-[#15c6e6c0] focus:shadow-[0_0_20px_rgba(21,198,230,0.15)]';

    return (
      <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="text-xs font-mono uppercase tracking-widest text-white/50">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          <input
            ref={ref}
            onChange={handleChange}
            placeholder="0x..."
            className={`
              w-full border rounded-sm outline-none
              bg-[rgba(21,198,230,0.05)] text-white/90
              font-mono text-sm placeholder:text-white/20
              px-3 py-2.5 pr-9
              transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed
              ${borderStyle}
              ${error ? 'border-red-500/60' : ''}
              ${className}
            `}
            {...props}
          />

          {/* Validation indicator */}
          <span className="absolute right-3 text-sm">
            {isValid === true && <span className="text-emerald-400">✓</span>}
            {isValid === false && <span className="text-red-400">✗</span>}
          </span>
        </div>

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

AddressInput.displayName = 'AddressInput';