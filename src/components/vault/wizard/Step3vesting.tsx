'use client';

import { useWizardStore } from '@/store/useWizardStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/forms/FormField';
import { VestingTimeline } from '@/components/vault/VestingTimeline';
import { daysToBlocks } from '@/utils/format';

export function Step3Vesting() {
  const categories = useWizardStore((s) => s.categories);
  const getVestingForCategory = useWizardStore((s) => s.getVestingForCategory);
  const updateVesting = useWizardStore((s) => s.updateVesting);
  const errors = useWizardStore((s) => s.errors.step3);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xs font-mono uppercase tracking-widest text-white/40">
        Vesting Configuration
      </h2>

      {categories.map((cat) => {
        const v = getVestingForCategory(cat.name);
        const catErrors = errors[cat.name] ?? {};

        return (
          <Card key={cat.name} variant="neonBlue" fullWidth>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-mono text-[#15c6e6c0] uppercase tracking-widest">
                {cat.name || 'Unnamed Category'}
              </span>
              <Badge variant={v.enabled ? 'neonOrange' : 'ghost'}>
                {v.enabled ? 'Vesting On' : 'No Vesting'}
              </Badge>
            </div>

            {/* Toggle */}
            <div className="flex items-center gap-3 mb-5">
              <button
                type="button"
                onClick={() => updateVesting(cat.name, { enabled: !v.enabled })}
                className={`
                  w-10 h-5 rounded-full border transition-all duration-200 relative
                  ${v.enabled
                    ? 'bg-[rgba(21,198,230,0.15)] border-[#15c6e6c0]/50'
                    : 'bg-white/5 border-white/10'
                  }
                `}
              >
                <span
                  className={`
                    absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200
                    ${v.enabled ? 'left-5 bg-[#15c6e6c0]' : 'left-0.5 bg-white/20'}
                  `}
                />
              </button>
              <span className="text-xs font-mono text-white/40">
                {v.enabled ? 'Vesting enabled' : '100% at Start'}
              </span>
            </div>

            {/* Vesting Fields */}
            {v.enabled && (
              <div className="grid grid-cols-2 gap-4 mb-5">
                <FormField
                  label="Initial Release %"
                  hint="0–99"
                  error={catErrors.initialRelease?.toString()}
                >
                  <Input
                    type="number"
                    min="0"
                    max="99"
                    value={v.initialRelease}
                    onChange={(e) =>
                      updateVesting(cat.name, {
                        initialRelease: parseInt(e.target.value) || 0,
                      })
                    }
                    variant="neonBlue"
                  />
                </FormField>

                <FormField
                  label="Cliff (days)"
                  error={catErrors.cliff?.toString()}
                >
                  <Input
                    type="number"
                    min="0"
                    value={v.cliff}
                    onChange={(e) =>
                      updateVesting(cat.name, {
                        cliff: parseInt(e.target.value) || 0,
                      })
                    }
                    variant="neonBlue"
                  />
                </FormField>

                <FormField
                  label="Duration (days)"
                  error={catErrors.duration?.toString()}
                >
                  <Input
                    type="number"
                    min="0"
                    value={v.duration}
                    onChange={(e) =>
                      updateVesting(cat.name, {
                        duration: parseInt(e.target.value) || 0,
                      })
                    }
                    variant="neonBlue"
                  />
                </FormField>

                <FormField
                  label="Interval (days)"
                  error={catErrors.interval?.toString()}
                >
                  <Input
                    type="number"
                    min="0"
                    value={v.interval}
                    onChange={(e) =>
                      updateVesting(cat.name, {
                        interval: parseInt(e.target.value) || 0,
                      })
                    }
                    variant="neonBlue"
                  />
                </FormField>
              </div>
            )}

            {/* Timeline Preview */}
            <VestingTimeline
              enabled={v.enabled}
              cliff={daysToBlocks(v.cliff)}
              duration={daysToBlocks(v.duration)}
              interval={daysToBlocks(v.interval)}
              initialRelease={BigInt(Math.round(v.initialRelease * 100))}
              mode="preview"
            />
          </Card>
        );
      })}
    </div>
  );
}