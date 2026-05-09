import { useReadContract } from 'wagmi';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/constants';
import { type VaultSummary } from '@/types';

export function useVaultSummary(vaultId: bigint | null) {
  const { data, isLoading, isError, error, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getVaultSummary',
    args: vaultId !== null ? [vaultId] : undefined,
    query: {
      enabled: vaultId !== null,
    },
  });

  const summary: VaultSummary | null = data
    ? {
        vaultId: data.vaultId,
        tokenAddress: data.tokenAddress,
        creator: data.creator,
        admin1: data.admin1,
        admin2: data.admin2,
        executor: data.executor,
        totalDeposited: data.totalDeposited,
        totalAllocated: data.totalAllocated,
        totalClaimed: data.totalClaimed,
        createdAt: data.createdAt,
        startBlock: data.startBlock,
        finalized: data.finalized,
        categoryCount: data.categoryCount,
        totalPassesMinted: data.totalPassesMinted,
        totalCompletedClaims: data.totalCompletedClaims,
        totalActivePasses: data.totalActivePasses,
      }
    : null;

  return { summary, isLoading, isError, error, refetch };
}