import { createConfig, http } from 'wagmi';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  okxWallet,
  metaMaskWallet,
  walletConnectWallet,
  coinbaseWallet,
} from '@rainbow-me/rainbowkit/wallets';

import { nexusTestnet } from '@/constants';

// ✅ WalletConnect Project ID (REQUIRED)
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

// ✅ Define wallets
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        okxWallet,
        metaMaskWallet,
        coinbaseWallet,
        walletConnectWallet,
      ],
    },
  ],
  {
    appName: 'OnchainTokenomist',
    projectId,
  }
);

// ✅ FINAL CONFIG (stable, SSR-safe)
export const wagmiConfig = createConfig({
  chains: [nexusTestnet],
  connectors,
  transports: {
    [nexusTestnet.id]: http(),
  },
  ssr: true,
});