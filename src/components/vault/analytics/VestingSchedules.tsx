'use client';

import { Spinner, Card } from '@/components/ui';
import { VestingTimeline } from '@/components/vault';
import { formatBytes32 } from '@/utils/format';
import { useVestingConfig } from '@/hooks';

function CategoryVestingSection({
  vaultId,
  category,
}: {
  vaultId: bigint;
  category: `0x${string}`;
}) {
  const { vestingConfig, isLoading } = useVestingConfig(vaultId, category);

  if (isLoading) return <Spinner size="sm" />;
  if (!vestingConfig) return null;

  return (
    <VestingTimeline
      enabled={vestingConfig.enabled}
      cliff={vestingConfig.cliff}
      duration={vestingConfig.duration}
      interval={vestingConfig.interval}
      initialRelease={vestingConfig.initialRelease}
      mode="live"
    />
  );
}

export function VestingSchedules({
  vaultId,
  categories,
  isLoading,
}: {
  vaultId: bigint;
  categories: readonly `0x${string}`[];
  isLoading: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xs font-mono uppercase tracking-widest text-white/40">
        Vesting Schedules
      </h2>

      {isLoading ? (
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
            <div key={category} className="flex flex-col gap-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#15c6e6c0]">
                {formatBytes32(category)}
              </span>
              <CategoryVestingSection vaultId={vaultId} category={category} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}