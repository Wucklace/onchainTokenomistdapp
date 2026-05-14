'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Card, Badge, Button, Spinner } from '@/components/ui';
import { TxStatus } from '@/components/transaction/TxStatus';
import { MerkleVerifier } from '@/components/merkle/MerkleVerifier';
import { useTxStore } from '@/store';
import { useMintPasses } from '@/hooks';
import { formatBytes32, formatTxHash, getTxExplorerUrl } from '@/utils/format';
import { DEFAULT_MINT_BATCH_SIZE } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TierMintPanelProps {
  proposalId: bigint;
  tier: `0x${string}`;
  merkleRoot: `0x${string}`;
  remainingSupply: bigint;
  supplyCount: bigint;
  mintedCount: bigint;
  isBusy: boolean;
  onBusyChange: (busy: boolean) => void;
  onBatchComplete: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TierMintPanel({
  proposalId,
  tier,
  merkleRoot,
  remainingSupply,
  supplyCount,
  mintedCount,
  isBusy,
  onBusyChange,
  onBatchComplete,
}: TierMintPanelProps) {
  const { mintPasses } = useMintPasses();
  const { hash, isPending, isConfirming, isConfirmed, isError, error, reset } = useTxStore();

  const [mintReady, setMintReady] = useState<{
    recipients: `0x${string}`[];
    proofs: `0x${string}`[][];
  } | null>(null);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [mintError, setMintError] = useState<string | null>(null);

  const label = formatBytes32(tier);
  const isActiveBusy = isBusy && progress !== null;

  // ─── Progress bar ──────────────────────────────────────────────────────────
  const mintedNum = Number(mintedCount);
  const supplyNum = Number(supplyCount);
  const progressPct = supplyNum > 0 ? Math.min((mintedNum / supplyNum) * 100, 100) : 0;

  const handleMintReady = (
    recipients: `0x${string}`[],
    proofs: `0x${string}`[][]
  ) => {
    setMintReady({ recipients, proofs });
    setMintError(null);
  };

  const handleMint = async () => {
    if (!mintReady) return;

    const { recipients, proofs } = mintReady;

    if (recipients.length > Number(remainingSupply)) {
      setMintError(
        `Too many recipients — ${recipients.length} provided but only ${remainingSupply.toString()} passes remaining`
      );
      return;
    }

    reset();
    onBusyChange(true);
    setMintError(null);

    const totalBatches = Math.ceil(recipients.length / DEFAULT_MINT_BATCH_SIZE);
    let lastHash: `0x${string}` | undefined;

    for (let b = 0; b < totalBatches; b++) {
      const start = b * DEFAULT_MINT_BATCH_SIZE;
      const end = Math.min(start + DEFAULT_MINT_BATCH_SIZE, recipients.length);

      const batchRecipients = recipients.slice(start, end);
      const batchProofs = proofs.slice(start, end);

      setProgress(`Batch ${b + 1} / ${totalBatches} — ${batchRecipients.length} addresses`);

      const result = await mintPasses(proposalId, tier, batchRecipients, batchProofs);

      if (!result.success) {
        setProgress(null);
        onBusyChange(false);
        return;
      }

      lastHash = result.hash;

      // Refetch after each successful batch so mintedCount + remainingSupply update
      onBatchComplete();
    }

    setProgress(null);
    reset();
    onBusyChange(false);

    if (lastHash) {
      toast.success(
        <span>
          All batches confirmed —{' '}
          <a
            href={getTxExplorerUrl(lastHash!)}
            target="_blank"
            rel="noopener noreferrer"
            className="toast-confirm__link"
            onClick={() => toast.dismiss()}
          >
            {formatTxHash(lastHash!)}
          </a>
        </span>,
       { duration: 5000 }
     );
    }
    setDone(true);
  };

  return (
    <Card variant="default" fullWidth>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono text-[#fa7e09cb] uppercase">{label}</span>
          <span className="text-xs font-mono text-white/30">
            {remainingSupply.toString()} remaining
          </span>
        </div>
        {done && <Badge variant="success" size="sm">Minted ✓</Badge>}
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono text-white/25 uppercase tracking-widest">
            Progress
          </span>
          <span className="text-[10px] font-mono text-white/40">
            {mintedNum} / {supplyNum}
          </span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#15c6e6c0] rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Merkle Verifier — mint mode */}
      {!done && (
        <div className="mb-4">
          <MerkleVerifier
            mode="mint"
            storedRoot={merkleRoot}
            onMintReady={handleMintReady}
            onVerified={(matched) => {
              if (!matched) {
                setMintReady(null);
                setMintError('Root mismatch — recipient list does not match approved proposal');
              }
            }}
            disabled={isBusy}
            label="Paste recipient list to verify and prepare mint"
          />
        </div>
      )}

      {/* Recipient count vs remaining supply */}
      {mintReady && !done && (
        <div className="flex items-center gap-2 mb-4 p-2 bg-white/3 border border-white/5 rounded-sm">
          <p className="text-[10px] font-mono text-white/40">
            {mintReady.recipients.length} recipients
            {' · '}
            {remainingSupply.toString()} remaining
            {' · '}
            {Math.ceil(mintReady.recipients.length / DEFAULT_MINT_BATCH_SIZE)} batch{Math.ceil(mintReady.recipients.length / DEFAULT_MINT_BATCH_SIZE) !== 1 ? 'es' : ''}
          </p>
        </div>
      )}

      {/* Mint error */}
      {mintError && (
        <p className="text-xs font-mono text-red-400 mb-4">{mintError}</p>
      )}

      {/* Batch progress */}
      {progress && (
        <div className="flex items-center gap-2 mb-4">
          <Spinner size="sm" />
          <p className="text-xs font-mono text-white/50">{progress}</p>
        </div>
      )}

      {/* Tx status */}
      {isActiveBusy && (
        <div className="mb-4">
          <TxStatus
            hash={hash}
            isPending={isPending}
            isConfirming={isConfirming}
            isConfirmed={isConfirmed}
            isError={isError}
            error={error}
          />
        </div>
      )}

      {/* Mint button */}
      {!done && (
        <Button
          variant="secondary"
          onClick={handleMint}
          isLoading={isActiveBusy}
          disabled={isBusy || !mintReady || done}
          className="w-full"
        >
          {isActiveBusy
            ? isPending
              ? 'Awaiting Signature...'
              : 'Confirming...'
            : `Mint ${label} Passes 🚀`}
        </Button>
      )}
    </Card>
  );
}