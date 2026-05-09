export type Notification =
  | { id: string; type: 'proposal_pending';  proposalId: bigint; vaultId: bigint; category: `0x${string}`; role: 'admin' }
  | { id: string; type: 'proposal_rejected'; proposalId: bigint; vaultId: bigint; category: `0x${string}`; role: 'creator' | 'executor' }
  | { id: string; type: 'proposal_expired';  proposalId: bigint; vaultId: bigint; category: `0x${string}`; role: 'creator' | 'executor' }
  | { id: string; type: 'proposal_needed';   vaultId: bigint;                                               role: 'creator' }
  | { id: string; type: 'mint_ready';        proposalId: bigint; vaultId: bigint; category: `0x${string}`; role: 'creator' | 'executor' }
  | { id: string; type: 'mint_direct';       vaultId: bigint;                                               role: 'creator' | 'executor' }
  | { id: string; type: 'claimable';         tokenId: bigint;    vaultId: bigint; amount: bigint;           role: 'user' }
  | { id: string; type: 'pass_minted';       tokenId: bigint;    vaultId: bigint; tier: `0x${string}`;      role: 'user' }