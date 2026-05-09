'use client';

import { formatAmount, formatBytes32 } from '@/utils/format';
import { Badge } from '@/components/ui';
import { CategoryTierTable } from './CategoryTierTable';
import { type CategoryAllocation } from '@/types';

export function CategoryAllocationCard({
  vaultId,
  allocation,
}: {
  vaultId: bigint;
  allocation: CategoryAllocation;
}) {
  const mintedPct =
    allocation.totalMinted > 0n && allocation.totalAllocation > 0n
      ? Number((allocation.totalMinted * 10000n) / BigInt(allocation.tierCount === 0n ? 1 : 1)) 
      : 0;

  const progressPct =
    allocation.remainingPasses + allocation.totalMinted > 0n
      ? Number((allocation.totalMinted * 100n) / (allocation.totalMinted + allocation.remainingPasses))
      : 0;

  return (
    <div className="bg-white/3 border border-white/5 rounded-sm p-4 flex flex-col gap-4">
      {/* Category Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-mono uppercase tracking-widest text-[#15c6e6c0]">
          {formatBytes32(allocation.category)}
        </span>
        <div className="flex items-center gap-2">
          {allocation.vestingEnabled && (
            <Badge variant="neonBlue" size="sm">Vesting</Badge>
          )}
          {allocation.finalized && (
            <Badge variant="success" size="sm">Finalized</Badge>
          )}
        </div>
      </div>

      {/* Allocation Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/25 mb-1">
            Total Allocation
          </p>
          <p className="text-sm font-mono text-white/70">
            {formatAmount(allocation.totalAllocation)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/25 mb-1">
            Claimed
          </p>
          <p className="text-sm font-mono text-emerald-400">
            {formatAmount(allocation.totalClaimed)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/25 mb-1">
            Passes
          </p>
          <p className="text-sm font-mono text-[#fa7e09cb]">
            {allocation.totalMinted.toString()}
            <span className="text-white/25 text-xs">
              {' '}/ {(allocation.totalMinted + allocation.remainingPasses).toString()}
            </span>
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-1">
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#15c6e6c0] rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-[10px] font-mono text-white/25">
          {progressPct}% distributed
        </p>
      </div>

      {/* Tier Table */}
      <CategoryTierTable vaultId={vaultId} category={allocation.category} />
    </div>
  );
}