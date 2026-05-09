'use client';

export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui';
import { useWallet } from '@/hooks/useWallet';
import { useCategoryTierDetails } from '@/hooks';
import { VaultCategoryTierSelector, DirectMintPanel } from '@/components/passes';

function PassesMintContent() {
  const { isConnected } = useWallet();
  const searchParams = useSearchParams();

  const vaultId = searchParams.get('vaultId')
    ? BigInt(searchParams.get('vaultId')!)
    : null;

  const [selectedCategory, setSelectedCategory] = useState<`0x${string}` | null>(null);
  const [selectedTier, setSelectedTier] = useState<`0x${string}` | null>(null);

  const { tiers, refetch } = useCategoryTierDetails(vaultId, selectedCategory);

  const tierDetail = tiers.find((t) => t.tier === selectedTier) ?? null;

  const handleCategorySelect = (category: `0x${string}`) => {
    setSelectedCategory(category);
    setSelectedTier(null);
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card variant="default">
          <p className="text-sm font-mono text-white/40 text-center py-4">
            Connect your wallet to mint passes
          </p>
        </Card>
      </div>
    );
  }

  if (!vaultId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card variant="default">
          <p className="text-sm font-mono text-white/40 text-center py-4">
            No vault selected — go to your vault and use the Mint Passes button.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">
          Passes
        </p>
        <h1 className="text-xl font-mono uppercase tracking-widest text-white/90">
          Mint Passes
        </h1>
        <p className="text-xs font-mono text-white/30 mt-1">
          Vault #{vaultId.toString()}
        </p>
      </div>

      <VaultCategoryTierSelector
        vaultId={vaultId}
        selectedCategory={selectedCategory}
        selectedTier={selectedTier}
        onCategorySelect={handleCategorySelect}
        onTierSelect={setSelectedTier}
      />

      {selectedCategory && selectedTier && tierDetail && (
        <DirectMintPanel
          vaultId={vaultId}
          category={selectedCategory}
          tier={selectedTier}
          remainingSupply={tierDetail.remainingSupply}
          refetch={refetch}
        />
      )}
    </div>
  );
}

export default function PassesMintPage() {
  return (
    <Suspense fallback={null}>
      <PassesMintContent />
    </Suspense>
  );
}