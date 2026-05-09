import { type Chain } from 'viem';

export const nexusTestnet = {
  id: parseInt(process.env.NEXT_PUBLIC_NEXUS_TESTNET_CHAIN_ID!),
  name: 'Nexus Testnet',
  nativeCurrency: {
    name: 'NEXUS',
    symbol: 'NEX',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_NEXUS_TESTNET_RPC_URL!],
      webSocket: [process.env.NEXT_PUBLIC_NEXUS_TESTNET_WS_RPC_URL!],
    },
  },
  blockExplorers: {
    default: {
      name: 'Nexus Testnet Explorer',
      url: process.env.NEXT_PUBLIC_NEXUS_TESTNET_EXPLORER_URL!,
    },
  },
  testnet: true,
} as const satisfies Chain;