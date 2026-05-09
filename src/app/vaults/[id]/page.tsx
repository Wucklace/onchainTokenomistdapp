'use client';

import { use } from 'react';
import Link from 'next/link';
import { formatBytes32 } from '@/utils/format';
import { VaultStats } from '@/components/vault/VaultStats';
import { Spinner, Badge, Button, Card } from '@/components/ui';
import { useVaultSummary, useVaultCategories, useCategoryTiers, useWallet } from '@/hooks';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

interface VaultPageProps {
  params: Promise<{ id: string }>;
}

function CategorySection({
  vaultId,
  category,
}: {
  vaultId: bigint;
  category: `0x${string}`;
}) {
  const { tiers, isLoading } = useCategoryTiers(vaultId, category);

  return (

    <div className="flex flex-col gap-3">
      
      {/* Category Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-mono text-[#15c6e6c0] uppercase tracking-widest">
          {formatBytes32(category)}
        </span>
        <Badge variant="neonBlue" size="sm">
          {tiers.length} Tiers
        </Badge>
      </div>

      {/* Tiers */}
      {isLoading ? (
        <Spinner size="sm" />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {tiers.map((tier) => (
            <div
              key={tier}
              className="bg-white/3 border border-white/5 rounded-sm p-3"
            >
              <p className="text-xs font-mono text-[#fa7e09cb] uppercase tracking-widest">
                {formatBytes32(tier)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function VaultDetailPage({ params }: VaultPageProps) {
  const { id } = use(params);
  const vaultId = BigInt(id);

  const { summary, isLoading, isError } = useVaultSummary(vaultId);
  const { categories, isLoading: categoriesLoading } = useVaultCategories(vaultId);
  const { address } = useWallet();

  const isCreator = summary?.creator.toLowerCase() === address?.toLowerCase();
  const isExecutor = summary?.executor.toLowerCase() === address?.toLowerCase();
  const isCreatorOnly = summary?.admin1 === ZERO_ADDRESS && summary?.admin2 === ZERO_ADDRESS;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" variant="neonBlue" label="Loading Vault..." />
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
            Vault
          </p>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-mono uppercase tracking-widest text-white/90">
              #{vaultId.toString()}
            </h1>
            <Badge variant={summary.finalized ? 'success' : 'neonOrange'} dot>
             {summary.finalized ? 'Finalized' : 'Active'}
            </Badge>
          </div>
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mt-1">
            {isCreatorOnly ? 'Creator Mode' : 'Team'}
          </p>
        </div>
        <div className="flex flex-col items-center gap-3">
          {(isCreator || isExecutor) && !summary.finalized && (
            isCreatorOnly ? (
               <Link href={`/passes/mint?vaultId=${summary.vaultId.toString()}`}>
                <Button variant="primary" size="sm">
                  Mint Passes
                </Button>
              </Link>
            ) : (
              <Link href={`/proposals/create?vaultId=${summary.vaultId.toString()}`}>
                <Button variant="primary" size="sm">
                  Create Proposal
                </Button>
              </Link>
            )
          )}
          <Link href={`/vaults/${id}/analytics`}>
            <Button variant="ghost" size="sm">
              Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* Vault Stats */}
      <VaultStats vaultId={vaultId} />

      {/* Categories */}
      <div className="flex flex-col gap-5">
        <h2 className="text-xs font-mono uppercase tracking-widest text-white/40">
          Categories & Tiers
        </h2>

        {categoriesLoading ? (
          <Spinner size="sm" />
        ) : categories.length === 0 ? (
          <Card variant="default">
            <p className="text-xs font-mono text-white/30 text-center py-4">
              No categories found
            </p>
          </Card>
        ) : (
          <div className="flex flex-col gap-6">
            {categories.map((category) => (
              <Card key={category} variant="default" fullWidth>
                <CategorySection vaultId={vaultId} category={category} />
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}