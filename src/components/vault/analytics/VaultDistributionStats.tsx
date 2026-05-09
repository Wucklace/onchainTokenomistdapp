'use client';

import { formatAmount } from '@/utils/format';
import { type VaultSummary } from '@/types';

export function VaultDistributionStats({ summary }: { summary: VaultSummary }) {
  const unallocated = summary.totalDeposited - summary.totalAllocated;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="bg-white/3 border border-white/5 rounded-sm p-4 flex flex-col gap-3">
        <p className="text-xs font-mono uppercase tracking-widest text-white/30">Deposited</p>
        <p className="text-lg font-mono text-white/60">{formatAmount(summary.totalDeposited)}</p>
      </div>
      <div className="bg-white/3 border border-white/5 rounded-sm p-4 flex flex-col gap-3">
        <p className="text-xs font-mono uppercase tracking-widest text-white/30">Allocated</p>
        <p className="text-lg font-mono text-[#15c6e6c0]">{formatAmount(summary.totalAllocated)}</p>
        {unallocated > 0n && (
          <p className="text-[10px] font-mono text-white/25 -mt-2">
            {formatAmount(unallocated)} unallocated
          </p>
        )}
      </div>
      <div className="bg-white/3 border border-white/5 rounded-sm p-4 flex flex-col gap-3">
        <p className="text-xs font-mono uppercase tracking-widest text-white/30">Claimed</p>
        <p className="text-lg font-mono text-emerald-400">{formatAmount(summary.totalClaimed)}</p>
      </div>
      <div className="bg-white/3 border border-white/5 rounded-sm p-4 flex flex-col gap-3">
        <p className="text-xs font-mono uppercase tracking-widest text-white/30">Remaining</p>
        <p className="text-lg font-mono text-[#fa7e09cb]">
          {formatAmount(summary.totalAllocated - summary.totalClaimed)}
        </p>
      </div>
    </div>
  );
}