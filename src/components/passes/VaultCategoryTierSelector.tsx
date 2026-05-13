'use client';

import { Spinner } from '@/components/ui';
import { formatBytes32 } from '@/utils/format';
import { useVaultCategories, useCategoryTierDetails } from '@/hooks';

// ─── Category Item ────────────────────────────────────────────────────────────

function CategoryItem({
  vaultId,
  cat,
  isSelected,
  onSelect,
}: {
  vaultId: bigint;
  cat: `0x${string}`;
  isSelected: boolean;
  onSelect: (cat: `0x${string}`) => void;
}) {
  const { tiers, isLoading } = useCategoryTierDetails(vaultId, cat);

  const fullyMinted =
    !isLoading && tiers.length > 0 && tiers.every((t) => t.remainingSupply === 0n);

  if (fullyMinted) return null;

  return (
    <button
      onClick={() => onSelect(cat)}
      disabled={isLoading}
      className={`px-3 py-1.5 rounded-sm border text-xs font-mono uppercase transition-all duration-200 ${
        isLoading ? 'opacity-40 cursor-wait' : ''
      } ${
        isSelected
          ? 'border-[#fa7e09cb]/50 bg-[rgba(250,126,9,0.08)] text-[#fa7e09cb]'
          : 'border-white/10 bg-white/3 text-white/50 hover:border-white/20'
      }`}
    >
      {formatBytes32(cat)}
    </button>
  );
}

// ─── Category Selector ────────────────────────────────────────────────────────

function CategorySelector({
  vaultId,
  selectedCategory,
  onSelect,
}: {
  vaultId: bigint;
  selectedCategory: `0x${string}` | null;
  onSelect: (category: `0x${string}`) => void;
}) {
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
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <CategoryItem
          key={cat}
          vaultId={vaultId}
          cat={cat}
          isSelected={selectedCategory === cat}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

// ─── Tier Selector ────────────────────────────────────────────────────────────

function TierSelector({
  vaultId,
  category,
  selectedTier,
  onSelect,
}: {
  vaultId: bigint;
  category: `0x${string}`;
  selectedTier: `0x${string}` | null;
  onSelect: (tier: `0x${string}`) => void;
}) {
  const { tiers, isLoading } = useCategoryTierDetails(vaultId, category);

  const availableTiers = tiers.filter((t) => t.remainingSupply > 0n);

  if (isLoading) return <Spinner size="sm" />;

  if (availableTiers.length === 0) {
    return (
      <p className="text-xs font-mono text-white/20 py-2">
        All tiers fully minted.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {availableTiers.map(({ tier }) => (
        <button
          key={tier}
          onClick={() => onSelect(tier)}
          className={`px-3 py-1.5 rounded-sm border text-xs font-mono uppercase transition-all duration-200 ${
            selectedTier === tier
              ? 'border-[#fa7e09cb]/50 bg-[rgba(250,126,9,0.08)] text-[#fa7e09cb]'
              : 'border-white/10 bg-white/3 text-white/50 hover:border-white/20'
          }`}
        >
          {formatBytes32(tier)}
        </button>
      ))}
    </div>
  );
}

// ─── Combined Selector ────────────────────────────────────────────────────────

interface VaultCategoryTierSelectorProps {
  vaultId: bigint;
  selectedCategory: `0x${string}` | null;
  selectedTier: `0x${string}` | null;
  onCategorySelect: (category: `0x${string}`) => void;
  onTierSelect: (tier: `0x${string}`) => void;
}

export function VaultCategoryTierSelector({
  vaultId,
  selectedCategory,
  selectedTier,
  onCategorySelect,
  onTierSelect,
}: VaultCategoryTierSelectorProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-mono uppercase tracking-widest text-white/40">
          ① Select Category
        </p>
        <CategorySelector
          vaultId={vaultId}
          selectedCategory={selectedCategory}
          onSelect={onCategorySelect}
        />
      </div>

      {selectedCategory && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-mono uppercase tracking-widest text-white/40">
            ② Select Tier
          </p>
          <TierSelector
            vaultId={vaultId}
            category={selectedCategory}
            selectedTier={selectedTier}
            onSelect={onTierSelect}
          />
        </div>
      )}
    </div>
  );
}