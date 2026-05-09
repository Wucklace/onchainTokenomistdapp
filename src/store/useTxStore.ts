import { create } from 'zustand';
import { type TransactionState } from '@/types';

interface TxStore extends TransactionState {
  setHash: (hash: `0x${string}` | undefined) => void;
  setIsPending: (isPending: boolean) => void;
  setIsConfirming: (isConfirming: boolean) => void;
  setIsConfirmed: (isConfirmed: boolean) => void;
  setIsError: (isError: boolean) => void;
  setError: (error: Error | null) => void;
  reset: () => void;
}

const initialState: TransactionState = {
  hash: undefined,
  isPending: false,
  isConfirming: false,
  isConfirmed: false,
  isError: false,
  error: null,
};

export const useTxStore = create<TxStore>((set) => ({
  ...initialState,

  setHash: (hash) => set({ hash }),
  setIsPending: (isPending) => set({ isPending }),
  setIsConfirming: (isConfirming) => set({ isConfirming }),
  setIsConfirmed: (isConfirmed) => set({ isConfirmed }),
  setIsError: (isError) => set({ isError }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));