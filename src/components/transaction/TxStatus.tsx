'use client';

import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { formatTxHash, getTxExplorerUrl } from '@/utils/format';

interface TxStatusProps {
  hash?: `0x${string}`;
  isPending?: boolean;
  isConfirming?: boolean;
  isConfirmed?: boolean;
  isError?: boolean;
  error?: Error | null;
}

export function TxStatus({
  hash,
  isPending,
  isConfirming,
  isConfirmed,
  isError,
  error,
}: TxStatusProps) {
  if (!isPending && !isConfirming && !isConfirmed && !isError) return null;

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Status Badge */}
      <div className="flex items-center gap-3">
        {isPending && (
          <>
            <Spinner size="sm" variant="neonOrange" />
            <Badge variant="neonOrange" dot>
              Awaiting Signature
            </Badge>
          </>
        )}
        {isConfirming && (
          <>
            <Spinner size="sm" variant="neonBlue" />
            <Badge variant="neonBlue" dot>
              Confirming Transaction
            </Badge>
          </>
        )}
        {isConfirmed && (
          <Badge variant="success" dot>
            Transaction Confirmed
          </Badge>
        )}
        {isError && (
          <Badge variant="danger" dot>
            Transaction Failed
          </Badge>
        )}
      </div>

      {/* Tx Hash */}
      {hash && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-white/30">Tx:</span>
          <a
            href={getTxExplorerUrl(hash)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-[#15c6e6c0] hover:underline"
          >
            {formatTxHash(hash)}
          </a>
        </div>
      )}

      {/* Error Message */}
      {isError && error && (
        <p className="text-xs font-mono text-red-400 break-all">
          ⚠ {error.message}
        </p>
      )}
    </div>
  );
}