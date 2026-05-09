'use client';

import { useWizardStore } from '@/store/useWizardStore';
import { CategoryBuilder } from '@/components/vault/CategoryBuilder';

export function Step2Categories() {
  const categories = useWizardStore((s) => s.categories);
  const setCategories = useWizardStore((s) => s.setCategories);
  const amount = useWizardStore((s) => s.step1.amount);
  const error = useWizardStore((s) => s.errors.step2.categories);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xs font-mono uppercase tracking-widest text-white/40">
        Define Categories & Tiers
      </h2>

      {/* Step-level error (over-allocation, duplicates) */}
      {error && (
        <p className="text-xs font-mono text-red-400 tracking-wide">⚠ {error}</p>
      )}

      <CategoryBuilder
        categories={categories}
        onChange={setCategories}
        totalDeposit={amount}
      />
    </div>
  );
}