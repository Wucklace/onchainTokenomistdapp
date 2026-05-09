'use client';

import { Spinner, Card } from '@/components/ui';
import { CategoryAllocationCard } from './CategoryAllocationCard';
import { type CategoryAllocation } from '@/types';

export function CategoryBreakdown({
  vaultId,
  allocations,
  isLoading,
}: {
  vaultId: bigint;
  allocations: CategoryAllocation[];
  isLoading: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xs font-mono uppercase tracking-widest text-white/40">
        Category Breakdown
      </h2>

      {isLoading ? (
        <Spinner size="sm" />
      ) : allocations.length === 0 ? (
        <Card variant="default">
          <p className="text-xs font-mono text-white/30 text-center py-4">
            No categories found
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {allocations.map((allocation) => (
            <CategoryAllocationCard
              key={allocation.category}
              vaultId={vaultId}
              allocation={allocation}
            />
          ))}
        </div>
      )}
    </div>
  );
}