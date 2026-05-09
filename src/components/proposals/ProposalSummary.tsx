'use client';

import { useBlockNumber } from 'wagmi';
import { type ProposalWithStatus } from '@/types';
import { Card, Badge } from '@/components/ui';
import { formatBytes32, formatBlockToDate } from '@/utils/format';

export function ProposalSummary({
  proposal,
  proposalId,
}: {
  proposal: ProposalWithStatus;
  proposalId: bigint;
}) {
  const statusVariant =
    proposal.status === 'executed'
      ? 'neonBlue'
      : proposal.status === 'ready'
      ? 'success'
      : proposal.status === 'rejected' || proposal.status === 'expired'
      ? 'danger'
      : 'neonOrange';

  const { data: currentBlock } = useBlockNumber();

  const deadlineLabel = proposal.executed
    ? 'Completed'
    : proposal.expired
    ? 'Expired'
    : `${formatBlockToDate(BigInt(proposal.deadline || 0), BigInt(currentBlock || 0))}`;

  return (
    <Card variant="default" fullWidth>
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-mono uppercase tracking-widest text-white/40">
            Proposal #{proposalId.toString()}
          </span>
          <span className="text-sm font-mono text-[#15c6e6c0]">
            {formatBytes32(proposal.category)}
          </span>
        </div>
        <Badge variant={statusVariant} dot>
          {proposal.status}
        </Badge>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/25 mb-1">
            Vault
          </p>
          <p className="text-xs font-mono text-white/60">
            #{proposal.vaultId.toString()}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/25 mb-1">
            Admin 1
          </p>
          <p className="text-xs font-mono">
            {proposal.admin1Approved ? (
              <span className="text-emerald-400">Approved</span>
            ) : (
              <span className="text-[#fa7e09cb]">Pending</span>
            )}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/25 mb-1">
            Admin 2
          </p>
          <p className="text-xs font-mono">
            {proposal.admin2Approved ? (
              <span className="text-emerald-400">Approved</span>
            ) : proposal.admin2 === '0x0000000000000000000000000000000000000000' ? (
              <span className="text-white/20">—</span>
            ) : (
              <span className="text-[#fa7e09cb]">Pending</span>
            )}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/25 mb-1">
            Deadline
          </p>
          <p className={`text-xs font-mono ${proposal.expired ? 'text-red-400' : proposal.executed ? 'text-[#15c6e6c0]' : 'text-white/60'}`}>
            {deadlineLabel}
          </p>
        </div>
      </div>
    </Card>
  );
}