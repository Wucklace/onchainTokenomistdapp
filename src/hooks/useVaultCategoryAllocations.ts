import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants';
import { type CategoryAllocation } from '@/types';

export function useVaultCategoryAllocations(vaultId: bigint | null) {
  const { data, isLoading, isError, error, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getVaultCategoryAllocations',
    args: vaultId !== null ? [vaultId] : undefined,
    query: { enabled: vaultId !== null },
  });

  return {
    allocations: (data as CategoryAllocation[] | undefined) ?? [],
    isLoading,
    isError,
    error,
    refetch,
  };
}