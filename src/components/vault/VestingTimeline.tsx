'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { blocksToRealDays } from '@/utils/format';

interface VestingTimelineProps {
  enabled: boolean;
  cliff: bigint;
  duration: bigint;
  interval: bigint;
  initialRelease: bigint;
  allocation?: bigint;
  mode?: 'preview' | 'live';
}

interface TimelinePoint {
  label: string;
  percentage: number;
  day: number;
  isUnlocked?: boolean;
}

export function VestingTimeline({
  enabled,
  cliff,
  duration,
  interval,
  initialRelease,
  allocation,
  mode = 'preview',
}: VestingTimelineProps) {
  // No vesting — 100% at Start
  if (!enabled) {
    return (
      <Card variant="neonBlue" fullWidth>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono uppercase tracking-widest text-white/40">
            Vesting Schedule
          </span>
          <Badge variant="success" dot>
            No Vesting
          </Badge>
        </div>
        <p className="text-sm font-mono text-white/50">
          100% unlocked at Start
        </p>
        <div className="mt-4 w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
          <div className="h-full w-full rounded-full bg-emerald-500" />
        </div>
      </Card>
    );
  }

  // Build timeline points
  const cliffDays = blocksToRealDays(cliff);
  const durationDays = blocksToRealDays(duration);
  const intervalDays = blocksToRealDays(interval);
  const initialReleasePercent = Number(initialRelease) / 100;

  const vestingPeriodDays = durationDays - cliffDays;
  const totalIntervals = intervalDays > 0
    ? Math.floor(vestingPeriodDays / intervalDays)
    : 0;
  const vestingPercent = 100 - initialReleasePercent;
  const percentPerInterval = totalIntervals > 0
    ? vestingPercent / totalIntervals
    : 0;

  const points: TimelinePoint[] = [];

  // Start point
  points.push({
    label: 'Start',
    percentage: initialReleasePercent,
    day: 0,
    isUnlocked: mode === 'live',
  });

  // Cliff end point
  if (cliffDays > 0) {
    points.push({
      label: 'Cliff',
      percentage: initialReleasePercent,
      day: cliffDays,
      isUnlocked: false,
    });
  }

  // Vesting intervals (show max 6 points for readability)
  const maxPoints = 6;
  const step = Math.ceil(totalIntervals / maxPoints);

  for (let i = 1; i <= totalIntervals; i++) {
    if (i % step === 0 || i === totalIntervals) {
      points.push({
        label: `+${Math.round(cliffDays + i * intervalDays)}d`,
        percentage: Math.min(
          initialReleasePercent + percentPerInterval * i,
          100
        ),
        day: cliffDays + i * intervalDays,
        isUnlocked: false,
      });
    }
  }

  return (
    <Card variant="neonBlue" fullWidth>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-white/40">
          Vesting Schedule
        </span>
        <Badge variant="neonBlue">
          {durationDays}d Total
        </Badge>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white/3 border border-white/5 rounded-sm p-3">
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">
            Start Release
          </p>
          <p className="text-sm font-mono text-[#15c6e6c0]">
            {initialReleasePercent}%
          </p>
        </div>
        <div className="bg-white/3 border border-white/5 rounded-sm p-3">
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">
            Cliff
          </p>
          <p className="text-sm font-mono text-[#fa7e09cb]">
            {cliffDays}d
          </p>
        </div>
        <div className="bg-white/3 border border-white/5 rounded-sm p-3">
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">
            Duration
          </p>
          <p className="text-sm font-mono text-white/80">
            {durationDays}d
          </p>
        </div>
        <div className="bg-white/3 border border-white/5 rounded-sm p-3">
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">
            Interval
          </p>
          <p className="text-sm font-mono text-white/80">
            {intervalDays}d
          </p>
        </div>
      </div>

      {/* Timeline Bar */}
      <div className="relative w-full">
        {/* Track */}
        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden mb-6">
          <div
            className="h-full rounded-full bg-[#15c6e6c0] transition-all duration-500"
            style={{
              width: `${mode === 'live' ? initialReleasePercent : 0}%`,
            }}
          />
        </div>

        {/* Points */}
        <div className="flex items-end justify-between gap-1 overflow-x-auto pb-2">
          {points.map((point, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1 min-w-[48px]"
            >
              <span
                className={`text-xs font-mono ${
                  point.percentage === 100
                    ? 'text-emerald-400'
                    : point.isUnlocked
                    ? 'text-[#15c6e6c0]'
                    : 'text-white/40'
                }`}
              >
                {point.percentage.toFixed(0)}%
              </span>
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  point.percentage === 100
                    ? 'bg-emerald-400'
                    : point.isUnlocked
                    ? 'bg-[#15c6e6c0]'
                    : 'bg-white/20'
                }`}
              />
              <span className="text-xs font-mono text-white/30">
                {point.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Allocation breakdown */}
      {allocation && allocation > BigInt(0) && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">
            Allocation Breakdown
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-mono text-white/30">At Start</p>
              <p className="text-sm font-mono text-[#15c6e6c0]">
                {(
                  (Number(allocation) * initialReleasePercent) /
                  100
                ).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs font-mono text-white/30">Vesting</p>
              <p className="text-sm font-mono text-[#fa7e09cb]">
                {(
                  (Number(allocation) * (100 - initialReleasePercent)) /
                  100
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}