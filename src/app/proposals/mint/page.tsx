'use client';

import { useTxStore } from '@/store';
import { useState, useEffect } from 'react';
import { Card, Button, Spinner } from '@/components/ui';
import { useSearchParams, useRouter } from 'next/navigation';
import { useInvolvedProposals, useProposalTiers, useWallet } from '@/hooks';
import { ProposalIdInput, ProposalSummary, TierMintPanel } from '@/components/proposals';

export default function MintPassesPage() {
  const { isConnected, address } = useWallet();
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryId = searchParams.get('id');
  const [proposalId, setProposalId] = useState<bigint | null>(
    queryId && !isNaN(parseInt(queryId)) ? BigInt(parseInt(queryId)) : null
  );

  const { proposals, isLoading } = useInvolvedProposals(address);
  const proposal = proposalId != null
    ? proposals.find((p) => p.proposalId === proposalId) ?? null
    : null;

  const { tiers, isLoading: tiersLoading, refetch: refetchTiers } = useProposalTiers(
    proposalId && proposal ? proposalId : null
  );

  const { reset } = useTxStore();
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    setIsBusy(false);
  }, [proposalId]);

  const handleLoad = (id: bigint) => {
    reset();
    setProposalId(id);
    router.replace(`/proposals/mint?id=${id.toString()}`);
  };

  const handleClear = () => {
    setProposalId(null);
    setIsBusy(false);
    reset();
    router.replace('/proposals/mint');
  };

  const handleBatchComplete = () => {
    refetchTiers();
  };

  // Only show tiers not yet fully minted for this proposal
  const activeTiers = tiers.filter((t) => t.mintedCount < t.supplyCount);

  const canMint = proposal?.status === 'ready' && activeTiers.length > 0;

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

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">
            Proposals
          </p>
          <h1 className="text-xl font-mono uppercase tracking-widest text-white/90">
            Mint Passes
          </h1>
          <p className="text-xs font-mono text-white/30 mt-1">
            Distribute passes to recipients for an approved proposal
          </p>
        </div>
        {proposalId && (
          <Button variant="ghost" size="sm" onClick={handleClear}>
            ← Change
          </Button>
        )}
      </div>

      {/* Proposal loader */}
      {!proposalId && <ProposalIdInput onLoad={handleLoad} />}

      {/* Loading */}
      {proposalId && (isLoading || tiersLoading) && (
        <Card variant="default" fullWidth className="flex justify-center p-8">
          <Spinner size="sm" />
        </Card>
      )}

      {/* Not found */}
      {proposalId && !isLoading && !proposal && (
        <Card variant="default" fullWidth>
          <p className="text-xs font-mono text-white/30 text-center py-8">
            Proposal #{proposalId.toString()} not found — check the ID and try again
          </p>
        </Card>
      )}

      {/* Proposal found */}
      {proposalId && !isLoading && !tiersLoading && proposal && (
        <>
          <ProposalSummary proposal={proposal} proposalId={proposalId} />

          {/* Not ready */}
          {!canMint && (
            <Card variant="default" fullWidth>
              <p className="text-xs font-mono text-white/30 text-center py-6">
                {proposal.executed
                  ? 'All tiers have been fully minted — this proposal is complete'
                  : proposal.rejected
                  ? 'This proposal has been rejected and cannot be minted'
                  : proposal.expired
                  ? 'This proposal has expired and cannot be minted'
                  : 'Waiting for all required admin approvals before minting is allowed'}
              </p>
            </Card>
          )}

          {/* Ready — active tier panels only */}
          {canMint && (
            <div className="flex flex-col gap-4">
              <p className="text-xs font-mono uppercase tracking-widest text-white/40">
                Tiers to Mint
              </p>
              {activeTiers.map((t) => (
                <TierMintPanel
                  key={t.tier}
                  proposalId={proposalId}
                  tier={t.tier}
                  merkleRoot={t.merkleRoot}
                  remainingSupply={t.remainingSupply}
                  supplyCount={t.supplyCount}
                  mintedCount={t.mintedCount}
                  isBusy={isBusy}
                  onBusyChange={setIsBusy}
                  onBatchComplete={handleBatchComplete}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}