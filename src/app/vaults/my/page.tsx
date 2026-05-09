'use client';

export const dynamic = 'force-dynamic';

import { useVaultSummariesByCreator } from '@/hooks';
import { useWallet } from '@/hooks';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { formatAddress } from '@/utils/format';
import Link from 'next/link';

function VaultRow({ summary }: { summary: import('@/types').VaultSummary }) {
  return (
    <Link href={`/vaults/${summary.vaultId.toString()}`}>
      <div className="flex items-center justify-between gap-4 px-4 py-3 bg-white/3 border border-white/5 hover:border-[#15c6e6c0]/30 hover:bg-[rgba(21,198,230,0.05)] rounded-sm transition-all duration-200 cursor-pointer">
        {/* Left */}
        <div className="flex items-center gap-6 min-w-0">
          <div>
            <p className="text-xs font-mono text-white/30 uppercase tracking-widest">
              #{summary.vaultId.toString()}
            </p>
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-mono text-white/20 uppercase tracking-widest mb-0.5">
              Token
            </p>
            <p className="text-xs font-mono text-white/60">
              {formatAddress(summary.tokenAddress)}
            </p>
          </div>
          <div>
            <p className="text-xs font-mono text-white/20 uppercase tracking-widest mb-0.5">
              Passes
            </p>
            <p className="text-xs font-mono text-white/60">
              {summary.totalPassesMinted.toString()}
            </p>
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-mono text-white/20 uppercase tracking-widest mb-0.5">
              Active
            </p>
            <p className="text-xs font-mono text-white/60">
              {summary.totalActivePasses.toString()}
            </p>
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-mono text-white/20 uppercase tracking-widest mb-0.5">
              Claimed
            </p>
            <p className="text-xs font-mono text-white/60">
              {summary.totalCompletedClaims.toString()}
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 shrink-0">
          <Badge variant={summary.finalized ? 'neonBlue' : 'neonOrange'} size="sm">
            {summary.finalized ? 'Finalized' : 'Active'}
          </Badge>
          <span className="text-white/20 text-xs font-mono">→</span>
        </div>
      </div>
    </Link>
  );
}

export default function MyVaultsPage() {
  const { address, isConnected } = useWallet();

  const { summaries, isLoading, isError } = useVaultSummariesByCreator(
    isConnected ? (address as `0x${string}`) : null
  );

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card variant="default">
          <p className="text-sm font-mono text-white/30 text-center py-4">
            Connect your wallet to view your vaults
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
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">
            Creator
          </p>
          <h1 className="text-xl font-mono uppercase tracking-widest text-white/90">
            My Vaults
          </h1>
        </div>
        <Link href="/vaults/configure">
          <Button variant="primary" size="sm">
            + New Vault
          </Button>
        </Link>
      </div>

      {/* Address */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white/3 border border-white/5 rounded-sm w-fit">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-mono text-white/30 uppercase tracking-widest">
          {formatAddress(address!)}
        </span>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Spinner size="lg" variant="neonBlue" label="Loading your vaults..." />
        </div>
      ) : isError ? (
        <Card variant="default">
          <p className="text-sm font-mono text-red-400 text-center py-4">
            Failed to load vaults
          </p>
        </Card>
      ) : summaries.length === 0 ? (
        <Card variant="default">
          <div className="flex flex-col items-center gap-4 py-10">
            <p className="text-xs font-mono text-white/30 text-center uppercase tracking-widest">
              No vaults created yet
            </p>
            <Link href="/vaults/configure">
              <Button variant="primary" size="sm">
                Create your first vault
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {summaries.map((s) => (
            <VaultRow key={s.vaultId.toString()} summary={s} />
          ))}
        </div>
      )}
    </div>
  );
}