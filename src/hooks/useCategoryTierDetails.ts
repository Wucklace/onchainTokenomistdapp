import { useReadContract } from 'wagmi';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/constants';
import { type TierDetails } from '@/types';

export function useCategoryTierDetails(
  vaultId: bigint | null,
  category: `0x${string}` | null,
) {
  const { data, isLoading, isError, error, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getCategoryTierDetails',
    args: vaultId !== null && category !== null ? [vaultId, category] : undefined,
    query: { enabled: vaultId !== null && category !== null },
  });

  return {
    tiers: (data as TierDetails[] | undefined) ?? [],
    isLoading,
    isError,
    error,
    refetch,
  };
}