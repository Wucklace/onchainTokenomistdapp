import { useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from '@wagmi/core';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants';
import { useTxStore } from '@/store';
import { wagmiConfig } from '@/lib';

export function useClaim() {
  const { writeContractAsync, isPending: isWritePending } = useWriteContract();
  
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

  const claim = async (tokenIds: bigint[]): Promise<boolean> => {
    try {
      reset();
      setIsPending(true);

      const txHash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'claim',
        args: [tokenIds],
      });

      setHash(txHash);
      setIsPending(false);
      setIsConfirming(true);

      // Wait for confirmation
      await waitForTransactionReceipt(wagmiConfig, { hash: txHash });

      setIsConfirming(false);
      setIsConfirmed(true);

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
    claim,
    isPending: isWritePending,
    isConfirming,
    isConfirmed,
  };
}