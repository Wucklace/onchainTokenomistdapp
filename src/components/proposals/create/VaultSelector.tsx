'use client';

import { Badge } from '@/components/ui';
import { type VaultSummary } from '@/types';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

interface VaultSelectorProps {
  summaries: VaultSummary[];
  selectedVaultId: bigint | null;
  onSelect: (id: bigint) => void;
}

export function VaultSelector({
  summaries,
  selectedVaultId,
  onSelect,
}: VaultSelectorProps) {
  if (summaries.length === 0) {
    return (
      <p className="text-xs font-mono text-white/20 py-4">
        No team vaults found — proposals require at least one admin.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {summaries.map((v) => {
        const adminMode =
          v.admin1 !== ZERO_ADDRESS && v.admin2 !== ZERO_ADDRESS
            ? 'Team'
            : 'One Admin';

        return (
          <button
            key={v.vaultId.toString()}
            onClick={() => onSelect(v.vaultId)}
            className={`flex items-center justify-between px-4 py-3 rounded-sm border text-left transition-all duration-200 ${
              selectedVaultId === v.vaultId
                ? 'border-[#15c6e6c0]/50 bg-[rgba(21,198,230,0.08)]'
                : 'border-white/10 bg-white/3 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-white/70">
                Vault #{v.vaultId.toString()}
              </span>
              <span className="text-[10px] font-mono text-white/30">
                {v.categoryCount.toString()} categories · {v.totalPassesMinted.toString()} minted
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="neonBlue" size="sm">{adminMode}</Badge>
              {selectedVaultId === v.vaultId && (
                <span className="text-[10px] font-mono text-[#15c6e6c0]">Selected ✓</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}