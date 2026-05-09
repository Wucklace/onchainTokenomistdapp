import { type InputHTMLAttributes, forwardRef } from 'react';

type InputVariant = 'default' | 'neonBlue' | 'neonOrange';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  variant?: InputVariant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<InputVariant, string> = {
  default: `
    border-white/10 bg-white/5 text-white/90
    focus:border-white/30 focus:bg-white/8
  `,
  neonBlue: `
    border-[#15c6e6c0]/30 bg-[rgba(21,198,230,0.05)] text-white/90
    focus:border-[#15c6e6c0] focus:bg-[rgba(21,198,230,0.08)]
    focus:shadow-[0_0_20px_rgba(21,198,230,0.15)]
  `,
  neonOrange: `
    border-[#fa7e09cb]/30 bg-[rgba(250,126,9,0.05)] text-white/90
    focus:border-[#fa7e09cb] focus:bg-[rgba(250,126,9,0.08)]
    focus:shadow-[0_0_20px_rgba(250,126,9,0.15)]
  `,
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      variant = 'default',
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      disabled,
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

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-white/40">{leftIcon}</span>
          )}

          <input
            ref={ref}
            disabled={disabled}
            className={`
              w-full border rounded-sm outline-none
              font-mono text-sm placeholder:text-white/20
              transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed
              ${variantStyles[variant]}
              ${leftIcon ? 'pl-9' : 'pl-3'}
              ${rightIcon ? 'pr-9' : 'pr-3'}
              py-2.5
              ${error ? 'border-red-500/60 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.15)]' : ''}
              ${className}
            `}
            {...props}
          />

          {rightIcon && (
            <span className="absolute right-3 text-white/40">{rightIcon}</span>
          )}
        </div>

        {error && (
          <p className="text-xs font-mono text-red-400 tracking-wide">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs font-mono text-white/30 tracking-wide">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';