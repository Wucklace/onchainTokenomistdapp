import { useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from '@wagmi/core';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants';
import { useTxStore } from '@/store';
import { wagmiConfig } from '@/lib';

export function useMintPasses() {
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

  const mintPasses = async (
    proposalId: bigint,
    tier: `0x${string}`,
    recipients: `0x${string}`[],
    proofs: `0x${string}`[][]
  ): Promise<boolean> => {
    try {
      reset();
      setIsPending(true);

      const txHash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'mintPasses',
        args: [proposalId, tier, recipients, proofs],
      });

      setHash(txHash);
      setIsPending(false);
      setIsConfirming(true);

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
    mintPasses,
    isPending: isWritePending,
    isConfirming,
    isConfirmed,
  };
}