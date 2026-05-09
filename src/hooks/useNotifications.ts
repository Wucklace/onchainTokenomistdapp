import { useMemo } from 'react';
import { useWallet } from './useWallet';
import { useUserPasses } from './useUserPasses';
import { useAdminProposals, useTokensByOwner, useInvolvedProposals } from './index';
import { useVaultSummariesByCreator } from './useVaultSummariesByCreator';
import { type Notification } from '@/types';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export function useNotifications() {
  const { address, isConnected } = useWallet();

  const { tokenIds } = useTokensByOwner(address ?? undefined);

  const { passes, isLoading: passesLoading } = useUserPasses(tokenIds);

  const { proposals: adminProposals, isLoading: adminLoading } = useAdminProposals(
    address ?? null
  );

  const { proposals: involvedProposals, isLoading: involvedLoading } = useInvolvedProposals(
    address ?? undefined
  );

  const { summaries, isLoading: vaultsLoading } = useVaultSummariesByCreator(
    address ?? null
  );

  const isLoading = passesLoading || adminLoading || involvedLoading || vaultsLoading;

  const notifications = useMemo<Notification[]>(() => {
    if (!isConnected || !address) return [];

    const items: Notification[] = [];

    // ── Admin — proposals awaiting approval ───────────────────────────────
    for (const p of adminProposals) {
      items.push({
        id: `proposal-pending-${p.proposalId.toString()}`,
        type: 'proposal_pending',
        proposalId: p.proposalId,
        vaultId: p.vaultId,
        category: p.category,
        role: 'admin',
      });
    }

    // ── Creator/Executor — involved proposal notifications ────────────────
    for (const p of involvedProposals) {
      const role = p.proposer.toLowerCase() === address.toLowerCase()
        ? 'creator' as const
        : 'executor' as const;

      if (p.status === 'rejected') {
        items.push({
          id: `proposal-rejected-${p.proposalId.toString()}`,
          type: 'proposal_rejected',
          proposalId: p.proposalId,
          vaultId: p.vaultId,
          category: p.category,
          role,
        });
      }

      if (p.status === 'expired') {
        items.push({
          id: `proposal-expired-${p.proposalId.toString()}`,
          type: 'proposal_expired',
          proposalId: p.proposalId,
          vaultId: p.vaultId,
          category: p.category,
          role,
        });
      }

      if (p.status === 'ready' && !p.executed) {
        items.push({
          id: `mint-ready-${p.proposalId.toString()}`,
          type: 'mint_ready',
          proposalId: p.proposalId,
          vaultId: p.vaultId,
          category: p.category,
          role,
        });
      }
    }

    // ── Creator — vault needs proposal or direct mint ─────────────────────
    for (const v of summaries) {
      const isCreatorOnly = v.admin1 === ZERO_ADDRESS && v.admin2 === ZERO_ADDRESS;
      if (v.finalized) continue;

      if (isCreatorOnly) {
        // Creator only — prompt to mint directly
        items.push({
          id: `mint-direct-${v.vaultId.toString()}`,
          type: 'mint_direct',
          vaultId: v.vaultId,
          role: 'creator',
        });
      } else {
        // Team vault — check if any active non-executed proposal exists
        const hasActiveProposal = involvedProposals.some(
          (p) =>
            p.vaultId === v.vaultId &&
            (p.status === 'pending' || p.status === 'ready') &&
            !p.executed
        );
        if (!hasActiveProposal) {
          items.push({
            id: `proposal-needed-${v.vaultId.toString()}`,
            type: 'proposal_needed',
            vaultId: v.vaultId,
            role: 'creator',
          });
        }
      }
    }

    // ── User — passes with tokens available to claim ──────────────────────
    for (const p of passes) {
      if (p.claimable > 0n) {
        items.push({
          id: `claimable-${p.tokenId.toString()}`,
          type: 'claimable',
          tokenId: p.tokenId,
          vaultId: p.vaultId,
          amount: p.claimable,
          role: 'user',
        });
      }
    }

    // ── User — newly minted passes not yet vested or claimed ──────────────
    for (const p of passes) {
      if (p.claimable === 0n && p.claimed === 0n && p.locked > 0n) {
        items.push({
          id: `minted-${p.tokenId.toString()}`,
          type: 'pass_minted',
          tokenId: p.tokenId,
          vaultId: p.vaultId,
          tier: p.tier,
          role: 'user',
        });
      }
    }

    return items;
  }, [isConnected, address, adminProposals, involvedProposals, passes, summaries]);

  return { notifications, isLoading, isError: false };
}