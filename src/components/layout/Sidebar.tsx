'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useWallet } from '@/hooks';

const NAV_LINKS = [
  {
    href: '/vaults/my',
    label: 'My Vaults',
    icon: '◈',
  },
  {
    href: '/passes',
    label: 'My Passes',
    icon: '◎',
  },
  {
    href: '/proposals',
    label: 'Proposals',
    icon: '◈',
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isConnected } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Always render the same thing on server and first client paint
  const connected = mounted && isConnected;

  return (
    <aside className="hidden lg:flex flex-col w-56 sticky top-0 h-screen border-r border-white/8 bg-[#0A0A0A] pt-8 pb-6 px-4">
      {/* Nav Links */}
      <nav className="flex flex-col gap-1">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-sm
                text-xs font-mono uppercase tracking-widest
                transition-all duration-200
                ${
                  isActive
                    ? 'text-[#15c6e6c0] bg-[rgba(21,198,230,0.15)] border border-[#15c6e6c0]/30'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent'
                }
              `}
            >
              <span
                className={`text-base ${
                  isActive ? 'text-[#15c6e6c0]' : 'text-white/20'
                }`}
              >
                {link.icon}
              </span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom — Connection Status */}
      <div className="mt-auto">
        <div className="flex items-center gap-2 px-3 py-2 border border-white/5 rounded-sm bg-white/3">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              connected ? 'bg-emerald-400 animate-pulse' : 'bg-white/20'
            }`}
          />
          <span className="text-xs font-mono text-white/30 uppercase tracking-widest">
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
    </aside>
  );
}