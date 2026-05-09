'use client';

export const dynamic = 'force-dynamic';

import { useBlockNumber } from 'wagmi'
import { useState } from 'react';
import { type ProposalWithStatus } from '@/types';
import { Spinner, Modal, Badge, Card } from '@/components/ui';
import { useInvolvedProposals, useWallet, useAdminProposals } from '@/hooks/';
import { formatBlockToDate, formatBytes32 } from '@/utils/format';
import { ApprovalFlow } from '@/components/proposals';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';


const statusVariant = {
  pending: 'neonOrange',
  ready: 'success',
  rejected: 'danger',
  expired: 'danger',
  executed: 'neonBlue',
} as const;

type ProposalRole = 'creator' | 'executor' | 'admin';

// ─── Proposal Card ────────────────────────────────────────────────────────────

function ProposalCard({
  proposal,
  role,
  onSelect,
}: {
  proposal: ProposalWithStatus;
  role: ProposalRole;
  onSelect: (proposal: ProposalWithStatus) => void;
}) {
  const { data: currentBlock } = useBlockNumber();
  const approvalCount = [proposal.admin1Approved, proposal.admin2Approved].filter(Boolean).length;

  const roleBadgeVariant = {
    creator: 'neonBlue',
    executor: 'neonOrange',
    admin: 'success',
  } as const;

  return (
    <Card variant="default" hoverable fullWidth onClick={() => onSelect(proposal)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-white/40">
            Proposal #{proposal.proposalId.toString()}
          </span>
          <Badge variant={roleBadgeVariant[role]} size="sm">
            {role}
          </Badge>
        </div>
        <Badge variant={statusVariant[proposal.status] ?? 'neonOrange'} dot>
          {proposal.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">Vault</p>
          <p className="text-xs font-mono text-white/60">#{proposal.vaultId.toString()}</p>
        </div>
        <div>
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">Category</p>
          <p className="text-xs font-mono text-[#15c6e6c0]">{formatBytes32(proposal.category)}</p>
        </div>
        <div>
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">Approvals</p>
          <p className="text-xs font-mono text-white/60">{approvalCount} / 2</p>
        </div>
        <div>
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">Deadline</p>
          <p className="text-xs font-mono text-white/60">{formatBlockToDate(BigInt(proposal.deadline || 0), BigInt(currentBlock || 0))}</p>
        </div>
      </div>

      {proposal.status === 'ready' && (role === 'creator' || role === 'executor') && (
        <div className="mt-3 pt-3 border-t border-white/5" onClick={(e) => e.stopPropagation()}>
          <Link href={`/proposals/mint?id=${proposal.proposalId.toString()}`}>
            <span className="text-xs font-mono text-[#15c6e6c0] hover:underline">
              Mint Passes →
            </span>
          </Link>
        </div>
      )}
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProposalsPage() {
  const { address, isConnected } = useWallet();
  const queryClient = useQueryClient();

  const { proposals: adminProposals, isLoading: adminLoading, isError: adminError } = useAdminProposals(address);
  const { proposals: involvedProposals, isLoading: involvedLoading } = useInvolvedProposals(address);

  const [selectedProposal, setSelectedProposal] = useState<ProposalWithStatus | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'mine' | 'admin'>('mine');

  const getRole = (proposal: ProposalWithStatus): ProposalRole => {
    if (!address) return 'creator';
    if (proposal.proposer.toLowerCase() === address.toLowerCase()) return 'creator';
    return 'executor';
  };

  const handleSelect = (proposal: ProposalWithStatus) => {
    setSelectedProposal(proposal);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedProposal(null);
  };

  const handleActionComplete = async () => {
    await queryClient.invalidateQueries({ queryKey: ['readContract'] });
    handleClose();
  };

  const isLoading = adminLoading || involvedLoading;

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card variant="default">
          <p className="text-sm font-mono text-white/40 text-center">
            Connect your wallet to view proposals
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-mono uppercase tracking-widest text-white/90 mb-1">
          Proposals
        </h1>
        <p className="text-xs font-mono text-white/30">
          Manage and track mint proposals
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/5">
        <button
          onClick={() => setActiveTab('mine')}
          className={`px-4 py-2 text-xs font-mono uppercase tracking-widest transition-colors ${
            activeTab === 'mine'
              ? 'text-[#15c6e6c0] border-b border-[#15c6e6c0]'
              : 'text-white/30 hover:text-white/50'
          }`}
        >
          My Proposals
          {involvedProposals.length > 0 && (
            <span className="ml-2 text-[10px] font-mono text-white/30">
              ({involvedProposals.length})
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`px-4 py-2 text-xs font-mono uppercase tracking-widest transition-colors ${
            activeTab === 'admin'
              ? 'text-[#15c6e6c0] border-b border-[#15c6e6c0]'
              : 'text-white/30 hover:text-white/50'
          }`}
        >
          Pending Approval
          {adminProposals.length > 0 && (
            <span className="ml-2 text-[10px] font-mono text-white/30">
              ({adminProposals.length})
            </span>
          )}
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <Card variant="default" fullWidth className="flex justify-center p-8">
          <Spinner size="sm" />
        </Card>
      )}

      {/* My Proposals Tab */}
      {!isLoading && activeTab === 'mine' && (
        <>
          {involvedProposals.length === 0 ? (
            <Card variant="default" fullWidth>
              <p className="text-xs font-mono text-white/30 text-center py-8">
                No proposals found
              </p>
            </Card>
          ) : (
            <div className="flex flex-col gap-4">
              {involvedProposals.map((proposal) => (
                <ProposalCard
                  key={proposal.proposalId.toString()}
                  proposal={proposal}
                  role={getRole(proposal)}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Pending Approval Tab */}
      {!isLoading && activeTab === 'admin' && (
        <>
          {adminError && (
            <Card variant="default" fullWidth>
              <p className="text-xs font-mono text-red-400 text-center py-8">
                Failed to load proposals
              </p>
            </Card>
          )}
          {!adminError && adminProposals.length === 0 && (
            <Card variant="default" fullWidth>
              <p className="text-xs font-mono text-white/30 text-center py-8">
                No pending proposals awaiting your approval
              </p>
            </Card>
          )}
          {!adminError && adminProposals.length > 0 && (
            <div className="flex flex-col gap-4">
              {adminProposals.map((proposal) => (
                <ProposalCard
                  key={proposal.proposalId.toString()}
                  proposal={proposal}
                  role="admin"
                  onSelect={handleSelect}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Proposal Detail Modal */}
      {selectedProposal && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleClose}
          title={`Proposal #${selectedProposal.proposalId.toString()}`}
          size="lg"
          closeOnOverlay={false}
        >
          <ApprovalFlow
            proposal={selectedProposal}
            onActionComplete={handleActionComplete}
          />
        </Modal>
      )}
    </div>
  );
}