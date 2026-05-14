'use client';

import { useState } from 'react';
import { Card, Button } from '@/components/ui';
import { TxStatus } from '@/components/transaction/TxStatus';
import { CategorySelector } from './CategorySelector';
import { TierList } from './TierList';
import { useMintProposal } from '@/hooks';
import { useTxStore } from '@/store';
import { type ProposeMintInput } from '@/types';
import Link from 'next/link';

interface ProposalFormProps {
  vaultId: bigint;
}

export function ProposalForm({ vaultId }: ProposalFormProps) {
  const { proposeMint, isPending, isConfirming, isConfirmed } = useMintProposal();
  const { hash, isError, error, reset } = useTxStore();

  const [selectedCategory, setSelectedCategory] = useState<`0x${string}` | null>(null);
  const [selectedTiers, setSelectedTiers] = useState<`0x${string}`[]>([]);
  const [tierRoots, setTierRoots] = useState<Record<string, `0x${string}` | null>>({});
  const [tierRecipients, setTierRecipients] = useState<Record<string, `0x${string}`[]>>({});
  const [tierSupplyCounts, setTierSupplyCounts] = useState<Record<string, bigint>>({});
  const [tierErrors, setTierErrors] = useState<Record<string, string | undefined>>({});
  const [done, setDone] = useState(false);

  const isBusy = isPending || isConfirming;

  const handleCategorySelect = (category: `0x${string}`) => {
    setSelectedCategory(category);
    setSelectedTiers([]);
    setTierRoots({});
    setTierRecipients({});
    setTierSupplyCounts({});
    setTierErrors({});
    reset();
  };

  const handleSelectionChange = (tiers: `0x${string}`[]) => {
    setSelectedTiers(tiers);
    setTierRoots((prev) => {
      const next: Record<string, `0x${string}` | null> = {};
      tiers.forEach((t) => {
        if (prev[t.toString()] !== undefined) next[t.toString()] = prev[t.toString()];
      });
      return next;
    });
    setTierSupplyCounts((prev) => {
      const next: Record<string, bigint> = {};
      tiers.forEach((t) => {
        if (prev[t.toString()] !== undefined) next[t.toString()] = prev[t.toString()];
      });
      return next;
    });
    setTierErrors((prev) => {
      const next: Record<string, string | undefined> = {};
      tiers.forEach((t) => {
        if (prev[t.toString()] !== undefined) next[t.toString()] = prev[t.toString()];
      });
      return next;
    });
  };

  const handleComputed = (
    tier: `0x${string}`,
    root: `0x${string}`,
    recipients: `0x${string}`[]
  ) => {
    const key = tier.toString();
    setTierRoots((prev) => ({ ...prev, [key]: root }));
    setTierRecipients((prev) => ({ ...prev, [key]: recipients }));
    setTierSupplyCounts((prev) => ({ ...prev, [key]: BigInt(recipients.length) }));
    setTierErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    if (!selectedCategory || selectedTiers.length === 0) return false;
    const errs: Record<string, string> = {};
    for (const tier of selectedTiers) {
      const key = tier.toString();
      if (!tierRoots[key]) {
        errs[key] = 'Compute merkle root first';
      }
    }
    setTierErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !selectedCategory) return;
    reset();

    const input: ProposeMintInput = {
      vaultId,
      category: selectedCategory,
      tierBatches: selectedTiers
        .filter((tier) => tierRoots[tier.toString()] !== null)
        .map((tier) => ({
          tier,
          merkleRoot: tierRoots[tier.toString()]!,
          supplyCount: tierSupplyCounts[tier.toString()] ?? 0n,
        })),
    };

    const success = await proposeMint(input);
    if (success) {
      setDone(true);
    }
  };

  const handleDismiss = () => {
    setDone(false);
    reset();
  };

  const allSelectedReady =
    selectedTiers.length > 0 &&
    selectedTiers.every((t) => !!tierRoots[t.toString()]);

  if (done) {
    return (
      <Card variant="neonBlue" fullWidth>
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <span className="text-2xl">✓</span>
          <div>
            <p className="text-sm font-mono text-white/80 mb-1">
              Proposal submitted successfully
            </p>
            <p className="text-xs font-mono text-white/40">
              Head to the proposals page to track admin approvals.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={handleDismiss}>
              Dismiss
            </Button>
            <Link href="/proposals">
              <Button variant="primary">View Proposals</Button>
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Step 1 — Category */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-mono uppercase tracking-widest text-white/40">
          ① Select Category
        </p>
        <CategorySelector
          vaultId={vaultId}
          selectedCategory={selectedCategory}
          onSelect={handleCategorySelect}
        />
      </div>

      {/* Step 2 — Tiers */}
      {selectedCategory && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-mono uppercase tracking-widest text-white/40">
            ② Select Tiers to Propose
          </p>
          <TierList
            vaultId={vaultId}
            category={selectedCategory}
            tierRoots={tierRoots}
            tierErrors={tierErrors}
            onComputed={handleComputed}
            onSelectionChange={handleSelectionChange}
            disabled={isBusy}
          />
        </div>
      )}

      {/* Step 3 — Submit */}
      {selectedTiers.length > 0 && (
        <Card variant="neonBlue" fullWidth>
          <TxStatus
            hash={hash}
            isPending={isPending}
            isConfirming={isConfirming}
            isConfirmed={isConfirmed}
            isError={isError}
            error={error}
          />
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isBusy}
            disabled={isBusy || !allSelectedReady}
            className="w-full mt-4"
          >
            {isBusy
              ? isPending
                ? 'Awaiting Signature...'
                : 'Confirming...'
              : `Submit Proposal${selectedTiers.length > 1 ? ` (${selectedTiers.length} tiers)` : ''}`}
          </Button>
        </Card>
      )}
    </div>
  );
}