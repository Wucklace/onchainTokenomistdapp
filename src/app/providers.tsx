'use client';

import { useEffect } from 'react';
import { WagmiProvider, useBlockNumber } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { QueryClientProvider, HydrationBoundary } from '@tanstack/react-query';
import { useReadContract, useWatchContractEvent } from 'wagmi';
import { wagmiConfig } from '@/lib/wagmi';
import { queryClient } from '@/lib/queryClient';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants';
import { usePlatformStore } from '@/store/usePlatformStore';
//@ts-ignore
import '@rainbow-me/rainbowkit/styles.css';

// ─── Stable theme ─────────────────────────────────────────────────────────────

const theme = darkTheme({
  accentColor: '#15c6e6c0',
  accentColorForeground: '#000000',
  borderRadius: 'none',
  fontStack: 'system',
  overlayBlur: 'small',
});

// ─── Platform Data Fetcher ────────────────────────────────────────────────────
// Isolated component so hooks run inside WagmiProvider + QueryClientProvider

function PlatformProvider() {
  const setRegistrationFee = usePlatformStore((s) => s.setRegistrationFee);
  const { data: currentBlock } = useBlockNumber();

  const { data: fee, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'registrationFee',
  });

  // Set initial value on mount
  useEffect(() => {
    if (fee !== undefined) setRegistrationFee(fee);
  }, [fee, setRegistrationFee]);

  // Refetch only when FeeUpdateExecuted fires on-chain
  // This event requires a 604800-block timelock — fires at most once or twice ever
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'FeeUpdateExecuted',
    fromBlock: currentBlock,
    enabled: currentBlock !== undefined,
    onLogs: () => refetch(),
  });

  return null;
}

// ─── Root Provider ────────────────────────────────────────────────────────────

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={undefined}>
          <RainbowKitProvider theme={theme}>
            {/* Runs inside all providers — wagmi hooks work correctly here */}
            <PlatformProvider />
            {children}
          </RainbowKitProvider>
        </HydrationBoundary>
      </QueryClientProvider>
    </WagmiProvider>
  );
}