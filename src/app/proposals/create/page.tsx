'use client';

export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui';
import { useWallet } from '@/hooks/useWallet';
import { ProposalForm } from '@/components/proposals/create';

function CreateProposalContent() {
  const { isConnected } = useWallet();
  const searchParams = useSearchParams();
  const router = useRouter();

  const vaultId = searchParams.get('vaultId')
    ? BigInt(searchParams.get('vaultId')!)
    : null;

  const handleSuccess = () => {
    router.push('/proposals');
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card variant="default">
          <p className="text-sm font-mono text-white/40 text-center py-4">
            Connect your wallet to create proposals
          </p>
        </Card>
      </div>
    );
  }

  if (!vaultId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card variant="default">
          <p className="text-sm font-mono text-white/40 text-center py-4">
            No vault selected — go to your vault and use the Create Proposal button.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">
          Proposals
        </p>
        <h1 className="text-xl font-mono uppercase tracking-widest text-white/90">
          Create Proposal
        </h1>
        <p className="text-xs font-mono text-white/30 mt-1">
          Vault #{vaultId.toString()}
        </p>
      </div>

      <ProposalForm
        vaultId={vaultId}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

export default function CreateProposalPage() {
  return (
    <Suspense fallback={null}>
      <CreateProposalContent />
    </Suspense>
  );
}