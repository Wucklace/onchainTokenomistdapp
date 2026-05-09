import { useWriteContract, useReadContract } from 'wagmi';
import { waitForTransactionReceipt } from '@wagmi/core';
import { useTxStore } from '@/store';
import { CONTRACT_ADDRESS } from '@/constants';
import { wagmiConfig } from '@/lib';

const ERC20_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

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

      // Refetch allowance after approval so needsApproval updates
      await refetchAllowance();

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
    approveToken,
    needsApproval,
    allowance,
    allowanceLoading,
    isPending,
    isConfirming,
    isConfirmed,
  };
}