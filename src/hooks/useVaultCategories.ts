import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants';

export function useVaultCategories(vaultId: bigint | null) {
  const {
    data: categories,
    isLoading,
    isError,
    error,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getVaultCategories',
    args: vaultId ? [vaultId] : undefined,
    query: {
      enabled: vaultId !== null,
    },
  });

  return {
    categories: categories ?? [],
    isLoading,
    isError,
    error,
    refetch,
  };
}

export function useCategoryTiers(
  vaultId: bigint | null,
  category: `0x${string}` | null
) {
  const {
    data: tiers,
    isLoading,
    isError,
    error,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getCategoryTiers',
    args: vaultId && category ? [vaultId, category] : undefined,
    query: {
      enabled: vaultId !== null && category !== null,
    },
  });

  return {
    tiers: tiers ?? [],
    isLoading,
    isError,
    error,
    refetch,
  };
}