'use client';

import { Spinner } from '@/components/ui';
import { useVaultCategories, useCategoryTierDetails } from '@/hooks';
import { formatBytes32 } from '@/utils/format';

// ─── Single category option ───────────────────────────────────────────────────

function CategoryOption({
  vaultId,
  category,
  selected,
  onSelect,
}: {
  vaultId: bigint;
  category: `0x${string}`;
  selected: boolean;
  onSelect: (category: `0x${string}`) => void;
}) {
  const { tiers, isLoading } = useCategoryTierDetails(vaultId, category);

  // Skip finalized categories — all tiers fully minted
  const isFinalized = !isLoading && tiers.length > 0 && tiers.every((t) => t.remainingSupply === 0n);

  if (isFinalized) return null;

  const remaining = tiers.reduce((acc, t) => acc + t.remainingSupply, 0n);

  return (
    <button
      onClick={() => onSelect(category)}
      className={`flex items-center justify-between px-4 py-3 rounded-sm border text-left transition-all duration-200 ${
        selected
          ? 'border-[#15c6e6c0]/50 bg-[rgba(21,198,230,0.08)]'
          : 'border-white/10 bg-white/3 hover:border-white/20'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-white/70 uppercase">
          {formatBytes32(category)}
        </span>
        <span className="text-[10px] font-mono text-white/30">
          {isLoading ? '...' : `${tiers.length} tiers · ${remaining.toString()} passes remaining`}
        </span>
      </div>
      {selected && (
        <span className="text-[10px] font-mono text-[#15c6e6c0]">Selected ✓</span>
      )}
    </button>
  );
}

// ─── Category Selector ────────────────────────────────────────────────────────

interface CategorySelectorProps {
  vaultId: bigint;
  selectedCategory: `0x${string}` | null;
  onSelect: (category: `0x${string}`) => void;
}

export function CategorySelector({
  vaultId,
  selectedCategory,
  onSelect,
}: CategorySelectorProps) {
  const { categories, isLoading } = useVaultCategories(vaultId);

  if (isLoading) return <Spinner size="sm" />;

  if (categories.length === 0) {
    return (
      <p className="text-xs font-mono text-white/20 py-2">
        No categories found for this vault.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {categories.map((category) => (
        <CategoryOption
          key={category}
          vaultId={vaultId}
          category={category}
          selected={selectedCategory === category}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}