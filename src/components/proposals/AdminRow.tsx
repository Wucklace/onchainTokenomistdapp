'use client';

import { Badge, Button } from '@/components/ui';
import { formatAddress } from '@/utils/format';

interface AdminRowProps {
  label: string;
  address: string;
  approved: boolean;
  isCurrentAdmin: boolean;
  canAct: boolean;
  allTiersVerified: boolean;
  isBusy: boolean;
  onApprove: () => void;
  onReject: () => void;
}

export function AdminRow({
  label,
  address,
  approved,
  isCurrentAdmin,
  canAct,
  allTiersVerified,
  isBusy,
  onApprove,
  onReject,
}: AdminRowProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-white/3 border border-white/5 rounded-sm">
      <div>
        <p className="text-xs font-mono text-white/30 uppercase mb-1">{label}</p>
        <p className="text-xs font-mono text-white/60">{formatAddress(address)}</p>
      </div>
      {approved ? (
        <Badge variant="success">Approved</Badge>
      ) : isCurrentAdmin && canAct ? (
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={onApprove}
            isLoading={isBusy}
            disabled={!allTiersVerified || isBusy}
            title={!allTiersVerified ? 'Verify all tiers first' : undefined}
          >
            Approve
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onReject}
            isLoading={isBusy}
            disabled={isBusy}
          >
            Reject
          </Button>
        </div>
      ) : (
        <Badge variant="neonOrange" dot>Pending</Badge>
      )}
    </div>
  );
}