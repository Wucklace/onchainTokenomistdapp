'use client';

import Link from 'next/link';
import { useState } from 'react';
import { formatAddress, formatAmount } from '@/utils/format';
import { usePlatformStats, useVaultSummaries } from '@/hooks';
import { Spinner, Card, Button, Badge } from '@/components/ui';

const PAGE_SIZE = 12n;

function PlatformStats({ stats }: { stats: import('@/types').PlatformStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

      {/* Vaults */}
      <div className="bg-white/3 border border-white/5 rounded-sm p-4 flex flex-col gap-1.5">
        <p className="text-xs font-mono uppercase tracking-widest text-white/30">Total Vaults</p>
        <p className="text-2xl font-mono text-[#15c6e6c0]">{stats.totalVaults.toString()}</p>
        <div className="flex flex-col gap-1.5 pt-2 border-t border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/25">Active</span>
            <span className="text-xs font-mono text-[#fa7e09cb]">
              {(stats.totalVaults - stats.totalFinalizedVaults).toString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/25">Finalized</span>
            <span className="text-xs font-mono text-emerald-400">{stats.totalFinalizedVaults.toString()}</span>
          </div>
        </div>
      </div>

      {/* Value */}
      <div className="bg-white/3 border border-white/5 rounded-sm p-4 flex flex-col gap-1.5">
        <p className="text-xs font-mono uppercase tracking-widest text-white/30">Total Value Locked</p>
        <p className="text-2xl font-mono text-[#fa7e09cb]">{formatAmount(stats.totalValueLocked)}</p>
        <div className="flex flex-col gap-1.5 pt-2 border-t border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/25">Deposited</span>
            <span className="text-xs font-mono text-white/50">{formatAmount(stats.totalDeposited)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/25">Distributed</span>
            <span className="text-xs font-mono text-emerald-400">{formatAmount(stats.totalDistributed)}</span>
          </div>
        </div>
      </div>

      {/* Passes */}
      <div className="bg-white/3 border border-white/5 rounded-sm p-4 flex flex-col gap-1.5">
        <p className="text-xs font-mono uppercase tracking-widest text-white/30">Pass Activity</p>
        <p className="text-2xl font-mono text-white/70">{stats.totalPassesMinted.toString()}</p>
        <div className="flex flex-col gap-1.5 pt-2 border-t border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/25">Active Passes</span>
            <span className="text-xs font-mono text-[#15c6e6c0]">{stats.totalActivePasses.toString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/25">Completed Claims</span>
            <span className="text-xs font-mono text-emerald-400">{stats.totalCompletedClaims.toString()}</span>
          </div>
        </div>
      </div>

    </div>
  );
}

function VaultCard({ summary }: { summary: import('@/types').VaultSummary }) {
  return (
    <Link href={`/vaults/${summary.vaultId.toString()}`}>
      <div className="flex flex-col gap-1.5 bg-white/3 border border-white/5 hover:border-[#15c6e6c0]/30 hover:bg-[rgba(21,198,230,0.05)] rounded-sm p-4 transition-all duration-200 cursor-pointer">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest">
            Vault #{summary.vaultId.toString()}
          </p>
          <Badge variant={summary.finalized ? 'neonBlue' : 'neonOrange'} size="sm">
            {summary.finalized ? 'Finalized' : 'Active'}
          </Badge>
        </div>

        {/* Token */}
        <div>
          <p className="text-xs font-mono text-white/20 uppercase tracking-widest mb-0.5">
            Token
          </p>
          <p className="text-sm font-mono text-[#15c6e6c0]">
            {formatAddress(summary.tokenAddress)}
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/5">
          <div>
            <p className="text-xs font-mono text-white/20 uppercase tracking-widest mb-0.5">
              Passes
            </p>
            <p className="text-sm font-mono text-white/50">
              {summary.totalPassesMinted.toString()}
            </p>
          </div>
          <div>
            <p className="text-xs font-mono text-white/20 uppercase tracking-widest mb-0.5">
              Active
            </p>
            <p className="text-sm font-mono text-[#fa7e09cb]">
              {summary.totalActivePasses.toString()}
            </p>
          </div>
          <div>
            <p className="text-xs font-mono text-white/20 uppercase tracking-widest mb-0.5">
              Categories
            </p>
            <p className="text-sm font-mono text-white/40">
              {summary.categoryCount.toString()}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function VaultsPage() {
  const [page, setPage] = useState(0n);

  const { stats, isLoading: statsLoading } = usePlatformStats();
  const { summaries, isLoading, isError } = useVaultSummaries(
    page * PAGE_SIZE,
    PAGE_SIZE
  );

  const totalVaults = stats?.totalVaults ?? 0n;
  const totalPages = totalVaults > 0n
    ? (totalVaults + PAGE_SIZE - 1n) / PAGE_SIZE
    : 1n;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">
          Protocol
        </p>
        <h1 className="text-xl font-mono uppercase tracking-widest text-white/90">
          Vaults
        </h1>
      </div>

      {/* Platform Stats */}
      {statsLoading ? (
        <Spinner size="sm" />
      ) : stats ? (
        <PlatformStats stats={stats} />
      ) : null}

      {/* Vault Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Spinner size="lg" variant="neonBlue" label="Loading Vaults..." />
        </div>
      ) : isError ? (
        <Card variant="default">
          <p className="text-sm font-mono text-red-400 text-center py-4">
            Failed to load vaults
          </p>
        </Card>
      ) : summaries.length === 0 ? (
        <Card variant="default">
          <p className="text-xs font-mono text-white/30 text-center py-8">
            No vaults found
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {summaries.map((s) => (
            <VaultCard key={s.vaultId.toString()} summary={s} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalVaults > PAGE_SIZE && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => p - 1n)}
            disabled={page === 0n}
          >
            ← Prev
          </Button>
          <span className="text-xs font-mono text-white/30 uppercase tracking-widest">
            Page {(page + 1n).toString()} / {totalPages.toString()}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => p + 1n)}
            disabled={page + 1n >= totalPages}
          >
            Next →
          </Button>
        </div>
      )}
    </div>
  );
}