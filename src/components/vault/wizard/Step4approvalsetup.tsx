'use client';

import { useWizardStore, type ApprovalMode} from '@/store/useWizardStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FormField } from '@/components/forms/FormField';
import { AddressInput } from '@/components/forms/AddressInput';
import { formatEther } from 'viem';
import { usePlatformStore } from '@/store';

const APPROVAL_OPTIONS: {
  mode: ApprovalMode;
  label: string;
  desc: string;
  tag: string;
}[] = [
  {
    mode: 'creator',
    label: 'Creator Mode',
    desc: 'You can mint passes immediately — no approvals needed',
    tag: 'Fastest',
  },
  {
    mode: 'admin',
    label: 'Admin Mode',
    desc: 'Proposals require approval from one designated admin',
    tag: 'Balanced',
  },
  {
    mode: 'Team',
    label: 'Team Mode',
    desc: 'Proposals require approval from two admins',
    tag: 'Most Secure',
  },
];

export function Step4ApprovalSetup() {
  const approvalMode = useWizardStore((s) => s.approvalMode);
  const admin1       = useWizardStore((s) => s.admin1);
  const admin2       = useWizardStore((s) => s.admin2);
  const errors       = useWizardStore((s) => s.errors.step4);
  const setApprovalMode = useWizardStore((s) => s.setApprovalMode);
  const setAdmin1    = useWizardStore((s) => s.setAdmin1);
  const setAdmin2    = useWizardStore((s) => s.setAdmin2);
  const executor     = useWizardStore((s) => s.executor);
  const setExecutor  = useWizardStore((s) => s.setExecutor);

  const step1      = useWizardStore((s) => s.step1);
  const categories = useWizardStore((s) => s.categories);
  const totalTiers = categories.reduce((acc, c) => acc + c.tiers.length, 0);

  const registrationFee = usePlatformStore((s) => s.registrationFee);

  // ── Derived display values ─────────────────────────────────────────────────

  const isNative   = step1.isNative;
  const feeEth     = registrationFee ? formatEther(registrationFee) : '—';
  const depositAmt = step1.amount || '0';

  const totalNativeCost = registrationFee && step1.amount
    ? formatEther(registrationFee + BigInt(Math.round(parseFloat(step1.amount) * 1e18)))
    : '—';

  const tokenDisplay = isNative
    ? 'Native Token'
    : step1.tokenAddress
      ? `${step1.tokenAddress.slice(0, 6)}...${step1.tokenAddress.slice(-4)}`
      : '—';

  const amountDisplay = step1.amount
    ? `${Number(step1.amount).toLocaleString()} ${isNative ? 'native' : 'tokens'}`
    : '—';

  const startDateDisplay = step1.startDate
    ? new Date(step1.startDate).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : '—';

  const modeDisplay =
    approvalMode === 'creator' ? 'Creator Mode' :
    approvalMode === 'admin'   ? 'Admin Mode'   : 'Team Mode';

  // ── Summary rows ───────────────────────────────────────────────────────────

  const summaryRows = [
    { label: 'Token',      value: tokenDisplay },
    { label: 'Amount',     value: amountDisplay },
    { label: 'Start Date', value: startDateDisplay },
    { label: 'Categories', value: categories.length.toString() },
    { label: 'Tiers',      value: totalTiers.toString() },
    { label: 'Mode',       value: modeDisplay },
  ];

  // Cost rows shown separately — visually distinct from config summary
  const costRows = isNative
    ? [
        { label: 'Registration Fee', value: `${feeEth} native` },
        { label: 'Token Deposit',    value: `${Number(depositAmt).toLocaleString()} native` },
        { label: 'Total msg.value',  value: `${totalNativeCost} native`, highlight: true },
      ]
    : [
        { label: 'Registration Fee', value: `${feeEth} native` },
        { label: 'Token Deposit',    value: `${Number(depositAmt).toLocaleString()} tokens (via approval)` },
      ];

  return (
    <Card variant="neonBlue" fullWidth>
      <h2 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-5">
        Approval Setup
      </h2>

      {/* ── Executor ────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <FormField
          label="🤖 Executor Address"
          hint="Optional — leave empty to disable. Defaults to zero address."
        >
          <AddressInput
            value={executor}
            onChange={(e) => setExecutor(e.target.value)}
            onValidAddress={setExecutor}
            placeholder="0x... or leave empty"
            fullWidth
          />
        </FormField>
      </div>

      {/* ── Mode Selection ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 mb-6">
        {APPROVAL_OPTIONS.map((option) => (
          <button
            key={option.mode}
            type="button"
            onClick={() => setApprovalMode(option.mode)}
            className={`
              flex items-center justify-between p-4 rounded-sm border
              text-left transition-all duration-200
              ${approvalMode === option.mode
                ? 'border-[#15c6e6c0]/50 bg-[rgba(21,198,230,0.08)]'
                : 'border-white/10 bg-white/3 hover:border-white/20'
              }
            `}
          >
            <div>
              <p className="text-sm font-mono text-white/80 mb-1">{option.label}</p>
              <p className="text-xs font-mono text-white/30">{option.desc}</p>
            </div>
            <Badge variant={approvalMode === option.mode ? 'neonBlue' : 'ghost'}>
              {option.tag}
            </Badge>
          </button>
        ))}
      </div>

      {/* ── Admin Inputs ─────────────────────────────────────────────────── */}
      {(approvalMode === 'admin' || approvalMode === 'Team') && (
        <div className="flex flex-col gap-4 mb-6">
          <FormField label="Admin 1 Address" required error={errors.admin1}>
            <AddressInput
              value={admin1}
              onChange={(e) => setAdmin1(e.target.value)}
              onValidAddress={setAdmin1}
              error={errors.admin1}
              fullWidth
            />
          </FormField>

          {approvalMode === 'Team' && (
            <FormField label="Admin 2 Address" required error={errors.admin2}>
              <AddressInput
                value={admin2}
                onChange={(e) => setAdmin2(e.target.value)}
                onValidAddress={setAdmin2}
                error={errors.admin2}
                fullWidth
              />
            </FormField>
          )}
        </div>
      )}

      {/* ── Config Summary ───────────────────────────────────────────────── */}
      <div className="border border-white/8 rounded-sm p-4 bg-white/3 mb-3">
        <p className="text-xs font-mono uppercase tracking-widest text-white/30 mb-3">
          Summary
        </p>
        <div className="flex flex-col gap-2">
          {summaryRows.map((row) => (
            <div key={row.label} className="flex justify-between gap-4">
              <span className="text-xs font-mono text-white/30 shrink-0">{row.label}</span>
              <span className="text-xs font-mono text-white/60 truncate text-right">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Cost Breakdown ───────────────────────────────────────────────── */}
      <div className="border border-white/8 rounded-sm p-4 bg-white/3">
        <p className="text-xs font-mono uppercase tracking-widest text-white/30 mb-3">
          {isNative ? 'Wallet Cost' : 'Transaction Cost'}
        </p>
        <div className="flex flex-col gap-2">
          {costRows.map((row) => (
            <div key={row.label} className="flex justify-between gap-4">
              <span className="text-xs font-mono text-white/30 shrink-0">{row.label}</span>
              <span className={`text-xs font-mono truncate text-right ${
                'highlight' in row && row.highlight
                  ? 'text-cyan-300'
                  : 'text-white/60'
              }`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
        {!isNative && (
          <p className="text-xs font-mono text-white/20 mt-3 border-t border-white/5 pt-3">
            Token deposit requires a separate approval transaction before vault creation.
          </p>
        )}
      </div>
    </Card>
  );
}