import { create } from 'zustand';
import { type WalletState } from '@/types';

interface WalletStore extends WalletState {
  setAddress: (address: string | undefined) => void;
  setIsConnected: (isConnected: boolean) => void;
  setChainId: (chainId: number | undefined) => void;
  setIsCorrectNetwork: (isCorrectNetwork: boolean) => void;
  reset: () => void;
}

const initialState: WalletState = {
  address: undefined,
  isConnected: false,
  isConnecting: false,
  isDisconnected: true,
  chainId: undefined,
  isCorrectNetwork: false,
};

export const useWalletStore = create<WalletStore>((set) => ({
  ...initialState,

  setAddress: (address) => set({ address }),
  setIsConnected: (isConnected) => set({ isConnected }),
  setChainId: (chainId) => set({ chainId }),
  setIsCorrectNetwork: (isCorrectNetwork) => set({ isCorrectNetwork }),
  reset: () => set(initialState),
}));