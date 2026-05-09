'use client';

import { useEffect, useCallback, type ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  closeOnOverlay?: boolean;
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlay = true,
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={closeOnOverlay ? onClose : undefined}
      />

      {/* Modal */}
      <div
        className={`
          relative w-full ${sizeStyles[size]}
          bg-[#1A1A1A] border border-white/10
          rounded-sm shadow-[0_24px_64px_rgba(0,0,0,0.8)]
          animate-in fade-in zoom-in-95 duration-200
          flex flex-col max-h-[90vh]
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {/* Header — fixed, never scrolls */}
        {title && (
          <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-white/8">
            <h2
              id="modal-title"
              className="text-sm font-mono uppercase tracking-widest text-white/80"
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-white/30 hover:text-white/70 transition-colors duration-200 font-mono text-lg leading-none"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        )}

        {/* Content — scrollable */}
        <div className="overflow-y-auto overscroll-contain p-5 scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20 hover:scrollbar-thumb-white/40">
          {children}
        </div>
      </div>
    </div>
  );
}