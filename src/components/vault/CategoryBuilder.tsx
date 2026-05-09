'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TokenInput } from '@/components/forms/TokenInput';
import { CategoryNameInput } from './CategoryNameInput';
import { TierNameInput } from './TierNameInput';


export interface TierInput {
  name: string;
  allocationPerPass: string;
  maxSupply: string;
}

export interface CategoryInput {
  name: string;
  tiers: TierInput[];
}

interface CategoryBuilderProps {
  categories: CategoryInput[];
  onChange: (categories: CategoryInput[]) => void;
  tokenSymbol?: string;
  totalDeposit?: string;
}

const DEFAULT_TIER: TierInput = {
  name: '',
  allocationPerPass: '',
  maxSupply: '',
};

const DEFAULT_CATEGORY: CategoryInput = {
  name: '',
  tiers: [{ ...DEFAULT_TIER }],
};

// ─── Pure immutable helpers ───────────────────────────────────────────────────

function updateCategoryAt(
  categories: CategoryInput[],
  index: number,
  updater: (cat: CategoryInput) => CategoryInput
): CategoryInput[] {
  return categories.map((cat, i) => (i === index ? updater(cat) : cat));
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CategoryBuilder({
  categories,
  onChange,
  tokenSymbol = 'TOKEN',
  totalDeposit,
}: CategoryBuilderProps) {

  const addCategory = () => {
    onChange([
      ...categories,
      { ...DEFAULT_CATEGORY, tiers: [{ ...DEFAULT_TIER }] },
    ]);
  };

  const removeCategory = (catIndex: number) => {
    onChange(categories.filter((_, i) => i !== catIndex));
  };

  const updateCategory = (catIndex: number, updated: Partial<CategoryInput>) => {
    onChange(
      updateCategoryAt(categories, catIndex, (cat) => ({ ...cat, ...updated }))
    );
  };

  const addTier = (catIndex: number) => {
    onChange(
      updateCategoryAt(categories, catIndex, (cat) => ({
        ...cat,
        tiers: [...cat.tiers, { ...DEFAULT_TIER }],
      }))
    );
  };

  const removeTier = (catIndex: number, tierIndex: number) => {
    onChange(
      updateCategoryAt(categories, catIndex, (cat) => ({
        ...cat,
        tiers: cat.tiers.filter((_, i) => i !== tierIndex),
      }))
    );
  };

  const updateTier = (
    catIndex: number,
    tierIndex: number,
    updated: Partial<TierInput>
  ) => {
    onChange(
      updateCategoryAt(categories, catIndex, (cat) => ({
        ...cat,
        tiers: cat.tiers.map((tier, i) =>
          i === tierIndex ? { ...tier, ...updated } : tier
        ),
      }))
    );
  };

  // ── Allocation summary ──────────────────────────────────────────────────────

  const totalAllocated = categories.reduce((catAcc, cat) => {
    return (
      catAcc +
      cat.tiers.reduce((tierAcc, tier) => {
        const alloc = parseInt(tier.allocationPerPass || '0');
        const supply = parseInt(tier.maxSupply || '0');
        return tierAcc + (isNaN(alloc) || isNaN(supply) ? 0 : alloc * supply);
      }, 0)
    );
  }, 0);

  const totalDepositNum = parseInt(totalDeposit || '0');
  const allocationProgress =
    totalDepositNum > 0 ? (totalAllocated / totalDepositNum) * 100 : 0;
  const isOverAllocated = totalAllocated > totalDepositNum && totalDepositNum > 0;

  const usedCategoryNames = categories.map((c) => c.name);

  return (
    <div className="flex flex-col gap-6 w-full">
      {categories.map((category, catIndex) => {
        const usedTierNames = category.tiers.map((t) => t.name);

        return (
          <Card key={catIndex} variant="neonBlue" fullWidth>
            {/* Category Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#15c6e6c0]">
                Category {catIndex + 1}
              </span>
              {categories.length > 1 && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeCategory(catIndex)}
                >
                  Remove
                </Button>
              )}
            </div>

            {/* Category Name */}
            <div className="mb-5">
              <CategoryNameInput
                value={category.name}
                onChange={(name) => updateCategory(catIndex, { name })}
                usedNames={usedCategoryNames.filter((_, i) => i !== catIndex)}
              />
            </div>

            {/* Tiers */}
            <div className="flex flex-col gap-4">
              {category.tiers.map((tier, tierIndex) => (
                <div
                  key={tierIndex}
                  className="bg-white/3 border border-white/5 rounded-sm p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#fa7e09cb]">
                      Tier {tierIndex + 1}
                    </span>
                    {category.tiers.length > 1 && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeTier(catIndex, tierIndex)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <TierNameInput
                      value={tier.name}
                      onChange={(name) =>
                        updateTier(catIndex, tierIndex, { name })
                      }
                      usedNames={usedTierNames.filter((_, i) => i !== tierIndex)}
                      index={tierIndex}
                    />

                    <TokenInput
                      label="Allocation Per Pass"
                      value={tier.allocationPerPass}
                      symbol={tokenSymbol}
                      onChange={(e) =>
                        updateTier(catIndex, tierIndex, {
                          allocationPerPass: e.target.value,
                        })
                      }
                      fullWidth
                    />

                    <TokenInput
                      label="Max Supply (Passes)"
                      value={tier.maxSupply}
                      symbol="passes"
                      onChange={(e) =>
                        updateTier(catIndex, tierIndex, {
                          maxSupply: e.target.value,
                        })
                      }
                      fullWidth
                    />
                  </div>

                  {tier.allocationPerPass && tier.maxSupply && (
                    <p className="mt-3 text-xs font-mono text-white/30">
                      Total:{' '}
                      <span className="text-[#fa7e09cb]">
                        {(
                          parseInt(tier.allocationPerPass) *
                          parseInt(tier.maxSupply)
                        ).toLocaleString()}{' '}
                        {tokenSymbol}
                      </span>
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => addTier(catIndex)}
              >
                + Add Tier
              </Button>
            </div>
          </Card>
        );
      })}

      <Button variant="secondary" onClick={addCategory} fullWidth>
        + Add Category
      </Button>

      {/* Allocation Summary */}
      {totalDeposit && (
        <Card variant={isOverAllocated ? 'neonOrange' : 'default'} fullWidth>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-white/40">
              Total Allocated
            </span>
            <span
              className={`text-sm font-mono ${
                isOverAllocated ? 'text-red-400' : 'text-[#15c6e6c0]'
              }`}
            >
              {totalAllocated.toLocaleString()} /{' '}
              {parseInt(totalDeposit).toLocaleString()} {tokenSymbol}
            </span>
          </div>

          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isOverAllocated
                  ? 'bg-red-500'
                  : allocationProgress === 100
                  ? 'bg-emerald-500'
                  : 'bg-[#15c6e6c0]'
              }`}
              style={{ width: `${Math.min(allocationProgress, 100)}%` }}
            />
          </div>

          <p
            className={`mt-2 text-xs font-mono ${
              isOverAllocated
                ? 'text-red-400'
                : allocationProgress === 100
                ? 'text-emerald-400'
                : 'text-white/30'
            }`}
          >
            {isOverAllocated
              ? '⚠ Over allocated'
              : allocationProgress === 100
              ? '✓ Fully allocated'
              : `${allocationProgress.toFixed(1)}% allocated`}
          </p>
        </Card>
      )}
    </div>
  );
}