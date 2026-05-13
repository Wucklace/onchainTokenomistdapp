import { useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from '@wagmi/core';
import { BaseError, UserRejectedRequestError, decodeEventLog } from 'viem';
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
    fee:   bigint
  ): Promise<bigint | false> => {
    try {
      reset();
      setIsPending(true);

      const txHash = await writeContractAsync({
        address:      CONTRACT_ADDRESS,
        abi:          CONTRACT_ABI,
        functionName: 'createVault',
        args: [
          input.tokenAddress as `0x${string}`,
          input.amount,
          input.admin1    as `0x${string}`,
          input.admin2    as `0x${string}`,
          input.executor  as `0x${string}`,
          input.startBlock,
          input.tierConfigs,
          input.vestingConfigs,
        ],
        value: fee,
      });

      setHash(txHash);
      setIsPending(false);
      setIsConfirming(true);

      const receipt = await waitForTransactionReceipt(wagmiConfig, { hash: txHash });

      // ── Parse VaultCreated event from receipt ─────────────────────────────
      let vaultId: bigint | undefined;

      for (const log of receipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi:      CONTRACT_ABI,
            data:     log.data,
            topics:   log.topics,
          });
          if (decoded.eventName === 'VaultCreated') {
            vaultId = (decoded.args as { vaultId: bigint }).vaultId;
            break;
          }
        } catch {
          // log belongs to a different event — skip
        }
      }

      if (vaultId === undefined) {
        throw new Error('VaultCreated event not found in receipt');
      }

      setIsConfirming(false);
      setIsConfirmed(true);
      return vaultId;
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
    createVault,
    isPending,
    isConfirming,
    isConfirmed,
  };
}