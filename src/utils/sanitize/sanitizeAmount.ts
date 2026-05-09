/**
 * Sanitizes token amount inputs.
 * Removes non-numeric characters except decimals.
 * Returns cleaned string or null if invalid.
 */
export function sanitizeAmount(amount: string, decimals: number = 18): string | null {
  // Remove any character that's not a digit or decimal point
  const cleaned = amount.trim().replace(/[^0-9.]/g, '');

  // Reject if empty
  if (!cleaned || cleaned === '.') return null;

  // Reject multiple decimal points
  if ((cleaned.match(/\./g) || []).length > 1) return null;

  // Reject negative values
  if (parseFloat(cleaned) < 0) return null;

  // Enforce decimal places limit
  const parts = cleaned.split('.');
  if (parts[1] && parts[1].length > decimals) return null;

  return cleaned;
}