import { useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from '@wagmi/core';
import { BaseError, UserRejectedRequestError } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants';
import { useTxStore } from '@/store';
import { wagmiConfig } from '@/lib';
import { useQueryClient } from '@tanstack/react-query';

export function useRejectProposal() {
  const { writeContractAsync, isPending: isWritePending } = useWriteContract();
  const queryClient = useQueryClient();

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

  const rejectProposal = async (proposalId: bigint): Promise<boolean> => {
    try {
      reset();
      setIsPending(true);

      const txHash = await writeContractAsync({
        address:      CONTRACT_ADDRESS,
        abi:          CONTRACT_ABI,
        functionName: 'rejectMintProposal',
        args:         [proposalId],
      });

      setHash(txHash);
      setIsPending(false);
      setIsConfirming(true);

      await waitForTransactionReceipt(wagmiConfig, { hash: txHash });

      setIsConfirming(false);
      setIsConfirmed(true);

      // Invalidate all read contract queries so notifications + proposal status refresh
      await queryClient.invalidateQueries({ queryKey: ['readContract'] });

      return true;
    } catch (err) {
      setIsPending(false);
      setIsConfirming(false);

      // User deliberately rejected — silent, don't set error state
      if (err instanceof BaseError) {
        const isRejected = err.walk(e => e instanceof UserRejectedRequestError);
        if (isRejected) return false;
      }

      // Any other error — set error state as before
      setIsError(true);
      setError(err as Error);
      return false;
    }
  };

  return {
    rejectProposal,
    isPending: isWritePending,
    isConfirming,
    isConfirmed,
  };
}