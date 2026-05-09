export interface ProposalInfo {
  vaultId: bigint;
  category: `0x${string}`;
  proposer: string;
  admin1: string;
  admin2: string;
  admin1Approved: boolean;
  admin2Approved: boolean;
  rejected: boolean;
  expired: boolean;
  executed: boolean;
  proposedAt: bigint;
  deadline: bigint;
}

export type ProposalStatus = 'pending' | 'ready' | 'rejected' | 'expired' | 'executed';

export interface ProposalWithStatus extends ProposalInfo {
  proposalId: bigint;
  status: ProposalStatus;
}

/**
 * Tier batch for proposal creation — merkle root of recipient list per tier
 * root = StandardMerkleTree root of recipient addresses
 * No addresses stored on-chain
 * supplyCount is the total number of proposed passes = sum of reciepients in a proposal
 */
export interface TierBatch {
  tier: `0x${string}`;
  merkleRoot: `0x${string}`;
  supplyCount: bigint,
}

export interface ProposeMintInput {
  vaultId: bigint;
  category: `0x${string}`;
  tierBatches: TierBatch[];
}

/**
 * Recipient list per tier for mint operations
 * Used by both mintPasses (team mode) and mintDirect (creator only mode)
 */
export interface TierRecipients {
  tier: `0x${string}`;
  recipients: `0x${string}`[];
}

/**
 * Batch size for splitting large recipient lists
 */
export const DEFAULT_MINT_BATCH_SIZE = 100;