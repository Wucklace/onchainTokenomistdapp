import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants';
import { type PlatformStats } from '@/types';

export function usePlatformStats() {
  const { data, isLoading, isError, error, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getPlatformStats',
  });

  const stats: PlatformStats | null = data
    ? {
        totalVaults: (data as any).totalVaults,
        totalFinalizedVaults: (data as any).totalFinalizedVaults,
        totalPassesMinted: (data as any).totalPassesMinted,
        totalCompletedClaims: (data as any).totalCompletedClaims,
        totalActivePasses: (data as any).totalActivePasses,
        totalDeposited: (data as any).totalDeposited,
        totalValueLocked: (data as any).totalValueLocked,
        totalDistributed: (data as any).totalDistributed,
      }
    : null;

  return { stats, isLoading, isError, error, refetch };
}