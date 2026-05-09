import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants';
import { type VaultSummary } from '@/types';

export function useVaultSummaries(startId: bigint, count: bigint) {
  const { data, isLoading, isError, error, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getVaultSummaries',
    args: [startId, count],
    query: {
      enabled: count > 0n,
    },
  });

  const summaries: VaultSummary[] = data
    ? data.map((d) => ({
        vaultId: d.vaultId,
        tokenAddress: d.tokenAddress,
        creator: d.creator,
        admin1: d.admin1,
        admin2: d.admin2,
        executor: d.executor,
        totalDeposited: d.totalDeposited,
        totalAllocated: d.totalAllocated,
        totalClaimed: d.totalClaimed,
        createdAt: d.createdAt,
        startBlock: d.startBlock,
        finalized: d.finalized,
        categoryCount: d.categoryCount,
        totalPassesMinted: d.totalPassesMinted,
        totalCompletedClaims: d.totalCompletedClaims,
        totalActivePasses: d.totalActivePasses,
      }))
    : [];

  return { summaries, isLoading, isError, error, refetch };
}