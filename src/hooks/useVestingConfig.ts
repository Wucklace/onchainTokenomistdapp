import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants';
import { type VestingSchedule } from '@/types';

export function useVestingConfig(
  vaultId: bigint | null,
  category: `0x${string}` | null
) {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getVestingSchedule',
    args: vaultId && category ? [vaultId, category] : undefined,
    query: {
      enabled: vaultId !== null && category !== null,
    },
  });

  const vestingConfig: VestingSchedule | null = data
    ? {
        enabled: (data as any).enabled,
        cliff: (data as any).cliff,
        duration: (data as any).duration,
        interval: (data as any).interval,
        initialRelease: (data as any).initialRelease,
        startBlock: (data as any).startBlock,
        cliffEndBlock: (data as any).cliffEndBlock,
        vestingEndBlock: (data as any).vestingEndBlock,
        nextUnlockBlock: (data as any).nextUnlockBlock,
        percentVested: (data as any).percentVested,
      }
    : null;

  return {
    vestingConfig,
    isLoading,
    isError,
    error,
    refetch,
  };
}