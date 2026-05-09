import { useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from '@wagmi/core';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants';
import { useTxStore } from '@/store';
import { wagmiConfig } from '@/lib';

export function useMintDirect() {
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

  const mintDirect = async (
    vaultId: bigint,
    category: `0x${string}`,
    tier: `0x${string}`,
    recipients: `0x${string}`[]
  ): Promise<boolean> => {
    try {
      reset();
      setIsPending(true);

      const txHash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'mintDirect',
        args: [vaultId, category, tier, recipients],
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
    mintDirect,
    isPending: isWritePending,
    isConfirming,
    isConfirmed,
  };
}