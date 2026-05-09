'use client';

import { useWizardStore, NATIVE_TOKEN } from '@/store/useWizardStore';
import { Card } from '@/components/ui/Card';
import { FormField } from '@/components/forms/FormField';
import { AddressInput } from '@/components/forms/AddressInput';
import { TokenInput } from '@/components/forms/TokenInput';
import { DatePicker } from '@/components/forms/DatePicker';

export function Step1TokenInfo() {
  const step1   = useWizardStore((s) => s.step1);
  const errors  = useWizardStore((s) => s.errors.step1);
  const setStep1 = useWizardStore((s) => s.setStep1);

  const minDate = new Date(Date.now() + 25 * 60 * 1000)
    .toISOString()
    .slice(0, 16);

  const handleToggleNative = (native: boolean) => {
    setStep1({
      isNative: native,
      // Clear address when switching modes so no stale value bleeds through
      tokenAddress: native ? NATIVE_TOKEN : '',
    });
  };

  return (
    <Card variant="neonBlue" fullWidth>
      <h2 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-5">
        Token Information
      </h2>

      <div className="flex flex-col gap-5">

        {/* ── Token Type Toggle ─────────────────────────────────────────── */}
        <FormField label="Token Type" required>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleToggleNative(false)}
              className={`
                py-2.5 px-4 rounded-lg border text-sm font-mono transition-all
                ${!step1.isNative
                  ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
                  : 'border-white/10 bg-white/5 text-white/40 hover:border-white/20 hover:text-white/60'
                }
              `}
            >
              ERC-20 Token
            </button>
            <button
              type="button"
              onClick={() => handleToggleNative(true)}
              className={`
                py-2.5 px-4 rounded-lg border text-sm font-mono transition-all
                ${step1.isNative
                  ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
                  : 'border-white/10 bg-white/5 text-white/40 hover:border-white/20 hover:text-white/60'
                }
              `}
            >
              Native Token
            </button>
          </div>
        </FormField>

        {/* ── Token Address — ERC-20 only ───────────────────────────────── */}
        {!step1.isNative && (
          <FormField
            label="Token Address"
            required
            error={errors.tokenAddress}
          >
            <AddressInput
              value={step1.tokenAddress ?? ''}
              onChange={(e) =>
                setStep1({ tokenAddress: e.target.value as `0x${string}` })
              }
              onValidAddress={(addr) =>
                setStep1({ tokenAddress: addr as `0x${string}` })
              }
              error={errors.tokenAddress}
              fullWidth
            />
          </FormField>
        )}

        {/* ── Native sentinel info — native only ───────────────────────── */}
        {step1.isNative && (
          <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-1">
              Token
            </p>
            <p className="text-sm font-mono text-cyan-300">
              Native Token
            </p>
            <p className="text-xs font-mono text-white/30 mt-1 break-all">
              {NATIVE_TOKEN}
            </p>
            <p className="text-xs text-white/30 mt-2">
              No token contract or approval needed. The deposit is sent
              directly with the vault creation transaction.
            </p>
          </div>
        )}

        {/* ── Deposit Amount ────────────────────────────────────────────── */}
        <FormField
          label="Deposit Amount"
          required
          error={errors.amount}
          hint={
            step1.isNative
              ? 'Total native tokens to lock in the vault'
              : 'Total tokens to lock in the vault'
          }
        >
          <TokenInput
            value={step1.amount}
            onChange={(e) => setStep1({ amount: e.target.value })}
            error={errors.amount}
            fullWidth
          />
        </FormField>

        {/* ── Start Date ────────────────────────────────────────────────── */}
        <FormField
          label="Start Date"
          required
          error={errors.startDate}
          hint="Minimum 30 mins from now"
        >
          <DatePicker
            value={step1.startDate}
            onChange={(e) => setStep1({ startDate: e.target.value })}
            min={minDate}
            error={errors.startDate}
            fullWidth
          />
        </FormField>
      </div>
    </Card>
  );
}