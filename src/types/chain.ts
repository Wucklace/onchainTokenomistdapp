import { type Chain } from 'viem';

export interface WalletState {
  address: string | undefined;
  isConnected: boolean;
  isConnecting: boolean;
  isDisconnected: boolean;
  chainId: number | undefined;
  isCorrectNetwork: boolean;
}

export interface TransactionState {
  hash: `0x${string}` | undefined;
  isPending: boolean;
  isConfirming: boolean;
  isConfirmed: boolean;
  isError: boolean;
  error: Error | null;
}

export type SupportedChain = Chain & {
  testnet: boolean;
};