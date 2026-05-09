'use client';

import { useCallback } from 'react';
import { wagmiConfig } from '@/lib';
import { useBlockNumber } from 'wagmi';
import { readContract } from '@wagmi/core';
import { useRouter } from 'next/navigation';
import { isAddress, parseEther } from 'viem';
import { Button, Modal } from '@/components/ui';
import { TxStatus } from '@/components/transaction';
import { useCreateVault, useTokenApprove, useWallet } from '@/hooks';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants';
import { stringToBytes32, daysToBlocks, dateToBlock } from '@/utils/format';
import { useWizardStore, selectCreateVaultPayload, useTxStore, useCreateModal, usePlatformStore } from '@/store';
import { type CreateVaultInput, type TierConfigInput, type VestingConfigInput } from '@/types';
import { Step1TokenInfo, Step2Categories, Step3Vesting, Step4ApprovalSetup } from '@/components/vault/wizard';

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = [
  'Token Info',
  'Categories & Tiers',
  'Vesting',
  'Approval Setup',
] as const;

const ZERO = '0x0000000000000000000000000000000000000000';

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ 
  currentStep,
  onClose,
  isBusy,
}: { 
  currentStep: number;
  onClose: () => void;
  isBusy: boolean;
}) {
  return (
    <div className="flex-shrink-0 flex items-center gap-2 px-5 py-3 border-b border-white/5">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div
            className={`
              w-6 h-6 rounded-sm flex items-center justify-center
              text-xs font-mono border transition-all duration-200
              ${
                i === currentStep
                  ? 'border-[#15c6e6c0] bg-[rgba(21,198,230,0.15)] text-[#15c6e6c0]'
                  : i < currentStep
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                  : 'border-white/10 text-white/20'
              }
            `}
          >
            {i < currentStep ? '✓' : i + 1}
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`h-px w-6 ${
                i < currentStep ? 'bg-emerald-500/30' : 'bg-white/10'
              }`}
            />
          )}
        </div>
      ))}

      <span className="ml-2 text-xs font-mono text-white/30">
        {STEPS[currentStep]}
      </span>

      {/* ── X — dismisses modal from any step ─────────────────────────── */}
      <button
        type="button"
        onClick={onClose}
        disabled={isBusy}
        className={`
          ml-auto w-6 h-6 flex items-center justify-center
          rounded-sm border border-white/10
          text-xs font-mono text-white/30
          transition-all duration-200
          ${isBusy
            ? 'opacity-30 cursor-not-allowed'
            : 'hover:border-white/30 hover:text-white/60 cursor-pointer'
          }
        `}
      >
        ✕
      </button>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export function CreateVaultModal() {

  // ── Platform store — single source of truth for registrationFee ───────────
  // Fetched once in PlatformProvider, event-driven refetch on FeeUpdateExecuted
  // No useReadContract needed here
  const registrationFee = usePlatformStore((s) => s.registrationFee);

  const { isOpen, close }       = useCreateModal();
  const { data: currentBlock }  = useBlockNumber();
  const { address }             = useWallet();

  const currentStep   = useWizardStore((s) => s.currentStep);
  const nextStep      = useWizardStore((s) => s.nextStep);
  const prevStep      = useWizardStore((s) => s.prevStep);
  const submitting    = useWizardStore((s) => s.submitting);
  const submitError   = useWizardStore((s) => s.submitError);
  const setSubmitting = useWizardStore((s) => s.setSubmitting);
  const setSubmitError = useWizardStore((s) => s.setSubmitError);
  const resetWizard   = useWizardStore((s) => s.reset);

  // ── Native vault flag ─────────────────────────────────────────────────────
  const isNativeVault = useWizardStore((s) => s.step1.isNative);

  // ── Token address — null for native (hook no-ops), address for ERC-20 ─────
  const wizardTokenAddress = useWizardStore((s) =>
    selectCreateVaultPayload(s).tokenAddress
  ) as `0x${string}` | null;

  const parsedAmount = useWizardStore((s) => {
    const amount = selectCreateVaultPayload(s).amount;
    return amount && !isNaN(parseFloat(amount)) ? parseEther(amount) : 0n;
  });

  const { createVault } = useCreateVault();

  // ── Token approval — skipped entirely for native vaults ──────────────────
  const { approveToken, needsApproval: erc20NeedsApproval } = useTokenApprove({
    // null signals the hook to no-op — sentinel is not an ERC-20
    tokenAddress: isNativeVault ? null : wizardTokenAddress,
    owner: address,
    amount: isNativeVault ? 0n : parsedAmount,
  });

  // Native vaults never need approval — approval is an ERC-20 concept only
  const needsApproval = !isNativeVault && erc20NeedsApproval;

  const {
    isConfirmed,
    isError,
    isPending,
    isConfirming,
    reset: resetTx,
  } = useTxStore();

  // ── Close handler ─────────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    if (submitting || isPending || isConfirming) return;
    resetWizard();
    resetTx();
    close();
  }, [submitting, isPending, isConfirming, resetWizard, resetTx, close]);

  const router = useRouter();

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const valid = useWizardStore.getState().validateStep(3);
    if (!valid) return;

    if (!currentBlock) {
      setSubmitError('Block number not ready — please try again');
      return;
    }

    const payload = selectCreateVaultPayload(useWizardStore.getState());

    try {
      setSubmitting(true);
      setSubmitError(null);

      if (!payload.amount || isNaN(parseFloat(payload.amount))) {
        throw new Error('Invalid token amount');
      }
      const amount = parseEther(payload.amount);

      const startDate = new Date(payload.startDate);
      if (isNaN(startDate.getTime())) throw new Error('Invalid start date');
      const startBlock = dateToBlock(startDate, currentBlock);

      const tierConfigs: TierConfigInput[] = payload.categories.flatMap((cat) =>
        cat.tiers.map((tier) => {
          if (!tier.allocationPerPass || isNaN(parseFloat(tier.allocationPerPass))) {
            throw new Error(`Invalid allocation in "${cat.name} / ${tier.name}"`);
          }
          const supply = parseInt(tier.maxSupply);
          if (isNaN(supply) || supply <= 0) {
            throw new Error(`Invalid max supply in "${cat.name} / ${tier.name}"`);
          }
          return {
            category:         stringToBytes32(cat.name),
            tier:             stringToBytes32(tier.name),
            allocationPerPass: parseEther(tier.allocationPerPass),
            maxSupply:        BigInt(supply),
          };
        })
      );

      const vestingConfigs: VestingConfigInput[] = payload.categories.map((cat) => {
        const v = payload.vestingConfigs[cat.name] ?? {
          enabled: false,
          cliff: 0,
          duration: 0,
          interval: 0,
          initialRelease: 0,
        };
        return {
          category:       stringToBytes32(cat.name),
          enabled:        v.enabled,
          cliff:          v.enabled ? daysToBlocks(v.cliff)    : BigInt(0),
          duration:       v.enabled ? daysToBlocks(v.duration) : BigInt(0),
          interval:       v.enabled ? daysToBlocks(v.interval) : BigInt(0),
          initialRelease: BigInt(Math.round(v.initialRelease * 100)),
        };
      });

      const admin1 = payload.approvalMode === 'creator' ? ZERO : payload.admin1;
      const admin2 = payload.approvalMode === 'Team'    ? payload.admin2 : ZERO;

      const input: CreateVaultInput = {
        tokenAddress: payload.tokenAddress  as `0x${string}`,
        amount,
        admin1: admin1 as `0x${string}`,
        admin2: admin2 as `0x${string}`,
        executor: payload.executor && isAddress(payload.executor)
          ? payload.executor as `0x${string}`
          : ZERO as `0x${string}`,
        startBlock,
        tierConfigs,
        vestingConfigs,
      };

      // ── ERC-20 only: request approval before vault creation ──────────────
      // Native vaults skip this — deposit arrives via msg.value, no approval needed
      if (!payload.isNative && needsApproval) {
        const approved = await approveToken(
          payload.tokenAddress as `0x${string}`,
          amount
        );
        if (!approved) throw new Error('Token approval failed or was rejected');
      }

      // ── msg.value calculation ─────────────────────────────────────────────
      // Native : registrationFee + depositAmount (both in one transaction)
      // ERC-20 : registrationFee only (deposit pulled via transferFrom)
      const msgValue = payload.isNative
        ? (registrationFee ?? 0n) + amount
        : (registrationFee ?? 0n);

      const created = await createVault(input, msgValue);
      if (!created) throw new Error('Vault creation failed or was rejected');

      const nextId = await readContract(wagmiConfig, {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getNextVaultId',
      }) as bigint;

      const newVaultId = nextId - 1n;

      setTimeout(() => {
        resetWizard();
        resetTx();
        close();
        router.push(`/vaults/${newVaultId.toString()}`);
      }, 2000);

    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Transaction failed');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Step content ──────────────────────────────────────────────────────────
  const stepContent = [
    <Step1TokenInfo     key="step1" />,
    <Step2Categories    key="step2" />,
    <Step3Vesting       key="step3" />,
    <Step4ApprovalSetup key="step4" />,
  ];

  const isLastStep = currentStep === STEPS.length - 1;
  const isBusy     = submitting || isPending || isConfirming;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      closeOnOverlay={false}
    >
      {/* Step indicator — pinned, never scrolls */}
      <StepIndicator
        currentStep={currentStep}
        onClose={handleClose}
        isBusy={isBusy}
      />

      {/* Scrollable content */}
      <div className="p-5 flex flex-col gap-5">
        {stepContent[currentStep]}

        {isLastStep && (isPending || isConfirming || isConfirmed || isError) && (
          <TxStatus
            hash={useTxStore.getState().hash}
            isPending={isPending}
            isConfirming={isConfirming}
            isConfirmed={isConfirmed}
            isError={isError}
            error={useTxStore.getState().error}
          />
        )}

        {submitError && (
          <p className="text-xs font-mono text-red-400 tracking-wide">
            ⚠ {submitError}
          </p>
        )}
      </div>

      {/* Footer — pinned, never scrolls */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-t border-white/5">
        {currentStep === 0 ? (
          <Button variant="ghost" onClick={handleClose} disabled={isBusy}>
            Cancel
          </Button>
        ) : (
          <Button variant="ghost" onClick={prevStep} disabled={isBusy}>
            Back
          </Button>
        )}

        {isLastStep ? (
          isConfirmed ? (
            <Button variant="ghost" onClick={handleClose}>
              Done ✓
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={handleSubmit}
              isLoading={isBusy}
              disabled={isBusy}
            >
              {isPending
                ? 'Awaiting Signature...'
                : isConfirming
                ? 'Confirming...'
                : submitting
                ? 'Processing...'
                : needsApproval
                ? 'Approve & Create 🚀'
                : 'Create Vault 🚀'}
            </Button>
          )
        ) : (
          <Button variant="primary" onClick={nextStep} disabled={isBusy}>
            Next: {STEPS[currentStep + 1]}
          </Button>
        )}
      </div>
    </Modal>
  );
}