'use client';

import { useState } from 'react';
import { Card, Button } from '@/components/ui';

export function ProposalIdInput({ onLoad }: { onLoad: (id: bigint) => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handle = () => {
    const n = parseInt(value.trim());
    if (!value.trim() || isNaN(n) || n <= 0) {
      setError('Enter a valid proposal ID');
      return;
    }
    setError(null);
    onLoad(BigInt(n));
  };

  return (
    <Card variant="default" fullWidth>
      <p className="text-xs font-mono uppercase tracking-widest text-white/40 mb-4">
        Load Proposal
      </p>
      <p className="text-xs font-mono text-white/30 mb-4">
        Enter a proposal ID or open this page from the{' '}
        <a href="/proposals" className="text-[#15c6e6c0] hover:underline">
          proposals list
        </a>{' '}
        — ready proposals have a direct Mint link.
      </p>
      <div className="flex gap-2">
        <input
          className={`flex-1 bg-white/5 border ${
            error ? 'border-red-500/50' : 'border-white/10'
          } rounded-sm px-3 py-2 text-sm font-mono text-white/80 placeholder:text-white/20 focus:outline-none focus:border-[#15c6e6c0]/50`}
          placeholder="e.g. 42"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(null); }}
          onKeyDown={(e) => e.key === 'Enter' && handle()}
        />
        <Button variant="primary" onClick={handle}>
          Load
        </Button>
      </div>
      {error && <p className="text-xs font-mono text-red-400 mt-2">{error}</p>}
    </Card>
  );
}