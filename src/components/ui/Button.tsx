import { type ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-transparent border border-[#15c6e6c0] text-[#15c6e6c0]
    hover:bg-[rgba(21,198,230,0.15)] hover:shadow-[0_0_20px_rgba(21,198,230,0.3)]
    active:scale-95 transition-all duration-200
  `,
  secondary: `
    bg-transparent border border-[#fa7e09cb] text-[#fa7e09cb]
    hover:bg-[rgba(250,126,9,0.09)] hover:shadow-[0_0_20px_rgba(250,126,9,0.3)]
    active:scale-95 transition-all duration-200
  `,
  ghost: `
    bg-transparent border border-white/50 text-white/70
    hover:border-white/20 hover:text-white/90 hover:bg-white/5
    active:scale-95 transition-all duration-200
  `,
  danger: `
    bg-transparent border border-red-500/60 text-red-400
    hover:bg-red-500/10 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]
    active:scale-95 transition-all duration-200
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs tracking-wider',
  md: 'px-5 py-2.5 text-sm tracking-wider',
  lg: 'px-7 py-3.5 text-base tracking-wider',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      disabled,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          relative inline-flex items-center justify-center gap-2
          font-mono uppercase rounded-lg cursor-pointer
          disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </span>
        )}
        <span className={isLoading ? 'invisible' : ''}>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';