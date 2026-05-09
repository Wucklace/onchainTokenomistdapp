import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants';
import { type ProposalWithStatus } from '@/types';

export function useInvolvedProposals(address: `0x${string}` | null | undefined) {
  const { data, isLoading, isError, error, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getInvolvedProposals',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      staleTime: 30_000,
    },
  });

  const proposals: ProposalWithStatus[] = data
    ? (data as any[]).map((d) => ({
        proposalId: d.proposalId,
        vaultId: d.vaultId,
        category: d.category,
        proposer: d.proposer,
        admin1: d.admin1,
        admin2: d.admin2,
        admin1Approved: d.admin1Approved,
        admin2Approved: d.admin2Approved,
        rejected: d.rejected,
        expired: d.expired,
        executed: d.executed,
        proposedAt: d.proposedAt,
        deadline: d.deadline,
        status: d.rejected
          ? 'rejected'
          : d.expired
          ? 'expired'
          : d.executed
          ? 'executed'
          : d.admin1Approved && d.admin2Approved
          ? 'ready'
          : 'pending',
      }))
    : [];

  return { proposals, isLoading, isError, error, refetch };
}