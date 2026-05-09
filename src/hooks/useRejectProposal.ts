import { useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from '@wagmi/core';
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
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'rejectMintProposal',
        args: [proposalId],
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
      setIsError(true);
      setError(err as Error);
      setIsPending(false);
      setIsConfirming(false);
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