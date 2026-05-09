import { create } from 'zustand';
import { type VaultInfo } from '@/types';

interface VaultStore {
  selectedVaultId: bigint | null;
  selectedVault: VaultInfo | null;
  vaultIds: bigint[];
  setSelectedVaultId: (id: bigint | null) => void;
  setSelectedVault: (vault: VaultInfo | null) => void;
  setVaultIds: (ids: bigint[]) => void;
  reset: () => void;
}

const initialState = {
  selectedVaultId: null,
  selectedVault: null,
  vaultIds: [],
};

export const useVaultStore = create<VaultStore>((set) => ({
  ...initialState,

  setSelectedVaultId: (id) => set({ selectedVaultId: id }),
  setSelectedVault: (vault) => set({ selectedVault: vault }),
  setVaultIds: (ids) => set({ vaultIds: ids }),
  reset: () => set(initialState),
}));