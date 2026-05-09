import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { useEffect } from 'react';
import { useWalletStore } from '@/store';
import { nexusTestnet } from '@/constants';

export function useWallet() {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const {
    setAddress,
    setIsConnected,
    setChainId,
    setIsCorrectNetwork,
    reset,
  } = useWalletStore();

  const isCorrectNetwork = chainId === nexusTestnet.id;

  useEffect(() => {
    setAddress(address);
    setIsConnected(isConnected);
    setChainId(chainId);
    setIsCorrectNetwork(isCorrectNetwork);
  }, [address, isConnected, chainId, isCorrectNetwork]);

  useEffect(() => {
    if (isDisconnected) reset();
  }, [isDisconnected]);

  const switchToNexus = () => {
    switchChain({ chainId: nexusTestnet.id }); 
  };

  return {
    address,
    isConnected,
    isConnecting,
    isDisconnected,
    chainId,
    isCorrectNetwork,
    isSwitching,
    switchToNexus,
  };
}