'use client';

import { type TierDetails } from '@/types';
import { formatAmount, formatBytes32 } from '@/utils/format';
import { Spinner } from '@/components/ui';
import { useCategoryTierDetails } from '@/hooks';

export function CategoryTierTable({
  vaultId,
  category,
}: {
  vaultId: bigint;
  category: `0x${string}`;
}) {
  const { tiers, isLoading } = useCategoryTierDetails(vaultId, category);

  if (isLoading) return <Spinner size="sm" />;
  if (!tiers || tiers.length === 0) return null;

  return (
    <div className="flex flex-col gap-0 border border-white/5 rounded-sm overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-4 gap-3 px-4 py-2 bg-white/5">
        {['Tier', 'Per Pass', 'Supply', 'Minted'].map((h) => (
          <p key={h} className="text-[10px] font-mono uppercase tracking-widest text-white/25">
            {h}
          </p>
        ))}
      </div>

      {/* Rows */}
      {tiers.map((tier: TierDetails) => (
        <div
          key={tier.tier}
          className="grid grid-cols-4 gap-3 px-4 py-3 border-t border-white/5 hover:bg-white/2 transition-colors"
        >
          <p className="text-xs font-mono text-[#fa7e09cb] uppercase tracking-widest">
            {formatBytes32(tier.tier)}
          </p>
          <p className="text-xs font-mono text-white/60">
            {formatAmount(tier.allocationPerPass)}
          </p>
          <p className="text-xs font-mono text-white/40">
            {tier.maxSupply.toString()}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-xs font-mono text-[#15c6e6c0]">
              {tier.mintedCount.toString()}
            </p>
            {tier.remainingSupply > 0n && (
              <p className="text-[10px] font-mono text-white/25">
                / {tier.remainingSupply.toString()} left
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}