'use client';

import { useAccount, useBalance } from 'wagmi';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { formatAddress, formatAmount } from '@/utils/format';
import { nexusTestnet } from '@/constants';

export function WalletInfo() {
  const { address, isConnected } = useAccount();

  const { data: balance, isLoading } = useBalance({
    address,
    query: { enabled: !!address },
  });

  if (!isConnected || !address) return null;

  return (
    <Card variant="neonBlue" fullWidth>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono uppercase tracking-widest text-white/40">
          Connected Wallet
        </span>
        <Badge variant="success" dot>
          Connected
        </Badge>
      </div>

      {/* Address */}
      <div className="mb-4">
        <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">
          Address
        </p>
        <p className="text-sm font-mono text-[#15c6e6c0] break-all">
          {formatAddress(address)}
        </p>
      </div>

      {/* Balance */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/3 border border-white/5 rounded-sm p-3">
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">
            Balance
          </p>
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            <p className="text-sm font-mono text-white/80">
              {balance
                ? `${formatAmount(balance.value)} ${balance.symbol}`
                : '—'}
            </p>
          )}
        </div>
        <div className="bg-white/3 border border-white/5 rounded-sm p-3">
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">
            Network
          </p>
          <p className="text-sm font-mono text-[#fa7e09cb]">
            {nexusTestnet.name}
          </p>
        </div>
      </div>
    </Card>
  ); 
} 