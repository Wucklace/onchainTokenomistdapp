'use client';

import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/Button';
import { formatAddress } from '@/utils/format';

export function ConnectButton() {
  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {!connected ? (
              <Button variant="primary" onClick={openConnectModal}>
                Connect Wallet
              </Button>
            ) : chain.unsupported ? (
              <Button variant="danger" onClick={openChainModal}>
                Wrong Network
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                {/* Network Button — desktop only */}
                <button
                  onClick={openChainModal}
                  className="
                    hidden md:flex items-center gap-1.5 px-3 py-2
                    bg-white/5 border border-white/10 rounded-sm
                    text-xs font-mono text-white/60
                    hover:border-white/20 hover:text-white/80
                    transition-all duration-200
                  "
                >
                  {chain.hasIcon && chain.iconUrl && (
                    <img
                      src={chain.iconUrl}
                      alt={chain.name}
                      className="w-3.5 h-3.5 rounded-full"
                    />
                  )}
                  {chain.name}
                </button>

                {/* Account Button */}
                <button
                  onClick={openAccountModal}
                  className="
                    flex items-center gap-2 px-3 py-2
                    bg-[rgba(21,198,230,0.05)] border border-[#15c6e6c0]/30 rounded-sm
                    text-xs font-mono text-[#15c6e6c0]
                    hover:bg-[rgba(21,198,230,0.10)] hover:border-[#15c6e6c0]/50
                    transition-all duration-200
                  "
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {formatAddress(account.address)}
                </button>
              </div>
            )}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
}