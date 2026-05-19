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
  // Token claim progress: how much of the total allocation has been claimed
  const claimPct =
    allocation.totalAllocation > 0n
      ? Number((allocation.totalClaimed * 100n) / allocation.totalAllocation)
      : 0;

  // Pass minting progress: how many passes have been minted out of total supply
  const totalPassSupply = allocation.totalMinted + allocation.remainingPasses;
  const mintPct =
    totalPassSupply > 0n
      ? Number((allocation.totalMinted * 100n) / totalPassSupply)
      : 0;

  // When vesting is enabled, the more meaningful progress is token claiming.
  // When no vesting, pass minting == token distribution, so either works.
  const progressPct = allocation.vestingEnabled ? claimPct : mintPct;
  const progressLabel = allocation.vestingEnabled
    ? `${claimPct}% claimed`
    : `${mintPct}% distributed`;

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
              {' '}/ {totalPassSupply.toString()}
            </span>
          </p>
        </div>
      </div>

      {/* Progress Bar — tracks token claiming when vesting, pass minting otherwise */}
      <div className="flex flex-col gap-1">
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#15c6e6c0] rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-[10px] font-mono text-white/25">
          {progressLabel}
        </p>
      </div>

      {/* Tier Table */}
      <CategoryTierTable vaultId={vaultId} category={allocation.category} />
    </div>
  );
}