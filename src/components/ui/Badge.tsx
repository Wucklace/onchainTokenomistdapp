import { type HTMLAttributes } from 'react';

type BadgeVariant = 'neonBlue' | 'neonOrange' | 'success' | 'danger' | 'ghost';
type BadgeSize = 'sm' | 'md';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  neonBlue: `
    bg-[rgba(21,198,230,0.15)] border border-[#15c6e6c0]/40
    text-[#15c6e6c0]
  `,
  neonOrange: `
    bg-[rgba(250,126,9,0.09)] border border-[#fa7e09cb]/40
    text-[#fa7e09cb]
  `,
  success: `
    bg-emerald-500/10 border border-emerald-500/30
    text-emerald-400
  `,
  danger: `
    bg-red-500/10 border border-red-500/30
    text-red-400
  `,
  ghost: `
    bg-white/5 border border-white/10
    text-white/50
  `,
};

const dotStyles: Record<BadgeVariant, string> = {
  neonBlue: 'bg-[#15c6e6c0]',
  neonOrange: 'bg-[#fa7e09cb]',
  success: 'bg-emerald-400',
  danger: 'bg-red-400',
  ghost: 'bg-white/40',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
};

export function Badge({
  variant = 'ghost',
  size = 'md',
  dot = false,
  children,
  className = '',
  ...props
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        font-mono uppercase tracking-widest rounded-sm
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full animate-pulse ${dotStyles[variant]}`}
        />
      )}
      {children}
    </span>
  );
}