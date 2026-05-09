'use client';

import Link from 'next/link';
import { useAccount, useBlockNumber } from 'wagmi';
import { useMemo, useState } from 'react';
import { type UserPassInfo } from '@/types';
import { formatAmount, formatBlockToDate, formatBytes32 } from '@/utils/format';
import { Card, Badge, Button, Spinner } from '@/components/ui';
import { useUserPasses, useTokensByOwner, useClaim } from '@/hooks';
import { TransactionModal } from '@/components/transaction/TransactionModal';

// ─── Pass Card ────────────────────────────────────────────────────────────────

function PassCard({ pass }: { pass: UserPassInfo }) {
  const claimPct =
    pass.allocation > 0n
      ? Number((pass.claimed * 100n) / pass.allocation)
      : 0;

  const vestedPct =
    pass.allocation > 0n
      ? Number((pass.vested * 100n) / pass.allocation)
      : 0;

  const { data: currentBlock } = useBlockNumber();

  return (
    <div className="flex flex-col gap-4 bg-white/3 border border-white/5 rounded-sm p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href={`/vaults/${pass.vaultId.toString()}`}
            className="text-xs font-mono text-white/30 hover:text-[#15c6e6c0] uppercase tracking-widest transition-colors duration-200"
          >
            Vault #{pass.vaultId.toString()}
          </Link>
          <span className="text-white/10 font-mono">/</span>
          <span className="text-xs font-mono text-[#15c6e6c0] uppercase tracking-widest">
            {formatBytes32(pass.category)}
          </span>
          <span className="text-white/10 font-mono">/</span>
          <span className="text-xs font-mono text-[#fa7e09cb] uppercase tracking-widest">
            {formatBytes32(pass.tier)}
          </span>
          <span className="text-white/10 font-mono">/</span>
          <span className="text-xs font-mono text-white/40">
            ID: {pass.tokenId.toString()}
          </span>
        </div>
        <Badge variant={pass.fullyVested ? 'neonBlue' : 'neonOrange'} size="sm">
          {pass.fullyVested ? 'Fully Vested' : 'Vesting'}
        </Badge>
      </div>

      {/* Allocation Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <p className="text-xs font-mono text-white/20 uppercase tracking-widest mb-0.5">Allocation</p>
          <p className="text-sm font-mono text-white/70">{formatAmount(pass.allocation)}</p>
        </div>
        <div>
          <p className="text-xs font-mono text-white/20 uppercase tracking-widest mb-0.5">Claimable</p>
          <p className="text-sm font-mono text-emerald-400">{formatAmount(pass.claimable)}</p>
        </div>
        <div>
          <p className="text-xs font-mono text-white/20 uppercase tracking-widest mb-0.5">Claimed</p>
          <p className="text-sm font-mono text-white/70">{formatAmount(pass.claimed)}</p>
        </div>
        <div>
          <p className="text-xs font-mono text-white/20 uppercase tracking-widest mb-0.5">Locked</p>
          <p className="text-sm font-mono text-white/40">{formatAmount(pass.locked)}</p>
        </div>
      </div>

      {/* Vested Progress */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-mono text-white/20 uppercase tracking-widest">Vested</p>
          <p className="text-xs font-mono text-white/30">{vestedPct}%</p>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#15c6e6c0] rounded-full transition-all duration-500"
            style={{ width: `${vestedPct}%` }}
          />
        </div>
      </div>

      {/* Claimed Progress */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-mono text-white/20 uppercase tracking-widest">Claimed</p>
          <p className="text-xs font-mono text-white/30">{claimPct}%</p>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${claimPct}%` }}
          />
        </div>
      </div>

      {!pass.fullyVested && pass.nextUnlockBlock > 0n && (
        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
          <span className="text-xs font-mono text-white/20 uppercase tracking-widest">
            Next Unlock
          </span>
          <span className="text-xs font-mono text-white/50">
            {formatBlockToDate(BigInt(pass.nextUnlockBlock || 0), BigInt(currentBlock || 0))}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PassesPage() {
  const { address, isConnected } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { tokenIds, isLoading: isLoadingIds } = useTokensByOwner(
    address as `0x${string}` | undefined
  );

  const { passes, isLoading: isReadingPasses, refetch } = useUserPasses(
    tokenIds
  );

  const { claim, isPending, isConfirming } = useClaim();

  const claimableTokenIds = useMemo(
    () => passes.filter((p) => p.claimable > 0n).map((p) => p.tokenId),
    [passes]
  );

  const totalClaimable = useMemo(
    () => passes.reduce((acc, p) => acc + p.claimable, 0n),
    [passes]
  );

  const isLoading = isLoadingIds || isReadingPasses;

  const handleClaimAll = async () => {
    if (claimableTokenIds.length === 0) return;
    setIsModalOpen(true);
    const success = await claim(claimableTokenIds);
    if (success) refetch();
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card variant="default">
          <p className="text-sm font-mono text-white/40 text-center py-4">
            Connect your wallet to view your passes
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">Holder</p>
          <h1 className="text-xl font-mono uppercase tracking-widest text-white/90">My Passes</h1>
        </div>
        {!isLoading && totalClaimable > 0n && (
          <Button
            variant="secondary"
            isLoading={isPending || isConfirming}
            onClick={handleClaimAll}
          >
            Claim All ({claimableTokenIds.length}) 🎁
          </Button>
        )}
      </div>

      {/* Total Claimable */}
      <Card variant="neonBlue" fullWidth>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-white/30 mb-2">
              Total Claimable
            </p>
            {isLoading ? (
              <Spinner size="sm" />
            ) : (
              <p className="text-2xl font-mono text-[#15c6e6c0]">
                {formatAmount(totalClaimable)}
              </p>
            )}
          </div>
          {!isLoading && totalClaimable > 0n && (
            <Badge variant="neonBlue" dot>Available</Badge>
          )}
        </div>
      </Card>

      {/* Passes Grid */}
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-48 w-full bg-white/5 animate-pulse rounded-sm" />
          ))
        ) : passes.length > 0 ? (
          passes.map((pass) => (
            <PassCard key={pass.tokenId.toString()} pass={pass} />
          ))
        ) : (
          <p className="text-sm font-mono text-white/20 text-center py-12 border border-dashed border-white/5">
            No passes found for this address.
          </p>
        )}
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}