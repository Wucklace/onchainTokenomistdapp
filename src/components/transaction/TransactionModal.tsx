'use client';

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
}

export function TransactionModal({
  isOpen,
  onClose,
  title = 'Confirm Transaction',
  description,
  onConfirm,
  confirmLabel = 'Confirm',
  isLoading,
}: TransactionModalProps) {
  const { hash, isPending, isConfirming, isConfirmed, isError, error, reset } =
    useTxStore();

  const handleClose = () => {
    if (!isPending && !isConfirming) {
      reset();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      closeOnOverlay={!isPending && !isConfirming}
    >
      <div className="flex flex-col gap-5">
        {/* Description */}
        {description && !isConfirmed && !isError && (
          <p className="text-sm font-mono text-white/50">{description}</p>
        )}

        {/* Tx Status */}
        <TxStatus
          hash={hash}
          isPending={isPending}
          isConfirming={isConfirming}
          isConfirmed={isConfirmed}
          isError={isError}
          error={error}
        />

        {/* Success Message */}
        {isConfirmed && (
          <p className="text-sm font-mono text-emerald-400">
            ✓ Transaction completed successfully
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/5">
          {isConfirmed || isError ? (
            <Button variant="ghost" onClick={handleClose}>
              Close
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={handleClose}
                disabled={isPending || isConfirming}
              >
                Cancel
              </Button>
              {onConfirm && !isPending && !isConfirming && (
                <Button
                  variant="primary"
                  onClick={onConfirm}
                  isLoading={isLoading}
                >
                  {confirmLabel}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}