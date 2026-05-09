'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TAB_LINKS = [
  {
    href: '/vaults',
    label: 'Vaults',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="1" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    href: '/vaults/my',
    label: 'My Vaults',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="1" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        <path d="M12 15v2" />
      </svg>
    ),
  },
  {
    href: '/passes',
    label: 'My Passes',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    href: '/proposals',
    label: 'Proposals',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      </svg>
    ),
  },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/8 bg-[#0A0A0A]/95 backdrop-blur-md">
      <div className="flex items-stretch h-16">
        {TAB_LINKS.map((tab) => {
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`
                relative flex flex-col items-center justify-center flex-1 gap-1
                text-[10px] font-mono uppercase tracking-widest
                transition-all duration-200
                ${isActive ? 'text-[#15c6e6c0]' : 'text-white/30 hover:text-white/60'}
              `}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[1.5px] bg-[#15c6e6c0] rounded-full" />
              )}
              <span>{tab.icon}</span>
              <span className="leading-none">{tab.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="h-safe-area-inset-bottom bg-[#0A0A0A]" />
    </nav>
  );
}