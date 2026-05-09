/**
 * Nexus testnet block time constants
 * 1 block = 1 real-world seconds
 * 1 day = 86,400 blocks
 */

const BLOCK_TIME_MS = 1000;
const BLOCKS_PER_DAY = 86400;

/**
 * Estimates a future date from a target block number
 */
export function formatBlockToDate(
  targetBlock: bigint,
  currentBlock: bigint
): string {
  if (targetBlock <= currentBlock) return 'Already passed';

  const blocksRemaining = targetBlock - currentBlock;
  const msRemaining = Number(blocksRemaining) * BLOCK_TIME_MS;

  const date = new Date(Date.now() + msRemaining);

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  });
}

/**
 * Returns blocks remaining as human readable string
 * e.g. 86,400 → "~1 day"
 */
export function formatBlocksRemaining(blocks: bigint): string {
  if (blocks <= BigInt(0)) return 'Now';

  const totalSeconds = (Number(blocks) * BLOCK_TIME_MS) / 1000;

  if (totalSeconds < 60) return `~${Math.floor(totalSeconds)}s`;
  if (totalSeconds < 3600) return `~${Math.floor(totalSeconds / 60)}m`;
  if (totalSeconds < 86400) return `~${Math.floor(totalSeconds / 3600)}h`;
  if (totalSeconds < 604800) return `~${Math.floor(totalSeconds / 86400)}d`;

  return `~${Math.floor(totalSeconds / 604800)}w`;
}

/**
 * Converts blocks to real-world days
 */
export function blocksToRealDays(blocks: bigint): number {
  return Number(blocks) / BLOCKS_PER_DAY;
}

/**
 * Converts real-world days to blocks
 */
export function daysToBlocks(days: number): bigint {
  return BigInt(Math.floor(days * BLOCKS_PER_DAY));
}

/**
 * Converts a date to estimated block number
 */
export function dateToBlock(
  date: Date,
  currentBlock: bigint
): bigint {
  const msFromNow = date.getTime() - Date.now();
  if (msFromNow <= 0) return currentBlock;
  const blocksFromNow = Math.floor(msFromNow / BLOCK_TIME_MS);
  return currentBlock + BigInt(blocksFromNow);
}