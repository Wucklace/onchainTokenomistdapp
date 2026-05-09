import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants';
import { type UserPassInfo } from '@/types';

export function useUserPasses( 
  tokenIds: bigint[] = []
) {
  const { data, isLoading, isError, error, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getUserPasses',
    // Now passing the array of tokenIds
    args:tokenIds.length > 0 ? [tokenIds] : undefined,
    query: {
      enabled:tokenIds.length > 0,
    },
  });

  const passes: UserPassInfo[] = data
    ? (data as any[]).map((d) => ({
        tokenId: d.tokenId,
        vaultId: d.vaultId,
        category: d.category,
        tier: d.tier,
        tokenAddress: d.tokenAddress,
        allocation: d.allocation,
        vested: d.vested,
        claimed: d.claimed,
        claimable: d.claimable,
        locked: d.locked,
        fullyVested: d.fullyVested,
        nextUnlockBlock: d.nextUnlockBlock,
        vaultCreatedAt: d.vaultCreatedAt,
        vaultStartBlock: d.vaultStartBlock,
      }))
    : [];

  return { 
    passes, 
    isLoading, 
    isError, 
    error, 
    refetch 
  };
}