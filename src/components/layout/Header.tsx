'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { NetworkSwitch, ConnectButton } from '@/components/wallet';

const NAV_LINKS = [
  { href: '/', label: 'Dashboard' },
  { href: '/vaults/configure', label: 'Configure-Vault' },
  { href: '/vaults', label: 'Vaults' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="h-15 sticky top-0 z-40 w-full border-b border-white/8 bg-[#0A0A0A]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 flex items-center justify-center group-hover:bg-[rgba(21,198,230,0.15)] transition-all duration-200 rounded-md">
              <Image
                src="/OTKM_SVG.svg"
                alt="OTKM"
                width={32}
                height={32}
                className="opacity-90 group-hover:opacity-100 transition-opacity duration-200"
              />
            </div>
            <span className="text-base font-mono tracking-wide text-white/90 hidden sm:block">
              ONCHAIN TOKENOMIST
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  px-3 py-1.5 text-xs font-mono uppercase tracking-widest rounded-sm
                  transition-all duration-200
                  ${
                    pathname === link.href
                      ? 'text-[#15c6e6c0] bg-[rgba(21,198,230,0.15)] border border-[#15c6e6c0]/30'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side — Create button (mobile only) + Connect */}
          <div className="flex items-center gap-2">
            {/* Mobile Create Vault button */}
            <Link
              href="/vaults/configure"
              className={`
                md:hidden flex items-center justify-center w-8 h-8 rounded-sm
                border transition-all duration-200
                ${
                  pathname === '/vaults/configure'
                    ? 'text-[#15c6e6c0] border-[#15c6e6c0]/40 bg-[rgba(21,198,230,0.12)]'
                    : 'text-[#15c6e6c0]/70 border-[#15c6e6c0]/20 bg-[rgba(21,198,230,0.05)] hover:border-[#15c6e6c0]/40 hover:bg-[rgba(21,198,230,0.12)]'
                }
              `}
              aria-label="Create Vault"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v8M8 12h8" />
              </svg>
            </Link>

            <ConnectButton />
          </div>
        </div>

        {/* Network Switch Banner */}
        <div className="pb-3">
          <NetworkSwitch />
        </div>
      </div>
    </header>
  );
}