import { useWriteContract, useReadContract } from 'wagmi';
import { waitForTransactionReceipt } from '@wagmi/core';
import { BaseError, UserRejectedRequestError } from 'viem';
import { useTxStore } from '@/store';
import { CONTRACT_ADDRESS, ERC20_ABI } from '@/constants';
import { wagmiConfig } from '@/lib';

interface UseTokenApproveOptions {
  tokenAddress: `0x${string}` | null | undefined;
  owner: `0x${string}` | null | undefined;
  amount: bigint;
}

export function useTokenApprove({ tokenAddress, owner, amount }: UseTokenApproveOptions) {
  const { writeContractAsync, isPending } = useWriteContract();
  const {
    setHash,
    setIsPending,
    setIsConfirming,
    setIsConfirmed,
    setIsError,
    setError,
    reset,
    isConfirming,
    isConfirmed,
  } = useTxStore();

  const { data: allowance, isLoading: allowanceLoading, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress ?? undefined,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: owner && tokenAddress ? [owner, CONTRACT_ADDRESS] : undefined,
    query: {
      enabled: !!tokenAddress && !!owner,
    },
  });

  const needsApproval = allowance !== undefined ? allowance < amount : true;

  const approveToken = async (
    tokenAddress: `0x${string}`,
    amount: bigint
  ): Promise<boolean> => {
    try {
      reset();
      setIsPending(true);

      const txHash = await writeContractAsync({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [CONTRACT_ADDRESS, amount],
      });

      setHash(txHash);
      setIsPending(false);
      setIsConfirming(true);

      await waitForTransactionReceipt(wagmiConfig, { hash: txHash });

      setIsConfirming(false);
      setIsConfirmed(true);

      await refetchAllowance();

      return true;
    } catch (err) {
      setIsPending(false);
      setIsConfirming(false);

      if (err instanceof BaseError) {
        const isRejected = err.walk(e => e instanceof UserRejectedRequestError);
        if (isRejected) return false;
      }

      setIsError(true);
      setError(err as Error);
      return false;
    }
  };

  return {
    approveToken,
    needsApproval,
    allowance,
    allowanceLoading,
    isPending,
    isConfirming,
    isConfirmed,
  };
}