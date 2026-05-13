'use client';

import { useState } from 'react';
import { isAddress } from 'viem';
import { useTxStore } from '@/store';
import { useMintDirect } from '@/hooks';
import { formatBytes32 } from '@/utils/format';
import { DEFAULT_MINT_BATCH_SIZE } from '@/types';
import { Card, Button, Spinner } from '@/components/ui';
import { TxStatus } from '@/components/transaction/TxStatus';

interface DirectMintPanelProps {
  vaultId: bigint;
  category: `0x${string}`;
  tier: `0x${string}`;
  remainingSupply: bigint;
  refetch: () => void;
}

function parseAddresses(raw: string): `0x${string}`[] {
  return raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter((s) => isAddress(s)) as `0x${string}`[];
}

function validateAddresses(raw: string, max: number): string | null {
  const lines = raw.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
  if (lines.length === 0) return 'At least one recipient required';
  const invalid = lines.filter((l) => !isAddress(l));
  if (invalid.length > 0)
    return `Invalid address${invalid.length > 1 ? 'es' : ''}: ${invalid
      .slice(0, 2)
      .join(', ')}${invalid.length > 2 ? '…' : ''}`;
  if (lines.length > max)
    return `Too many recipients — ${lines.length} provided but only ${max} passes remaining`;
  return null;
}

export function DirectMintPanel({
  vaultId,
  category,
  tier,
  remainingSupply,
  refetch,
}: DirectMintPanelProps) {
  const { mintDirect } = useMintDirect();
  const { hash, isPending, isConfirming, isConfirmed, isError, error, reset } = useTxStore();

  const [raw, setRaw] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const isBusy = isPending || isConfirming || progress !== null;
  const validCount = parseAddresses(raw).length;
  const totalBatches = Math.ceil(validCount / DEFAULT_MINT_BATCH_SIZE);

  const handleMint = async () => {
    const err = validateAddresses(raw, Number(remainingSupply));
    if (err) {
      setInputError(err);
      return;
    }

    reset();
    setInputError(null);

    const recipients = parseAddresses(raw);

    for (let b = 0; b < totalBatches; b++) {
      const start = b * DEFAULT_MINT_BATCH_SIZE;
      const end = Math.min(start + DEFAULT_MINT_BATCH_SIZE, recipients.length);
      const batch = recipients.slice(start, end) as `0x${string}`[];

      setProgress(`Batch ${b + 1} / ${totalBatches} — ${batch.length} addresses`);

      const success = await mintDirect(vaultId, category, tier, batch);

      if (!success) {
        setProgress(null);
        return;
      }
    }

    setProgress(null);
    refetch();
    setRaw('');
    reset();
  };

  return (
    <Card variant="default" fullWidth>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono text-[#fa7e09cb] uppercase">
            {formatBytes32(tier)}
          </span>
          <span className="text-xs font-mono text-white/30">
            {remainingSupply.toString()} passes remaining
          </span>
        </div>
        {done && (
          <span className="text-xs font-mono text-emerald-400">Minted ✓</span>
        )}
      </div>

      {!done ? (
        <>
          {/* Address input */}
          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-[10px] font-mono uppercase tracking-widest text-white/30">
              Recipient Addresses
            </label>
            <textarea
              rows={6}
              className={`w-full bg-white/5 border ${
                inputError ? 'border-red-500/50' : 'border-white/10'
              } rounded-sm px-3 py-2 text-xs font-mono text-white/70 placeholder:text-white/20 focus:outline-none focus:border-[#fa7e09cb]/50 resize-none`}
              placeholder={`One address per line or comma separated\n0xabc...\n0xdef...`}
              value={raw}
              onChange={(e) => {
                setRaw(e.target.value);
                setInputError(null);
              }}
              disabled={isBusy}
            />
            {inputError && (
              <p className="text-xs font-mono text-red-400">{inputError}</p>
            )}
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-mono text-white/20">
                {validCount} valid address{validCount !== 1 ? 'es' : ''}
                {validCount > 0 && ` · ${totalBatches} batch${totalBatches !== 1 ? 'es' : ''}`}
              </p>
              <p className="text-[10px] font-mono text-white/20">
                max {remainingSupply.toString()}
              </p>
            </div>
          </div>

          {/* Progress */}
          {progress && (
            <div className="flex items-center gap-2 mb-4">
              <Spinner size="sm" />
              <p className="text-xs font-mono text-white/50">{progress}</p>
            </div>
          )}

          {/* Tx status */}
          <TxStatus
            hash={hash}
            isPending={isPending}
            isConfirming={isConfirming}
            isConfirmed={isConfirmed}
            isError={isError}
            error={error}
          />

          <Button
            variant="primary"
            onClick={handleMint}
            isLoading={isBusy}
            disabled={isBusy || validCount === 0}
            className="w-full mt-4"
          >
            {isBusy
              ? isPending
                ? 'Awaiting Signature...'
                : 'Confirming...'
              : `Mint ${formatBytes32(tier)} Passes 🚀`}
          </Button>
        </>
      ) : (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <p className="text-sm font-mono text-white/70">
            {validCount} passes minted successfully
          </p>
        </div>
      )}
    </Card>
  );
}