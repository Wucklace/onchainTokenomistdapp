'use client';

import { useState, useRef, type ReactNode } from 'react';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: string;
  position?: TooltipPosition;
  children: ReactNode;
}

const positionStyles: Record<TooltipPosition, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const arrowStyles: Record<TooltipPosition, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-[#2a2a2a] border-x-transparent border-b-transparent',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[#2a2a2a] border-x-transparent border-t-transparent',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-[#2a2a2a] border-y-transparent border-r-transparent',
  right: 'right-full top-1/2 -translate-y-1/2 border-r-[#2a2a2a] border-y-transparent border-l-transparent',
};

export function Tooltip({
  content,
  position = 'top',
  children,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), 300);
  };

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}

      {visible && (
        <div
          className={`
            absolute z-50 whitespace-nowrap
            ${positionStyles[position]}
          `}
          role="tooltip"
        >
          <div
            className="
              px-3 py-1.5 rounded-sm
              bg-[#2a2a2a] border border-white/10
              text-xs font-mono text-white/70 tracking-wide
              shadow-[0_4px_16px_rgba(0,0,0,0.6)]
            "
          >
            {content}
          </div>
          <div
            className={`
              absolute w-0 h-0 border-4
              ${arrowStyles[position]}
            `}
          />
        </div>
      )}
    </div>
  );
}