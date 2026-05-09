'use client';

import { use } from 'react';
import { Badge, Card, Spinner } from '@/components/ui';
import { VaultStats } from '@/components/vault';
import { useVaultSummary, useVaultCategories, useVaultCategoryAllocations} from '@/hooks';
import { VaultDistributionStats, CategoryBreakdown, VestingSchedules,} from '@/components/vault/analytics';

interface AnalyticsPageProps {
  params: Promise<{ id: string }>;
}

export default function VaultAnalyticsPage({ params }: AnalyticsPageProps) {
  const { id } = use(params);
  const vaultId = BigInt(id);

  const { summary, isLoading, isError } = useVaultSummary(vaultId);
  const { categories, isLoading: categoriesLoading } = useVaultCategories(vaultId);
  const { allocations, isLoading: allocationsLoading } = useVaultCategoryAllocations(vaultId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" variant="neonBlue" label="Loading Analytics..." />
      </div>
    );
  }

  if (isError || !summary) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card variant="default">
          <p className="text-sm font-mono text-red-400 text-center">
            Vault not found or failed to load
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
            Analytics
          </p>
          <h1 className="text-xl font-mono uppercase tracking-widest text-white/90">
            Vault #{vaultId.toString()}
          </h1>
        </div>
        <Badge variant={summary.finalized ? 'success' : 'neonOrange'} dot>
          {summary.finalized ? 'Finalized' : 'Active'}
        </Badge>
      </div>

      {/* Vault Stats — addresses, admin mode, start block */}
      <VaultStats vaultId={vaultId} />

      {/* Distribution Stats — deposited, allocated, claimed, remaining */}
      <VaultDistributionStats summary={summary} />

      {/* Category Breakdown — per category with tier tables */}
      <CategoryBreakdown
        vaultId={vaultId}
        allocations={allocations}
        isLoading={allocationsLoading}
      />

      {/* Vesting Schedules — per category timeline */}
      <VestingSchedules
        vaultId={vaultId}
        categories={categories}
        isLoading={categoriesLoading}
      />
    </div>
  );
}