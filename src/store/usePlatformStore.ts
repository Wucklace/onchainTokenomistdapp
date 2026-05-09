// store/usePlatformStore.ts
import { create } from 'zustand';

interface PlatformState {
  registrationFee: bigint | null;
  setRegistrationFee: (fee: bigint) => void;
}

export const usePlatformStore = create<PlatformState>((set) => ({
  registrationFee: null,
  setRegistrationFee: (fee) => set({ registrationFee: fee }),
}));