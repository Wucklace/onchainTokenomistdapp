'use client';

import { useEffect, useState } from 'react';
import { TransactionModal } from '@/components/transaction';
import { TierVerification } from './TierVerification';
import { AdminRow } from './AdminRow';
import { useTxStore } from '@/store';
import { useProposalTiers } from '@/hooks/useProposalTiers';
import { useApproveProposal, useRejectProposal, useWallet } from '@/hooks';
import { Card, Badge, Spinner } from '@/components/ui';
import { type ProposalWithStatus } from '@/types';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const statusVariant = {
  pending: 'neonOrange',
  ready: 'success',
  rejected: 'danger',
  expired: 'danger',
  executed: 'neonBlue',
} as const;

interface ApprovalFlowProps {
  proposal: ProposalWithStatus;
  onActionComplete?: () => void;
}

export function ApprovalFlow({ proposal, onActionComplete }: ApprovalFlowProps) {
  const { address } = useWallet();
  const { tiers, isLoading: tiersLoading } = useProposalTiers(proposal.proposalId);
  const { approveProposal } = useApproveProposal();
  const { rejectProposal } = useRejectProposal();
  const { reset } = useTxStore();

  const [verifiedTiers, setVerifiedTiers] = useState<Record<string, boolean>>({});

  const admin1 = proposal.admin1 ?? ZERO_ADDRESS;
  const admin2 = proposal.admin2 ?? ZERO_ADDRESS;

  const isAdmin1 = address?.toLowerCase() === admin1.toLowerCase() && admin1 !== ZERO_ADDRESS;
  const isAdmin2 = address?.toLowerCase() === admin2.toLowerCase() && admin2 !== ZERO_ADDRESS;

  const canAct = proposal.status === 'pending';

  const allTiersVerified =
    tiers.length > 0 &&
    tiers.every((t) => verifiedTiers[t.tier] === true);

  const { isPending, isConfirming, isConfirmed, isError } = useTxStore();
  const isBusy = isPending || isConfirming;

  const handleVerified = (tierKey: string, matched: boolean) => {
    setVerifiedTiers((prev) => ({ ...prev, [tierKey]: matched }));
  };

  const handleApprove = async () => {
    const success = await approveProposal(proposal.proposalId);
    if (success) onActionComplete?.();
  };

  const handleReject = async () => {
    const success = await rejectProposal(proposal.proposalId);
    if (success) onActionComplete?.();
  };

  useEffect(() => {
    reset();
    setVerifiedTiers({});
  }, [proposal.proposalId, reset]);

  if (tiersLoading) {
    return <Card className="flex justify-center p-8"><Spinner size="sm" /></Card>;
  }

  const adminMode = admin1 === ZERO_ADDRESS || admin2 === ZERO_ADDRESS ? 'One Admin' : 'Team';

  return (
    <Card variant="neonBlue" fullWidth>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-mono uppercase tracking-widest text-white/40">
            Approval Status
          </span>
          <span className="text-[10px] font-mono uppercase text-[#15c6e6c0]">
            Mode: {adminMode}
          </span>
        </div>
        <Badge variant={statusVariant[proposal.status] ?? 'neonOrange'} dot>
          {proposal.status}
        </Badge>
      </div>

      {/* Tier Verification */}
      <TierVerification
        tiers={tiers}
        verifiedTiers={verifiedTiers}
        onVerified={handleVerified}
        readOnly={!canAct}
        disabled={isBusy}
      />

      {/* Proposer row */}
      <div className="flex flex-col gap-3 mb-5">
        <div className="flex items-center justify-between p-3 bg-white/3 border border-white/5 rounded-sm">
          <div>
            <p className="text-xs font-mono text-white/30 uppercase mb-1">Proposer</p>
            <p className="text-xs font-mono text-white/60">{proposal.proposer}</p>
          </div>
          <Badge variant="success">Proposed</Badge>
        </div>

        {/* Admin 1 */}
        {admin1 !== ZERO_ADDRESS && (
          <AdminRow
            label="Admin 1"
            address={admin1}
            approved={proposal.admin1Approved}
            isCurrentAdmin={isAdmin1}
            canAct={canAct}
            allTiersVerified={allTiersVerified}
            isBusy={isBusy}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}

        {/* Admin 2 */}
        {admin2 !== ZERO_ADDRESS && (
          <AdminRow
            label="Admin 2"
            address={admin2}
            approved={proposal.admin2Approved}
            isCurrentAdmin={isAdmin2}
            canAct={canAct}
            allTiersVerified={allTiersVerified}
            isBusy={isBusy}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </div>

      <TransactionModal
        isOpen={isPending || isConfirming || isConfirmed || isError}
        onClose={() => reset()}
        title="Confirm Action"
      />
    </Card>
  );
}