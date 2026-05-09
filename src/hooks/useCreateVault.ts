import { useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from '@wagmi/core';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants';
import { type CreateVaultInput } from '@/types';
import { useTxStore } from '@/store';
import { wagmiConfig } from '@/lib';

export function useCreateVault() {
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

  const createVault = async (
    input: CreateVaultInput,
    fee: bigint
  ): Promise<boolean> => {
    try {
      reset();
      setIsPending(true);

      const txHash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'createVault',
        args: [
          input.tokenAddress as `0x${string}`,
          input.amount,
          input.admin1 as `0x${string}`,
          input.admin2 as `0x${string}`,
          input.executor as `0x${string}`,
          input.startBlock,
          input.tierConfigs,
          input.vestingConfigs,
        ],
        value: fee,
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
    createVault,
    isPending,
    isConfirming,
    isConfirmed,
  };
}