'use client';

import { isAddress } from 'viem';
import { Button } from '@/components/ui';
import { useState, useCallback } from 'react';
import { StandardMerkleTree } from '@openzeppelin/merkle-tree';

// ─── Types ────────────────────────────────────────────────────────────────────

export type MerkleVerifierMode = 'compute' | 'verify' | 'mint';

interface MerkleVerifierProps {
  mode: MerkleVerifierMode;
  storedRoot?: `0x${string}`;                                          // verify + mint
  onComputed?: (root: `0x${string}`, recipients: `0x${string}`[]) => void; // compute
  onVerified?: (matched: boolean) => void;                             // verify
  onMintReady?: (recipients: `0x${string}`[], proofs: `0x${string}`[][]) => void; // mint
  disabled?: boolean;
  label?: string; // tier name or custom label
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseAddresses(raw: string): `0x${string}`[] {
  return raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter((s) => isAddress(s)) as `0x${string}`[];
}

function validateAddresses(raw: string): string | null {
  const lines = raw.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
  if (lines.length === 0) return 'At least one address required';
  const invalid = lines.filter((l) => !isAddress(l));
  if (invalid.length > 0)
    return `Invalid address${invalid.length > 1 ? 'es' : ''}: ${invalid
      .slice(0, 2)
      .join(', ')}${invalid.length > 2 ? '…' : ''}`;
  return null;
}

function buildTree(recipients: `0x${string}`[]) {
  return StandardMerkleTree.of(recipients.map((r) => [r]), ['address']);
}

function getProofs(
  tree: ReturnType<typeof buildTree>,
  recipients: `0x${string}`[]
): `0x${string}`[][] {
  return recipients.map((recipient) => {
    for (const [i, v] of tree.entries()) {
      if ((v[0] as string).toLowerCase() === recipient.toLowerCase()) {
        return tree.getProof(i) as `0x${string}`[];
      }
    }
    throw new Error(`Recipient ${recipient} not found in tree`);
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MerkleVerifier({
  mode,
  storedRoot,
  onComputed,
  onVerified,
  onMintReady,
  disabled = false,
  label,
}: MerkleVerifierProps) {
  const [raw, setRaw] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [computedRoot, setComputedRoot] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const validCount = parseAddresses(raw).length;

  const handleProcess = useCallback(() => {
    const err = validateAddresses(raw);
    if (err) {
      setError(err);
      setComputedRoot(null);
      setMatchResult(null);
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      const recipients = parseAddresses(raw);
      const tree = buildTree(recipients);
      const root = tree.root as `0x${string}`;

      setComputedRoot(root);

      if (mode === 'compute') {
        onComputed?.(root, recipients);
      }

      if (mode === 'verify' && storedRoot) {
        const matched = root.toLowerCase() === storedRoot.toLowerCase();
        setMatchResult(matched);
        onVerified?.(matched);
      }

      if (mode === 'mint' && storedRoot) {
        const matched = root.toLowerCase() === storedRoot.toLowerCase();
        setMatchResult(matched);
        if (matched) {
          const proofs = getProofs(tree, recipients);
          onMintReady?.(recipients, proofs);
        } else {
          onVerified?.(false);
        }
      }
    } catch (e) {
      setError('Failed to compute merkle tree');
    } finally {
      setIsProcessing(false);
    }
  }, [raw, mode, storedRoot, onComputed, onVerified, onMintReady]);

  const handleClear = () => {
    setRaw('');
    setError(null);
    setComputedRoot(null);
    setMatchResult(null);
  };

  const buttonLabel =
    mode === 'compute' ? 'Compute Root' :
    mode === 'verify'  ? 'Verify Root' :
    'Prepare Mint';

  return (
    <div className="flex flex-col gap-2">
      {/* Label */}
      {label && (
        <p className="text-[10px] font-mono uppercase tracking-widest text-white/30">
          {label}
        </p>
      )}

      {/* Textarea */}
      <textarea
        rows={5}
        className={`w-full bg-white/5 border ${
          error ? 'border-red-500/50' : 'border-white/10'
        } rounded-sm px-3 py-2 text-xs font-mono text-white/70 placeholder:text-white/20 focus:outline-none focus:border-[#15c6e6c0]/50 resize-none`}
        placeholder={`Recipient addresses — one per line or comma separated\n0xabc...\n0xdef...`}
        value={raw}
        onChange={(e) => {
          setRaw(e.target.value);
          setError(null);
          setComputedRoot(null);
          setMatchResult(null);
        }}
        disabled={disabled || isProcessing}
      />

      {/* Address count */}
      <p className="text-[10px] font-mono text-white/20">
        {validCount} valid address{validCount !== 1 ? 'es' : ''}
      </p>

      {/* Error */}
      {error && (
        <p className="text-xs font-mono text-red-400">{error}</p>
      )}

      {/* Computed root — compute mode */}
      {mode === 'compute' && computedRoot && (
        <div className="flex flex-col gap-1 p-3 bg-white/3 border border-white/5 rounded-sm">
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/30">
            Computed Merkle Root
          </p>
          <p className="text-[10px] font-mono text-white/60 break-all">{computedRoot}</p>
        </div>
      )}

      {/* Match result — verify + mint mode */}
      {(mode === 'verify' || mode === 'mint') && matchResult !== null && (
        <div className={`flex items-center gap-2 p-3 rounded-sm border ${
          matchResult
            ? 'bg-emerald-500/10 border-emerald-500/30'
            : 'bg-red-500/10 border-red-500/30'
        }`}>
          <span className="text-sm">{matchResult ? '✅' : '❌'}</span>
          <p className={`text-xs font-mono ${matchResult ? 'text-emerald-400' : 'text-red-400'}`}>
            {matchResult
              ? mode === 'mint'
                ? 'Root matched — ready to mint'
                : 'Root matched — safe to approve'
              : 'Root mismatch — do not proceed'}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleProcess}
          isLoading={isProcessing}
          disabled={disabled || isProcessing || !raw.trim()}
        >
          {buttonLabel}
        </Button>
        {raw && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={disabled || isProcessing}
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}