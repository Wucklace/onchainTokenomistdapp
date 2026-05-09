import { create } from 'zustand';
import { type ProposalWithStatus } from '@/types';

interface ProposalStore {
  selectedProposalId: bigint | null;
  selectedProposal: ProposalWithStatus | null;
  proposals: ProposalWithStatus[];
  setSelectedProposalId: (id: bigint | null) => void;
  setSelectedProposal: (proposal: ProposalWithStatus | null) => void;
  setProposals: (proposals: ProposalWithStatus[]) => void;
  updateProposal: (id: bigint, updated: Partial<ProposalWithStatus>) => void;
  reset: () => void;
}

const initialState = {
  selectedProposalId: null,
  selectedProposal: null,
  proposals: [],
};

export const useProposalStore = create<ProposalStore>((set) => ({
  ...initialState,

  setSelectedProposalId: (id) => set({ selectedProposalId: id }),
  setSelectedProposal: (proposal) => set({ selectedProposal: proposal }),
  setProposals: (proposals) => set({ proposals }),
  updateProposal: (id, updated) =>
    set((state) => ({
      proposals: state.proposals.map((p) =>
        p.proposalId === id ? { ...p, ...updated } : p
      ),
    })),
  reset: () => set(initialState),
}));