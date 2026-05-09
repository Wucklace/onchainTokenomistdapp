/**
 * Sanitizes URLs before using in href or src attributes.
 * Only allows http and https protocols.
 */
export function sanitizeURL(url: string): string | null {
  if (!url || typeof url !== 'string') return null;

  const trimmed = url.trim();

  try {
    const parsed = new URL(trimmed);

    // Only allow safe protocols
    if (!['https:', 'http:'].includes(parsed.protocol)) return null;

    return parsed.toString();
  } catch (error) {
    return null;
  }
}