'use client';

import { MerkleVerifier } from '@/components/merkle/MerkleVerifier';
import { formatBytes32 } from '@/utils/format';

interface TierVerificationProps {
  tiers: {
    tier: `0x${string}`;
    merkleRoot: `0x${string}`;
    supplyCount: bigint;
  }[];
  verifiedTiers: Record<string, boolean>;
  onVerified: (tierKey: string, matched: boolean) => void;
  readOnly?: boolean;
  disabled?: boolean;
}

export function TierVerification({
  tiers,
  verifiedTiers,
  onVerified,
  readOnly = false,
  disabled = false,
}: TierVerificationProps) {
  if (tiers.length === 0) return null;

  const totalWallets = tiers.reduce((sum, t) => sum + t.supplyCount, 0n);

  if (readOnly) {
    return (
      <div className="flex flex-col gap-2 mb-5">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/30">
            Tiers
          </p>
          <p className="text-[10px] font-mono text-white/30">
            {totalWallets.toString()} total wallets
          </p>
        </div>
        {tiers.map((t) => (
          <div
            key={t.tier}
            className="flex flex-col gap-1 p-3 bg-white/3 border border-white/5 rounded-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#fa7e09cb] uppercase">
                {formatBytes32(t.tier)}
              </span>
              <span className="text-[10px] font-mono text-white/40">
                {t.supplyCount.toString()} wallets
              </span>
            </div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/25 mt-1">
              Merkle Root
            </p>
            <p className="text-[10px] font-mono text-white/40 break-all">{t.merkleRoot}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mb-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-mono uppercase tracking-widest text-white/30">
          Verify recipient list per tier before approving
        </p>
        <p className="text-[10px] font-mono text-white/30">
          {totalWallets.toString()} total wallets
        </p>
      </div>
      {tiers.map((t) => (
        <div
          key={t.tier}
          className="flex flex-col gap-3 p-3 bg-white/3 border border-white/5 rounded-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#fa7e09cb] uppercase">
              {formatBytes32(t.tier)}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-white/40">
                {t.supplyCount.toString()} wallets
              </span>
              {verifiedTiers[t.tier] === true && (
                <span className="text-[10px] font-mono text-emerald-400">✅ Verified</span>
              )}
              {verifiedTiers[t.tier] === false && (
                <span className="text-[10px] font-mono text-red-400">❌ Mismatch</span>
              )}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/25 mb-1">
              Stored Merkle Root
            </p>
            <p className="text-[10px] font-mono text-white/40 break-all">{t.merkleRoot}</p>
          </div>
          <MerkleVerifier
            mode="verify"
            storedRoot={t.merkleRoot}
            onVerified={(matched) => onVerified(t.tier, matched)}
            label="Paste recipient list to verify"
            disabled={disabled}
          />
        </div>
      ))}
    </div>
  );
}