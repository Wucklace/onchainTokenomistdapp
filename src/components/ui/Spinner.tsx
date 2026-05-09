type SpinnerSize = 'sm' | 'md' | 'lg';
type SpinnerVariant = 'neonBlue' | 'neonOrange' | 'white';

interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  label?: string;
}

const sizeStyles: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-[3px]',
};

const variantStyles: Record<SpinnerVariant, string> = {
  neonBlue: 'border-[#15c6e6c0]/20 border-t-[#15c6e6c0]',
  neonOrange: 'border-[#fa7e09cb]/20 border-t-[#fa7e09cb]',
  white: 'border-white/20 border-t-white/80',
};

export function Spinner({
  size = 'md',
  variant = 'neonBlue',
  label,
}: SpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`
          rounded-full animate-spin
          ${sizeStyles[size]}
          ${variantStyles[variant]}
        `}
        role="status"
        aria-label={label ?? 'Loading'}
      />
      {label && (
        <p className="text-xs font-mono uppercase tracking-widest text-white/30">
          {label}
        </p>
      )}
    </div>
  );
}