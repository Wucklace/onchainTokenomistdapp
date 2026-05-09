'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { useVaultSummary } from '@/hooks';
import { formatAddress, formatAmount, formatBlocksRemaining } from '@/utils/format';

interface VaultCardProps {
  vaultId: bigint;
  onClick?: () => void;
}

export function VaultCard({ vaultId, onClick }: VaultCardProps) {
  const { summary, isLoading, isError } = useVaultSummary(vaultId);

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center min-h-[120px]">
        <Spinner size="sm" />
      </Card>
    );
  }

  if (isError || !summary) {
    return (
      <Card className="flex items-center justify-center min-h-[120px]">
        <p className="text-xs font-mono text-red-400">Failed to load vault</p>
      </Card>
    );
  }

  return (
    <Card
      variant="neonBlue"
      hoverable={!!onClick}
      onClick={onClick}
      fullWidth
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono uppercase tracking-widest text-white/40">
          Vault #{vaultId.toString()}
        </span>
        <Badge variant={summary.finalized ? 'success' : 'neonBlue'} dot>
          {summary.finalized ? 'Finalized' : 'Active'}
        </Badge>
      </div>

      {/* Token Address */}
      <div className="mb-4">
        <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">
          Token
        </p>
        <p className="text-sm font-mono text-[#15c6e6c0]">
          {formatAddress(summary.tokenAddress)}
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/3 border border-white/5 rounded-sm p-3">
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">
            Deposited
          </p>
          <p className="text-sm font-mono text-white/80">
            {formatAmount(summary.totalDeposited)}
          </p>
        </div>
        <div className="bg-white/3 border border-white/5 rounded-sm p-3">
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">
            Start In
          </p>
          <p className="text-sm font-mono text-white/80">
            {formatBlocksRemaining(summary.startBlock)}
          </p>
        </div>
      </div>

      {/* Creator */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">
          Creator
        </p>
        <p className="text-xs font-mono text-white/50">
          {formatAddress(summary.creator)}
        </p>
      </div>
    </Card>
  );
}