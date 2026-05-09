import { formatUnits } from 'viem';

/**
 * Formats a token amount from raw bigint to readable string
 * e.g. 1000000000000000000n → "1.00"
 */
export function formatAmount(
  amount: bigint,
  decimals: number = 18,
  displayDecimals: number = 2
): string {
  if (amount === BigInt(0)) return '0';

  const formatted = formatUnits(amount, decimals);
  const number = parseInt(formatted);

  if (number === 0) return '0';

  // For very small numbers
  if (number < 0.0001) return '< 0.0001';

  // For large numbers use compact notation
  if (number >= 1_000_000_000) {
    return `${(number / 1_000_000_000).toFixed(displayDecimals)}B`;
  }
  if (number >= 1_000_000) {
    return `${(number / 1_000_000).toFixed(displayDecimals)}M`;
  }
  if (number >= 1_000) {
    return `${(number / 1_000).toFixed(displayDecimals)}K`;
  }

  return number.toFixed(displayDecimals);
}