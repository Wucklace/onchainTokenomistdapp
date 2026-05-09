export interface VaultInfo {
  tokenAddress: string;
  creator: string;
  admin1: string;
  admin2: string;
  executor: string;
  totalDeposited: bigint;
  createdAt: bigint;
  startBlock: bigint;
  finalized: boolean;
}

export interface TierConfig {
  category: `0x${string}`;
  tier: `0x${string}`;
  allocationPerPass: bigint;
  maxSupply: bigint;
  mintedCount: bigint;
}

export interface TierConfigInput {
  category: `0x${string}`;
  tier: `0x${string}`;
  allocationPerPass: bigint;
  maxSupply: bigint;
}

export interface VestingSchedule {
  enabled: boolean;
  cliff: bigint;
  duration: bigint;
  interval: bigint;
  initialRelease: bigint;
  startBlock: bigint;
  cliffEndBlock: bigint;
  vestingEndBlock: bigint;
  nextUnlockBlock: bigint;
  percentVested: bigint;
}

export interface VestingConfigInput {
  category: `0x${string}`;
  enabled: boolean;
  cliff: bigint;
  duration: bigint;
  interval: bigint;
  initialRelease: bigint;
}

export interface CreateVaultInput {
  tokenAddress: `0x${string}`;  // ERC-20 contract address or NATIVE_TOKEN sentinel
  amount: bigint;
  admin1: `0x${string}`;
  admin2: `0x${string}`;
  executor: `0x${string}`;
  startBlock: bigint;
  tierConfigs: TierConfigInput[];
  vestingConfigs: VestingConfigInput[];
}

export interface VaultSummary {
  vaultId: bigint;
  tokenAddress: `0x${string}`;
  creator: `0x${string}`;
  admin1: `0x${string}`;
  admin2: `0x${string}`;
  executor: `0x${string}`;
  totalDeposited: bigint;
  totalAllocated: bigint;
  totalClaimed: bigint;
  createdAt: bigint;
  startBlock: bigint;
  finalized: boolean;
  categoryCount: bigint;
  totalPassesMinted: bigint;
  totalCompletedClaims: bigint;
  totalActivePasses: bigint;
}

export interface UserPassInfo {
  tokenId: bigint;
  vaultId: bigint;
  category: `0x${string}`;
  tier: `0x${string}`;
  tokenAddress: `0x${string}`;
  allocation: bigint;
  vested: bigint;
  claimed: bigint;
  claimable: bigint;
  locked: bigint;
  fullyVested: bigint;
  nextUnlockBlock: bigint;
  vaultCreatedAt: bigint;
  vaultStartBlock: bigint;
}

export interface CategoryAllocation {
  category: `0x${string}`;
  totalAllocation: bigint;
  totalMinted: bigint;
  totalClaimed: bigint;
  remainingPasses: bigint;
  finalized: boolean;
  tierCount: bigint;
  vestingEnabled: boolean;
}

export interface TierDetails {
  tier: `0x${string}`;
  allocationPerPass: bigint;
  maxSupply: bigint;
  mintedCount: bigint;
  remainingSupply: bigint;
  totalAllocated: bigint;
  passHolderCount: bigint;
}

export interface PlatformStats {
  totalVaults: bigint;
  totalFinalizedVaults: bigint;
  totalPassesMinted: bigint;
  totalCompletedClaims: bigint;
  totalActivePasses: bigint;
  totalDeposited: bigint;
  totalValueLocked: bigint;
  totalDistributed: bigint; 
}