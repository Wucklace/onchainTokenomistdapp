'use client';

export const dynamic = 'force-dynamic';

import { useWallet } from '@/hooks';
import { Button, Card } from '@/components/ui';
import { useCreateModal } from '@/store/useCreateModal';
import { CreateVaultModal } from '@/components/vault/wizard';

export default function CreateVaultPage() {
  const { isConnected } = useWallet();
  const open = useCreateModal((s) => s.open);

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card variant="default">
          <p className="text-sm font-mono text-white/40 text-center">
            Connect your wallet to create a vault
          </p>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-mono uppercase tracking-widest text-white/90">
            Create a Vault
          </h1>
          <p className="text-sm font-mono text-white/40 leading-relaxed max-w-lg">
            Configure your token economy once — allocations, vesting schedules, and 
            distribution rules. The protocol locks and enforces everything on-chain 
            from the moment of creation.
          </p>
        </div>

        {/* How it works */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-mono uppercase tracking-widest text-white/30">
            How it works
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              {
                step: '01',
                title: 'Token & Start Date',
                desc: 'Select your deposit token — ERC-20 or the network native token — and configure the date and time the vault parameters activate.',
              },
              {
                step: '02',
                title: 'Categories & Tiers',
                desc: 'Configure distribution groups — Team, Investors, Community — each with custom tiers, per-pass allocations, and max supply caps.',
              },
              {
                step: '03',
                title: 'Vesting Schedule',
                desc: 'Configure cliff, duration, and unlock intervals per category. Categories with vesting disabled release 100% of tokens at the start date.',
              },
              {
                step: '04',
                title: 'Governance & Execution',
                desc: 'Choose Creator mode for direct control or Team mode for dual-admin approval. Deploy an optional AI executor for fully autonomous, agent-driven distribution.',
              },
            ].map(({ step, title, desc }) => (
              <div
                key={step}
                className="bg-white/3 border border-white/5 rounded-sm p-4 flex flex-col gap-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#15c6e6c0]/60 tabular-nums">
                    {step}
                  </span>
                  <span className="text-xs font-mono uppercase tracking-widest text-white/60">
                    {title}
                  </span>
                </div>
                <p className="text-xs font-mono text-white/30 leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-2">
          <Button variant="primary" onClick={open}>
            Launch Vault Wizard →
          </Button>
          <p className="text-xs font-mono text-white/20 text-center">
            A small registration fee in the network's native token applies at vault creation.
          </p>
        </div>
      </div>

      {/* Modal — mounted once, toggled by useCreateModal */}
      <CreateVaultModal />
    </>
  );
}