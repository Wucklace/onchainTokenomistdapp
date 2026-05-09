'use client';

import { useWallet } from '@/hooks';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { nexusTestnet } from '@/constants';

export function NetworkSwitch() {
  const { isConnected, isCorrectNetwork, isSwitching, switchToNexus } =
    useWallet();

  if (!isConnected || isCorrectNetwork) return null;

  return (
    <div className="hidden md:block">
      <Card variant="neonOrange" fullWidth>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-mono text-[#fa7e09cb] mb-1">
              Wrong Network
            </p>
            <p className="text-xs font-mono text-white/40">
              Please switch to{' '}
              <span className="text-white/60">{nexusTestnet.name}</span> to
              continue
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            isLoading={isSwitching}
            onClick={switchToNexus}
          >
            Switch Network
          </Button>
        </div>
      </Card>
    </div>
  );
}