import { type HTMLAttributes, forwardRef } from 'react';

type CardVariant = 'default' | 'neonBlue' | 'neonOrange' | 'ghost';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hoverable?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default: `
    bg-[#1A1A1A] border border-white/8
    shadow-[0_4px_24px_rgba(0,0,0,0.4)]
  `,
  neonBlue: `
    bg-[#1A1A1A] border border-[#15c6e6c0]/20
    shadow-[0_4px_24px_rgba(0,0,0,0.4),0_0_40px_rgba(21,198,230,0.05)]
  `,
  neonOrange: `
    bg-[#1A1A1A] border border-[#fa7e09cb]/20
    shadow-[0_4px_24px_rgba(0,0,0,0.4),0_0_40px_rgba(250,126,9,0.05)]
  `,
  ghost: `
    bg-white/3 border border-white/5
  `,
};

const hoverStyles: Record<CardVariant, string> = {
  default: 'hover:border-white/15 hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)]',
  neonBlue: 'hover:border-[#15c6e6c0]/40 hover:shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_60px_rgba(21,198,230,0.1)]',
  neonOrange: 'hover:border-[#fa7e09cb]/40 hover:shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_60px_rgba(250,126,9,0.1)]',
  ghost: 'hover:border-white/10 hover:bg-white/5',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      hoverable = false,
      fullWidth = false,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          rounded-sm p-5
          ${variantStyles[variant]}
          ${hoverable ? `cursor-pointer transition-all duration-300 ${hoverStyles[variant]}` : ''}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';