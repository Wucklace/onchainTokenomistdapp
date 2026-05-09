import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants';

export function useTokensByOwner(owner: `0x${string}` | undefined) {
  const { data, isLoading, isError, error, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getOwnerTokenIds',
    args: owner ? [owner] : undefined,
    query: {
      enabled: !!owner,
      staleTime: 30_000,
    },
  });

  const tokenIds: bigint[] = data ? (data as bigint[]) : [];

  return { tokenIds, isLoading, isError, error, refetch };
}