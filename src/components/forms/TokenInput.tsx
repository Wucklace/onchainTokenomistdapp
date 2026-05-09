'use client';

import { forwardRef, useState } from 'react';
import { type InputHTMLAttributes } from 'react';
import { sanitizeAmount } from '@/utils/sanitize';

interface TokenInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  symbol?: string;
  maxAmount?: string;
  decimals?: number;
  onValidAmount?: (amount: string) => void;
  onMaxClick?: () => void;
  fullWidth?: boolean;
}

export const TokenInput = forwardRef<HTMLInputElement, TokenInputProps>(
  (
    {
      label,
      error,
      hint,
      symbol,
      maxAmount,
      decimals = 18,
      onValidAmount,
      onMaxClick,
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

      const sanitized = sanitizeAmount(value, decimals);
      if (sanitized) {
        setIsValid(true);
        onValidAmount?.(sanitized);
      } else {
        setIsValid(false);
      }
    };

    const borderStyle =
      isValid === true
        ? 'border-emerald-500/60 focus:border-emerald-500 focus:shadow-[0_0_20px_rgba(16,185,129,0.15)]'
        : isValid === false
        ? 'border-red-500/60 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.15)]'
        : 'border-[#fa7e09cb]/30 focus:border-[#fa7e09cb] focus:shadow-[0_0_20px_rgba(250,126,9,0.15)]';

    return (
      <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''}`}>
        {/* Label + Max */}
        <div className="flex items-center justify-between">
          {label && (
            <label className="text-xs font-mono uppercase tracking-widest text-white/50">
              {label}
            </label>
          )}
          {maxAmount && (
            <span className="text-xs font-mono text-white/30">
              Max:{' '}
              <button
                type="button"
                onClick={onMaxClick}
                className="text-[#fa7e09cb] hover:text-[#fa7e09cb]/80 transition-colors duration-200"
              >
                {maxAmount} {symbol}
              </button>
            </span>
          )}
        </div>

        <div className="relative flex items-center">
          <input
            ref={ref}
            type="text"
            inputMode="decimal"
            onChange={handleChange}
            placeholder="0.00"
            className={`
              w-full border rounded-sm outline-none
              bg-[rgba(250,126,9,0.05)] text-white/90
              font-mono text-sm placeholder:text-white/20
              px-3 py-2.5
              transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed
              ${symbol ? 'pr-16' : 'pr-3'}
              ${borderStyle}
              ${error ? 'border-red-500/60' : ''}
              ${className}
            `}
            {...props}
          />

          {symbol && (
            <span className="absolute right-3 text-xs font-mono text-white/40 uppercase">
              {symbol}
            </span>
          )}
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

TokenInput.displayName = 'TokenInput';