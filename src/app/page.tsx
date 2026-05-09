'use client';

import Link from 'next/link';
import { Notification } from '@/types';
import { ConnectButton } from '@/components/wallet';
import { formatAmount, formatBytes32 } from '@/utils/format';
import { Card, Button, Badge } from '@/components/ui';
import { useNotifications, usePlatformStats, useWallet } from '@/hooks';

// ─── Stat Skeleton ────────────────────────────────────────────────────────────

function StatSkeleton() {
  return <div className="h-6 w-20 rounded-sm bg-white/10 animate-pulse" />;
}

// ─── Sub Stat ─────────────────────────────────────────────────────────────────

function SubStat({
  label,
  value,
  color,
  isLoading,
}: {
  label: string;
  value: string | null;
  color: string;
  isLoading: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[10px] font-mono uppercase tracking-widest text-white/25">
        {label}
      </p>
      {isLoading || value === null ? (
        <div className="h-5 w-14 rounded-sm bg-white/10 animate-pulse" />
      ) : (
        <p className={`text-lg font-mono ${color}`}>{value}</p>
      )}
    </div>
  );
}

// ─── Notification Card ────────────────────────────────────────────────────────

function NotificationCard({ item }: { item: Notification }) {
  const config = {
    proposal_pending: {
      badge: { label: 'Approval Needed', variant: 'neonOrange' as const },
      icon: '⏳',
      title: (n: Notification) =>
        n.type === 'proposal_pending'
          ? `Proposal #${n.proposalId.toString()} — ${formatBytes32(n.category)}`
          : '',
      sub: (n: Notification) =>
        n.type === 'proposal_pending'
          ? `Vault #${n.vaultId.toString()} · Awaiting your admin approval`
          : '',
      href: () => `/proposals`,
      cta: 'Review',
    },
    proposal_rejected: {
      badge: { label: 'Rejected', variant: 'danger' as const },
      icon: '❌',
      title: (n: Notification) =>
        n.type === 'proposal_rejected'
          ? `Proposal #${n.proposalId.toString()} — ${formatBytes32(n.category)}`
          : '',
      sub: (n: Notification) =>
        n.type === 'proposal_rejected'
          ? `Vault #${n.vaultId.toString()} · Rejected by admin — create a new proposal`
          : '',
      href: () => `/proposals/create`,
      cta: 'New Proposal',
    },
    proposal_expired: {
      badge: { label: 'Expired', variant: 'danger' as const },
      icon: '⌛',
      title: (n: Notification) =>
        n.type === 'proposal_expired'
          ? `Proposal #${n.proposalId.toString()} — ${formatBytes32(n.category)}`
          : '',
      sub: (n: Notification) =>
        n.type === 'proposal_expired'
          ? `Vault #${n.vaultId.toString()} · Deadline passed — create a new proposal`
          : '',
      href: () => `/proposals/create`,
      cta: 'New Proposal',
    },
    proposal_needed: {
      badge: { label: 'Action Needed', variant: 'neonOrange' as const },
      icon: '📋',
      title: (n: Notification) =>
        n.type === 'proposal_needed'
          ? `Vault #${n.vaultId.toString()} needs a mint proposal`
          : '',
      sub: () => 'Create a proposal to begin the mint approval process',
      href: () => `/proposals/create`,
      cta: 'Create Proposal',
    },
    mint_ready: {
      badge: { label: 'Ready to Mint', variant: 'success' as const },
      icon: '🚀',
      title: (n: Notification) =>
        n.type === 'mint_ready'
          ? `Proposal #${n.proposalId.toString()} — ${formatBytes32(n.category)}`
          : '',
      sub: (n: Notification) =>
        n.type === 'mint_ready'
          ? `Vault #${n.vaultId.toString()} · All approvals received — ready to mint`
          : '',
      href: (n: Notification) =>
        n.type === 'mint_ready'
          ? `/proposals/mint?id=${n.proposalId.toString()}`
          : '/',
      cta: 'Mint Now',
    },
    mint_direct: {
      badge: { label: 'Direct Mint', variant: 'neonBlue' as const },
      icon: '🎫',
      title: (n: Notification) =>
        n.type === 'mint_direct'
          ? `Vault #${n.vaultId.toString()} has passes to mint`
          : '',
      sub: () => 'Creator-mode vault — mint passes directly',
      href: () => `/passes/mint`,
      cta: 'Mint Passes',
    },
    claimable: {
      badge: { label: 'Claimable', variant: 'neonBlue' as const },
      icon: '🎁',
      title: (n: Notification) =>
        n.type === 'claimable'
          ? `Pass #${n.tokenId.toString()} · Vault #${n.vaultId.toString()}`
          : '',
      sub: (n: Notification) =>
        n.type === 'claimable'
          ? `${formatAmount(n.amount)} tokens available to claim`
          : '',
      href: () => `/passes`,
      cta: 'Claim',
    },
    pass_minted: {
      badge: { label: 'Pass Minted', variant: 'success' as const },
      icon: '✦',
      title: (n: Notification) =>
        n.type === 'pass_minted'
          ? `Pass #${n.tokenId.toString()} — ${formatBytes32(n.tier)}`
          : '',
      sub: (n: Notification) =>
        n.type === 'pass_minted'
          ? `Vault #${n.vaultId.toString()} · New pass in your wallet`
          : '',
      href: () => `/passes`,
      cta: 'View',
    },
  } as const;

  const c = config[item.type];

  return (
    <div className="flex items-center justify-between py-3 px-4 bg-white/3 border border-white/5 rounded-sm gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-base shrink-0">{c.icon}</span>
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="text-xs font-mono text-white/70 truncate">
            {c.title(item)}
          </p>
          <p className="text-[10px] font-mono text-white/30 truncate">
            {c.sub(item)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <Badge variant={c.badge.variant} size="sm">
          {c.badge.label}
        </Badge>
        <Link href={c.href(item)}>
          <Button variant="ghost" size="sm">
            {c.cta}
          </Button>
        </Link>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { isConnected } = useWallet();
  const { stats, isLoading: statsLoading } = usePlatformStats();
  const { notifications, isLoading: notifLoading, isError: notifError } = useNotifications();

  const topStats = [
    {
      label: 'Total Vaults',
      value: stats ? stats.totalVaults.toString() : null,
      accent: 'text-[#15c6e6c0]',
      breakdown: stats
        ? [
            { label: 'All Time', value: stats.totalVaults.toString(),                                color: 'text-white/50' },
            { label: 'Finalized', value: stats.totalFinalizedVaults.toString(),                       color: 'text-emerald-400' },
            { label: 'Active',    value: (stats.totalVaults - stats.totalFinalizedVaults).toString(), color: 'text-[#fa7e09cb]' },
          ]
        : undefined,
    },
    {
      label: 'Total Value Locked',
      value: stats ? formatAmount(stats.totalValueLocked) : null,
      accent: 'text-[#fa7e09cb]',
      breakdown: stats
        ? [
            { label: 'Deposited',   value: formatAmount(stats.totalDeposited),   color: 'text-white/50' },
            { label: 'Distributed', value: formatAmount(stats.totalDistributed), color: 'text-emerald-400' },
            { label: 'Locked',      value: formatAmount(stats.totalValueLocked), color: 'text-[#fa7e09cb]' },
          ]
        : undefined,
    },
    {
      label: 'Total Passes',
      value: stats ? stats.totalPassesMinted.toString() : null,
      accent: 'text-white/70',
      breakdown: stats
        ? [
            { label: 'Passes Minted',     value: stats.totalPassesMinted.toString(),     color: 'text-white/70'       },
            { label: 'Completed Claims',  value: stats.totalCompletedClaims.toString(),  color: 'text-emerald-400'    },
            { label: 'Active Passes',     value: stats.totalActivePasses.toString(),     color: 'text-[#fa7e09cb]' },
          ]
        : undefined,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-mono uppercase tracking-widest text-white/90 leading-tight">
            On-Chain Economic Infrastructure
          </h1>
          <div className="inline-flex w-fit">
            <span className="text-sm font-mono uppercase tracking-[0.3em] text-[#15C6E6] border border-[#15C6E6]/20 bg-[#15C6E6]/5 px-3 py-1 rounded-md">
              Tokenomics is no longer a document.
            </span>
          </div>
        </div>
  
        <p className="text-sm font-mono text-white/50 max-w-xl leading-loose">
          Build programmable economies where allocation, vesting,
          and distribution logic are verifiable, immutable,
          and executed entirely on-chain.
        </p>
      </div>

      {/* Stats Row — 2 simple + 1 expanded */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Simple stat cards */}
        {topStats.map((stat) => (
          <Card key={stat.label} variant="default" fullWidth>
            <p className="text-xs font-mono uppercase tracking-widest text-white/30 mb-2">
              {stat.label}
            </p>
            {statsLoading || stat.value === null ? (
              <StatSkeleton />
            ) : (
              <p className={`text-2xl font-mono ${stat.accent}`}>{stat.value}</p>
            )}
           {!statsLoading && stat.breakdown && (
              <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-white/5">
               {stat.breakdown.map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/25">
                     {row.label}
                    </span>
                    <span className={`text-xs font-mono ${row.color}`}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
             )}
          </Card>
        ))}
      </div>
      {/* Notifications Panel */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-widest text-white/40">
            Notifications
          </h2>
          {notifications.length > 0 && (
            <Badge variant="neonOrange" size="sm">
              {notifications.length} pending
            </Badge>
          )}
        </div>

        <Card variant="default" fullWidth>
          {!isConnected ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <p className="text-xs font-mono text-white/30 text-center">
                Connect your wallet to see your notifications
              </p>
              <ConnectButton />
            </div>
          ) : notifLoading ? (
            <div className="flex flex-col gap-3 py-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 rounded-sm bg-white/5 animate-pulse"
                  style={{ animationDelay: `${i * 80}ms` }}
                />
              ))}
            </div>
          ) : notifError ? (
            <p className="text-xs font-mono text-red-400/60 text-center py-8">
              Failed to load notifications — check your network connection
            </p>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <p className="text-xs font-mono text-white/30 text-center">
                You're all caught up — no pending actions
              </p>
              <p className="text-[10px] font-mono text-white/25 text-center max-w-sm leading-relaxed">
                Notifications surface when action is needed — mint approvals, claimable tokens, 
                proposal status, and distribution activity across your vaults, passes, and admin roles.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {notifications.map((item) => (
                <NotificationCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}