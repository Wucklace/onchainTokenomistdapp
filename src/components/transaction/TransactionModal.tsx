'use client';

import { useEffect } from 'react';
import { BaseError, UserRejectedRequestError } from 'viem';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { TxStatus } from './TxStatus';
import { useTxStore } from '@/store';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  onConfirm?: () => void;
  confirmLabel?: string;
  isLoading?: boolean;
  isNavigating?: boolean;
}

export function TransactionModal({
  isOpen,
  onClose,
  title = 'Confirm Transaction',
  description,
  onConfirm,
  confirmLabel = 'Confirm',
  isLoading,
  isNavigating = false, // ← new
}: TransactionModalProps) {
  const { hash, isPending, isConfirming, isConfirmed, isError, error, reset } =
    useTxStore();

  const handleClose = () => {
    if (!isPending && !isConfirming && !isNavigating) { // ← block during nav
      reset();
      onClose();
    }
  };

  // Auto-close 2s after confirmed — but not if navigating
  useEffect(() => {
    if (!isConfirmed || isNavigating) return; // ← block during nav
    const timer = setTimeout(() => handleClose(), 2000);
    return () => clearTimeout(timer);
  }, [isConfirmed, isNavigating]);

  // Auto-close 500ms after user rejects
  useEffect(() => {
    if (!isError) return;
    const isRejected =
      error instanceof BaseError &&
      !!error.walk(e => e instanceof UserRejectedRequestError);
    if (!isRejected) return;
    const timer = setTimeout(() => handleClose(), 500);
    return () => clearTimeout(timer);
  }, [isError, error]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnOverlay={!isPending && !isConfirming && !isNavigating}
    >
      <div className="flex flex-col bg-[#1A1A1A] border border-white/10 rounded-sm">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <p className="text-sm font-mono text-white/70 uppercase tracking-wider">{title}</p>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-5 p-4">
          {description && !isConfirmed && !isError && (
            <p className="text-sm font-mono text-white/50">{description}</p>
          )}

          <TxStatus
            hash={hash}
            isPending={isPending}
            isConfirming={isConfirming}
            isConfirmed={isConfirmed}
            isError={isError}
            error={error}
          />

          {/* Navigating state — replaces the "closing in 2s" message */}
          {isConfirmed && isNavigating && (
            <div className="flex items-center gap-3">
              <div className="h-3.5 w-3.5 animate-spin rounded-full border border-[#15c6e6c0] border-t-transparent" />
              <p className="text-sm font-mono text-[#15c6e6c0]">
                Redirecting to vault...
              </p>
            </div>
          )}

          {isConfirmed && !isNavigating && (
            <p className="text-sm font-mono text-emerald-400">
              ✓ Transaction successful.
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/5">
            {isConfirmed || isError ? (
              <Button variant="ghost" onClick={handleClose} disabled={isNavigating}>
                Close
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={handleClose} disabled={isPending || isConfirming}>
                  Cancel
                </Button>
                {onConfirm && !isPending && !isConfirming && (
                  <Button variant="primary" onClick={onConfirm} isLoading={isLoading}>
                    {confirmLabel}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}