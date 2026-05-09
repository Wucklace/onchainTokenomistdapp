import { fromHex } from 'viem';

export function formatBytes32(bytes32: `0x${string}`): string {
  if (!bytes32) return '';

  try {
    // 1. Convert hex → raw Uint8Array (32 bytes)
    const bytes = fromHex(bytes32, 'bytes');

    // 2. Find where the actual string ends (first null byte)
    let end = bytes.indexOf(0);
    if (end === -1) end = 32; // no null byte means all 32 bytes are content

    // 3. Decode only the content bytes as UTF-8
    return new TextDecoder('utf-8').decode(bytes.slice(0, end));
  } catch {
    return bytes32; // fallback: return raw hex rather than empty string
  }
}

/**
 * Converts a string to bytes32 hex
 * e.g. "Team" → 0x5465616d000...
 */
//export function stringToBytes32(value: string): `0x${string}` {
 // const encoder = new TextEncoder();
 // const encoded = encoder.encode(value);
 // const padded = new Uint8Array(32);
 // padded.set(encoded.slice(0, 32));
 // return `0x${Buffer.from(padded).toString('hex')}`;
//}

export function stringToBytes32(value: string): `0x${string}` {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(value);
  const padded = new Uint8Array(32);
  padded.set(encoded.slice(0, 32));

  // ✅ No Buffer — browser-safe
  return `0x${Array.from(padded)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')}` as `0x${string}`;
}