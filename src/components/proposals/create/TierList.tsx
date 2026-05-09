'use client';

import { useState } from 'react';
import { Spinner } from '@/components/ui';
import { MerkleVerifier } from '@/components/merkle/MerkleVerifier';
import { useCategoryTierDetails } from '@/hooks';
import { formatBytes32 } from '@/utils/format';

// ─── Single tier row ──────────────────────────────────────────────────────────

function TierRow({
  tier,
  remainingSupply,
  merkleRoot,
  onComputed,
  disabled,
  error,
}: {
  tier: `0x${string}`;
  remainingSupply: bigint;
  merkleRoot: `0x${string}` | null;
  onComputed: (tier: `0x${string}`, root: `0x${string}`, recipients: `0x${string}`[]) => void;
  disabled: boolean;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-3 p-3 bg-white/3 border border-white/5 rounded-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#fa7e09cb] uppercase">
            {formatBytes32(tier)}
          </span>
          <span className="text-[10px] font-mono text-white/30">
            {remainingSupply.toString()} passes remaining
          </span>
        </div>
        {merkleRoot && (
          <span className="text-[10px] font-mono text-emerald-400">✅ Ready</span>
        )}
      </div>

      <MerkleVerifier
        mode="compute"
        onComputed={(root, recipients) => onComputed(tier, root, recipients)}
        disabled={disabled}
        label={`Recipient addresses — max ${remainingSupply.toString()}`}
      />

      {merkleRoot && (
        <div className="flex flex-col gap-1 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-sm">
          <p className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/70">
            Merkle Root — will be stored on-chain
          </p>
          <p className="text-[10px] font-mono text-emerald-400/60 break-all">
            {merkleRoot}
          </p>
        </div>
      )}

      {error && (
        <p className="text-xs font-mono text-red-400">{error}</p>
      )}
    </div>
  );
}

// ─── Tier List ────────────────────────────────────────────────────────────────

interface TierListProps {
  vaultId: bigint;
  category: `0x${string}`;
  tierRoots: Record<string, `0x${string}` | null>;
  tierErrors: Record<string, string | undefined>;
  onComputed: (tier: `0x${string}`, root: `0x${string}`, recipients: `0x${string}`[]) => void;
  onSelectionChange: (selectedTiers: `0x${string}`[]) => void;
  disabled: boolean;
}

export function TierList({
  vaultId,
  category,
  tierRoots,
  tierErrors,
  onComputed,
  onSelectionChange,
  disabled,
}: TierListProps) {
  const { tiers, isLoading } = useCategoryTierDetails(vaultId, category);
  const [selectedTiers, setSelectedTiers] = useState<Set<string>>(new Set());

  const availableTiers = tiers.filter((t) => t.remainingSupply > 0n);
  const allSelected =
    availableTiers.length > 0 &&
    availableTiers.every((t) => selectedTiers.has(t.tier));

  const toggleTier = (tier: `0x${string}`) => {
    const key = tier.toString();
    const next = new Set(selectedTiers);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    setSelectedTiers(next);
    onSelectionChange(
      availableTiers
        .filter((t) => next.has(t.tier.toString()))
        .map((t) => t.tier)
    );
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelectedTiers(new Set());
      onSelectionChange([]);
    } else {
      const all = new Set(availableTiers.map((t) => t.tier.toString()));
      setSelectedTiers(all);
      onSelectionChange(availableTiers.map((t) => t.tier));
    }
  };

  if (isLoading) return <Spinner size="sm" />;

  if (availableTiers.length === 0) {
    return (
      <p className="text-xs font-mono text-white/20 py-2">
        All tiers in this category are fully minted.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Select All toggle */}
      <div className="flex items-center justify-between px-1">
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
          {selectedTiers.size} of {availableTiers.length} tier
          {availableTiers.length !== 1 ? 's' : ''} selected
        </p>
        <button
          onClick={toggleAll}
          disabled={disabled}
          className="text-[10px] font-mono uppercase tracking-widest text-[#15c6e6c0]/70 hover:text-[#15c6e6c0] transition-colors duration-200 disabled:opacity-40"
        >
          {allSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      {/* Tier checkboxes */}
      <div className="flex flex-col gap-2">
        {availableTiers.map((t) => {
          const key = t.tier.toString();
          const isSelected = selectedTiers.has(key);

          return (
            <div key={key} className="flex flex-col gap-0">
              {/* Tier selector row */}
              <button
                onClick={() => toggleTier(t.tier)}
                disabled={disabled}
                className={`flex items-center justify-between px-3 py-2.5 border text-left transition-all duration-200 disabled:opacity-40
                  ${isSelected
                    ? 'border-[#15c6e6c0]/40 bg-[rgba(21,198,230,0.06)] rounded-t-sm'
                    : 'border-white/10 bg-white/3 hover:border-white/20 rounded-sm'
                  }`}
              >
                <div className="flex items-center gap-3">
                  {/* Checkbox indicator */}
                  <span
                    className={`w-3.5 h-3.5 rounded-[2px] border flex items-center justify-center flex-shrink-0 transition-all duration-200
                      ${isSelected
                        ? 'border-[#15c6e6c0] bg-[rgba(21,198,230,0.2)]'
                        : 'border-white/20 bg-transparent'
                      }`}
                  >
                    {isSelected && (
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path
                          d="M1 4L3 6L7 2"
                          stroke="#15c6e6"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span className="text-xs font-mono text-[#fa7e09cb] uppercase">
                    {formatBytes32(t.tier)}
                  </span>
                  <span className="text-[10px] font-mono text-white/30">
                    {t.remainingSupply.toString()} passes remaining
                  </span>
                </div>
                {tierRoots[key] && (
                  <span className="text-[10px] font-mono text-emerald-400">
                    ✅ Ready
                  </span>
                )}
              </button>

              {/* Expanded tier form */}
              {isSelected && (
                <div className="border border-t-0 border-[#15c6e6c0]/20 bg-[rgba(21,198,230,0.03)] rounded-b-sm">
                  <TierRow
                    tier={t.tier}
                    remainingSupply={t.remainingSupply}
                    merkleRoot={tierRoots[key] ?? null}
                    onComputed={onComputed}
                    disabled={disabled}
                    error={tierErrors[key]}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}