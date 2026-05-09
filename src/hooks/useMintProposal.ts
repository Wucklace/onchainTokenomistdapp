import { useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from '@wagmi/core';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants';
import { type ProposeMintInput } from '@/types';
import { useTxStore } from '@/store';
import { wagmiConfig } from '@/lib';

export function useMintProposal() {
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
    isConfirmed 
  } = useTxStore();

  const proposeMint = async (input: ProposeMintInput): Promise<boolean> => {
    try {
      reset();
      setIsPending(true);

      const txHash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'proposeMintCategory',
        args: [
          input.vaultId, 
          input.category, 
          input.tierBatches
        ],
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
    proposeMint, 
    isPending: isWritePending,
    isConfirming,
    isConfirmed
  };
}