'use client';

import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { useVaultSummary } from '@/hooks';
import { useBlockNumber } from 'wagmi';
import { formatAmount, formatAddress, formatBlockToDate, formatBlocksRemaining } from '@/utils/format';

interface VaultStatsProps {
  vaultId: bigint;
}

interface StatItemProps {
  label: string;
  value: string;
  subValue?: string;
  accent?: 'neonBlue' | 'neonOrange';
}

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

function getAdminMode(admin1: string, admin2: string): 'creator' | 'one_admin' | 'Team' {
  if (admin1 === ZERO_ADDRESS) return 'creator';
  if (admin2 === ZERO_ADDRESS) return 'one_admin';
  return 'Team';
}

const ADMIN_MODE_LABEL: Record<ReturnType<typeof getAdminMode>, string> = {
  creator: 'Creator Mode',
  one_admin: '1 Admin Mode',
  Team: 'Team Mode',
};

function StatItem({ label, value, subValue, accent }: StatItemProps) {
  const accentColor =
    accent === 'neonBlue'
      ? 'text-[#15c6e6c0]'
      : accent === 'neonOrange'
      ? 'text-[#fa7e09cb]'
      : 'text-white/80';

  return (
    <div className="bg-white/3 border border-white/5 rounded-sm p-4">
      <p className="text-xs font-mono uppercase tracking-widest text-white/30 mb-2">
        {label}
      </p>
      <p className={`text-lg font-mono ${accentColor}`}>{value}</p>
      {subValue && (
        <p className="text-xs font-mono text-white/30 mt-1">{subValue}</p>
      )}
    </div>
  );
}

export function VaultStats({ vaultId }: VaultStatsProps) {
  const { summary, isLoading, isError } = useVaultSummary(vaultId);
  const { data: currentBlock } = useBlockNumber();

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center min-h-[200px]">
        <Spinner size="md" />
      </Card>
    );
  }

  if (isError || !summary) {
    return (
      <Card className="flex items-center justify-center min-h-[200px]">
        <p className="text-xs font-mono text-red-400">Failed to load vault stats</p>
      </Card>
    );
  }

  const adminMode = getAdminMode(summary.admin1, summary.admin2);

  const startStatus = currentBlock
    ? currentBlock >= summary.startBlock
      ? 'Start Reached'
      : formatBlocksRemaining(summary.startBlock - currentBlock)
    : '...';

  const startDate = currentBlock
    ? formatBlockToDate(summary.startBlock, currentBlock)
    : '...';

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatItem
          label="Total Deposited"
          value={formatAmount(summary.totalDeposited)}
          accent="neonBlue"
        />
        <StatItem
          label="Start Status"
          value={startStatus}
          subValue={startDate}
          accent="neonOrange"
        />
        <StatItem
          label="Token"
          value={formatAddress(summary.tokenAddress)}
          subValue="Contract Address"
        />
        <StatItem
          label="Creator"
          value={formatAddress(summary.creator)}
          subValue={ADMIN_MODE_LABEL[adminMode]}
        />
      </div>

      <div>
        {adminMode === 'creator' && summary.executor !== ZERO_ADDRESS && (
          <div className="grid grid-cols-1 gap-3">
            <StatItem
              label="🤖 Executor"
              value={formatAddress(summary.executor)}
            />
          </div>
        )}

        {adminMode === 'one_admin' && (
          <div className={`grid gap-3 ${summary.executor !== ZERO_ADDRESS ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <StatItem
              label="Admin 1"
              value={formatAddress(summary.admin1)}
            />
            {summary.executor !== ZERO_ADDRESS && (
              <StatItem
                label="🤖 Executor"
                value={formatAddress(summary.executor)}
              />
            )}
          </div>
        )}

        {adminMode === 'Team' && (
          <div className={`grid gap-3 ${summary.executor !== ZERO_ADDRESS ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <StatItem
              label="Admin 1"
              value={formatAddress(summary.admin1)}
            />
            <StatItem
              label="Admin 2"
              value={formatAddress(summary.admin2)}
            />
            {summary.executor !== ZERO_ADDRESS && (
              <StatItem
                label="🤖 Executor"
                value={formatAddress(summary.executor)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}