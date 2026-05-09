import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants';

export interface ProposalTierDetail {
  tier: `0x${string}`;
  merkleRoot: `0x${string}`;
  remainingSupply: bigint;
  supplyCount: bigint;
  mintedCount: bigint;
}

export function useProposalTiers(proposalId: bigint | null) {
  const { data, isLoading, isError, error, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getProposalTiers',
    args: proposalId !== null ? [proposalId] : undefined,
    query: { enabled: proposalId !== null },
  });

  const tiers: ProposalTierDetail[] = data
    ? (data[0] as `0x${string}`[]).map((tier, i) => ({
        tier,
        merkleRoot: (data[1] as `0x${string}`[])[i],
        remainingSupply: (data[2] as bigint[])[i],
        supplyCount: (data[3] as bigint[])[i],
        mintedCount: (data[4] as bigint[])[i],
      }))
    : [];

  const admin1Approved: boolean = data ? (data[5] as boolean) : false;
  const admin2Approved: boolean = data ? (data[6] as boolean) : false;
  const rejected: boolean = data ? (data[7] as boolean) : false;
  const expired: boolean = data ? (data[8] as boolean) : false;
  const executed: boolean = data ? (data[9] as boolean) : false;

  return {
    tiers,
    admin1Approved,
    admin2Approved,
    rejected,
    expired,
    executed,
    isLoading,
    isError,
    error,
    refetch,
  };
}