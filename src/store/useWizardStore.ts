// store/useWizardStore.ts
import { create } from 'zustand';
import { z } from 'zod';
import { isAddress } from 'viem';

// ─── Constants ────────────────────────────────────────────────────────────────

export const NATIVE_TOKEN = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' as const;

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

export const TierSchema = z.object({
  name: z
    .string()
    .min(1, 'Tier name is required')
    .max(31, 'Max 31 characters (bytes32)')
    .regex(/^[\w\s]+$/, 'No special characters'),
  allocationPerPass: z
    .string()
    .min(1, 'Allocation is required')
    .refine((v) => !isNaN(parseInt(v)) && parseInt(v) > 0, {
      message: 'Must be a positive number',
    }),
  maxSupply: z
    .string()
    .min(1, 'Max supply is required')
    .refine((v) => !isNaN(parseInt(v)) && parseInt(v) > 0, {
      message: 'Must be a positive integer',
    }),
});

export const CategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(31, 'Max 31 characters (bytes32)')
    .regex(/^[\w\s]+$/, 'No special characters'),
  tiers: z
    .array(TierSchema)
    .min(1, 'At least one tier is required'),
});

export const Step1Schema = z
  .object({
    isNative: z.boolean(),
    tokenAddress: z.string().optional(),
    amount: z
      .string()
      .min(1, 'Amount is required')
      .refine((v) => !isNaN(parseInt(v)) && parseInt(v) > 0, {
        message: 'Must be a positive number',
      }),
    startDate: z
      .string()
      .min(1, 'Start date is required')
      .refine(
        (v) => {
          const d = new Date(v);
          return !isNaN(d.getTime()) && d > new Date(Date.now() + 25 * 60 * 1000);
        },
        { message: 'Must be at least 30 mins from now' }
      ),
  })
  .superRefine(({ isNative, tokenAddress }, ctx) => {
    // Only validate token address for ERC-20 vaults
    if (!isNative) {
      if (!tokenAddress || tokenAddress.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Token address is required',
          path: ['tokenAddress'],
        });
      } else if (!isAddress(tokenAddress)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid ERC-20 address',
          path: ['tokenAddress'],
        });
      }
    }
    // Native: tokenAddress is already set to the NATIVE_TOKEN sentinel
    // by handleToggleNative — no validation needed here
  });

export const Step2Schema = z
  .object({
    categories: z
      .array(CategorySchema)
      .min(1, 'At least one category is required'),
    totalDeposit: z.string(),
  })
  .superRefine(({ categories, totalDeposit }, ctx) => {
    // Duplicate category names
    const names = categories.map((c) => c.name.toLowerCase());
    const dupes = names.filter((n, i) => names.indexOf(n) !== i);
    if (dupes.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate category names: ${[...new Set(dupes)].join(', ')}`,
        path: ['categories'],
      });
    }

    // Total allocation must not exceed deposit
    const deposit = parseInt(totalDeposit || '0');
    if (deposit > 0) {
      const allocated = categories.reduce((catAcc, cat) => {
        return (
          catAcc +
          cat.tiers.reduce((tierAcc, tier) => {
            return (
              tierAcc +
              parseInt(tier.allocationPerPass || '0') *
                parseInt(tier.maxSupply || '0')
            );
          }, 0)
        );
      }, 0);

      if (allocated > deposit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Total allocated (${allocated.toLocaleString()}) exceeds deposit (${deposit.toLocaleString()})`,
          path: ['categories'],
        });
      }

      if (allocated <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Total allocation must be greater than 0',
          path: ['categories'],
        });
      }
    }
  });

export const VestingConfigSchema = z
  .object({
    enabled: z.boolean(),
    cliff: z.number().min(0),
    duration: z.number().min(0),
    interval: z.number().min(0),
    initialRelease: z.number().min(0).max(100),
  })
  .superRefine((v, ctx) => {
    if (!v.enabled) return;

    if (v.duration <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Duration must be greater than 0 when vesting is enabled',
        path: ['duration'],
      });
    }

    if (v.cliff >= v.duration) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Cliff must be less than duration',
        path: ['cliff'],
      });
    }

    if (v.interval <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Interval must be greater than 0 when vesting is enabled',
        path: ['interval'],
      });
    }

    if (v.interval > v.duration) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Interval cannot exceed duration',
        path: ['interval'],
      });
    }

    if (v.initialRelease >= 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Initial release must be less than 100% when vesting is enabled',
        path: ['initialRelease'],
      });
    }

    // Contract requires: (duration - cliff) % interval === 0
    if (v.duration > 0 && v.interval > 0 && v.cliff < v.duration) {
      const vestingPeriod = v.duration - v.cliff;
      if (vestingPeriod % v.interval !== 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Vesting period (${vestingPeriod}d) must be exactly divisible by interval (${v.interval}d). Try interval ${
            [v.interval - 1, v.interval + 1, vestingPeriod]
              .find((i) => i > 0 && vestingPeriod % i === 0) ?? v.interval
          }d or duration ${v.cliff + Math.ceil(vestingPeriod / v.interval) * v.interval}d`,
          path: ['interval'],
        });
      }
    }
  });

export const Step3Schema = z.object({
  vestingConfigs: z.record(z.string(), VestingConfigSchema),
});

export const Step4Schema = z
  .object({
    approvalMode: z.enum(['creator', 'admin', 'Team']),
    admin1: z.string(),
    admin2: z.string(),
  })
  .superRefine(({ approvalMode, admin1, admin2 }, ctx) => {
    if (approvalMode === 'admin' || approvalMode === 'Team') {
      if (!isAddress(admin1)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Valid Admin 1 address is required',
          path: ['admin1'],
        });
      }
    }
    if (approvalMode === 'Team') {
      if (!isAddress(admin2)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Valid Admin 2 address is required',
          path: ['admin2'],
        });
      }
      if (isAddress(admin1) && isAddress(admin2) && admin1.toLowerCase() === admin2.toLowerCase()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Admin 1 and Admin 2 must be different addresses',
          path: ['admin2'],
        });
      }
    }
  });

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type TierInput = z.infer<typeof TierSchema>;
export type CategoryInput = z.infer<typeof CategorySchema>;
export type Step1Values = z.infer<typeof Step1Schema>;
export type VestingConfigValues = z.infer<typeof VestingConfigSchema>;
export type ApprovalMode = z.infer<typeof Step4Schema>['approvalMode'];

// ─── Step Errors ──────────────────────────────────────────────────────────────

export interface StepErrors {
  step1: Partial<Record<keyof Step1Values, string>>;
  step2: { categories?: string; items?: Record<number, { name?: string; tiers?: Record<number, Partial<TierInput>> }> };
  step3: Record<string, Partial<Record<keyof VestingConfigValues, string>>>;
  step4: { admin1?: string; admin2?: string; approvalMode?: string };
}

// ─── Store State ──────────────────────────────────────────────────────────────

interface WizardState {
  currentStep: number;
  step1: Step1Values;
  categories: CategoryInput[];
  vestingConfigs: Record<string, VestingConfigValues>;
  approvalMode: ApprovalMode;
  admin1: string;
  admin2: string;
  executor: string;
  errors: StepErrors;
  submitting: boolean;
  submitError: string | null;
}

// ─── Store Actions ────────────────────────────────────────────────────────────

interface WizardActions {
  goToStep: (step: number) => void;
  nextStep: () => boolean;
  prevStep: () => void;
  setStep1: (values: Partial<Step1Values>) => void;
  setCategories: (categories: CategoryInput[]) => void;
  addCategory: () => void;
  removeCategory: (index: number) => void;
  updateCategory: (index: number, values: Partial<CategoryInput>) => void;
  addTier: (categoryIndex: number) => void;
  removeTier: (categoryIndex: number, tierIndex: number) => void;
  updateTier: (categoryIndex: number, tierIndex: number, values: Partial<TierInput>) => void;
  getVestingForCategory: (categoryName: string) => VestingConfigValues;
  updateVesting: (categoryName: string, values: Partial<VestingConfigValues>) => void;
  syncVestingKeys: () => void;
  setApprovalMode: (mode: ApprovalMode) => void;
  setAdmin1: (address: string) => void;
  setAdmin2: (address: string) => void;
  setExecutor: (address: string) => void;
  validateStep: (step: number) => boolean;
  clearErrors: () => void;
  setSubmitting: (v: boolean) => void;
  setSubmitError: (err: string | null) => void;
  reset: () => void;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_TIER: TierInput = {
  name: '',
  allocationPerPass: '',
  maxSupply: '',
};

const DEFAULT_CATEGORY: CategoryInput = {
  name: '',
  tiers: [{ ...DEFAULT_TIER }],
};

const DEFAULT_VESTING: VestingConfigValues = {
  enabled: false,
  cliff: 0,
  duration: 0,
  interval: 0,
  initialRelease: 0,
};

const DEFAULT_ERRORS: StepErrors = {
  step1: {},
  step2: {},
  step3: {},
  step4: {},
};

const initialState: WizardState = {
  currentStep: 0,
  step1: { isNative: false, tokenAddress: '' as `0x${string}`, amount: '', startDate: '' },
  categories: [{ ...DEFAULT_CATEGORY, tiers: [{ ...DEFAULT_TIER }] }],
  vestingConfigs: {},
  approvalMode: 'creator',
  admin1: '',
  admin2: '',
  executor: '',
  errors: DEFAULT_ERRORS,
  submitting: false,
  submitError: null,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractZodErrors(result: z.SafeParseReturnType<unknown, unknown>) {
  if (result.success) return {};
  return result.error.issues.reduce<Record<string, string>>((acc, issue) => {
    const key = issue.path.join('.');
    if (!acc[key]) acc[key] = issue.message;
    return acc;
  }, {});
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useWizardStore = create<WizardState & WizardActions>((set, get) => ({
  ...initialState,

  // ── Navigation ──────────────────────────────────────────────────────────────

  goToStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep, validateStep } = get();
    const valid = validateStep(currentStep);
    if (valid) {
      if (currentStep === 1) get().syncVestingKeys();
      set({ currentStep: currentStep + 1 });
    }
    return valid;
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) set({ currentStep: currentStep - 1 });
  },

  // ── Step 1 ──────────────────────────────────────────────────────────────────

  setStep1: (values) =>
    set((s) => ({
      step1: { ...s.step1, ...values },
      errors: { ...s.errors, step1: {} },
    })),

  // ── Step 2 ──────────────────────────────────────────────────────────────────

  setCategories: (categories) =>
    set({ categories, errors: { ...get().errors, step2: {} } }),

  addCategory: () =>
    set((s) => ({
      categories: [
        ...s.categories,
        { ...DEFAULT_CATEGORY, tiers: [{ ...DEFAULT_TIER }] },
      ],
    })),

  removeCategory: (index) =>
    set((s) => ({
      categories: s.categories.filter((_, i) => i !== index),
    })),

  updateCategory: (index, values) =>
    set((s) => ({
      categories: s.categories.map((cat, i) =>
        i === index ? { ...cat, ...values } : cat
      ),
    })),

  addTier: (categoryIndex) =>
    set((s) => {
      const updated = [...s.categories];
      updated[categoryIndex] = {
        ...updated[categoryIndex],
        tiers: [...updated[categoryIndex].tiers, { ...DEFAULT_TIER }],
      };
      return { categories: updated };
    }),

  removeTier: (categoryIndex, tierIndex) =>
    set((s) => {
      const updated = [...s.categories];
      updated[categoryIndex] = {
        ...updated[categoryIndex],
        tiers: updated[categoryIndex].tiers.filter((_, i) => i !== tierIndex),
      };
      return { categories: updated };
    }),

  updateTier: (categoryIndex, tierIndex, values) =>
    set((s) => {
      const updated = [...s.categories];
      updated[categoryIndex] = {
        ...updated[categoryIndex],
        tiers: updated[categoryIndex].tiers.map((tier, i) =>
          i === tierIndex ? { ...tier, ...values } : tier
        ),
      };
      return { categories: updated };
    }),

  // ── Step 3 ──────────────────────────────────────────────────────────────────

  getVestingForCategory: (categoryName) =>
    get().vestingConfigs[categoryName] ?? { ...DEFAULT_VESTING },

  updateVesting: (categoryName, values) =>
    set((s) => ({
      vestingConfigs: {
        ...s.vestingConfigs,
        [categoryName]: {
          ...(s.vestingConfigs[categoryName] ?? { ...DEFAULT_VESTING }),
          ...values,
        },
      },
      errors: { ...s.errors, step3: {} },
    })),

  syncVestingKeys: () => {
    const { categories, vestingConfigs } = get();
    const synced: Record<string, VestingConfigValues> = {};
    for (const cat of categories) {
      synced[cat.name] = vestingConfigs[cat.name] ?? { ...DEFAULT_VESTING };
    }
    set({ vestingConfigs: synced });
  },

  // ── Step 4 ──────────────────────────────────────────────────────────────────

  setApprovalMode: (mode) =>
    set({ approvalMode: mode, admin1: '', admin2: '', errors: { ...get().errors, step4: {} } }),

  setAdmin1: (address) =>
    set((s) => ({ admin1: address, errors: { ...s.errors, step4: { ...s.errors.step4, admin1: undefined } } })),

  setAdmin2: (address) =>
    set((s) => ({ admin2: address, errors: { ...s.errors, step4: { ...s.errors.step4, admin2: undefined } } })),

  setExecutor: (address) =>
    set({ executor: address }),

  // ── Validation ──────────────────────────────────────────────────────────────

  validateStep: (step) => {
    const s = get();

    if (step === 0) {
      const result = Step1Schema.safeParse(s.step1);
      if (!result.success) {
        const errs = extractZodErrors(result);
        set((state) => ({
          errors: {
            ...state.errors,
            step1: {
              tokenAddress: errs['tokenAddress'],
              amount: errs['amount'],
              startDate: errs['startDate'],
            },
          },
        }));
        return false;
      }
      set((state) => ({ errors: { ...state.errors, step1: {} } }));
      return true;
    }

    if (step === 1) {
      const result = Step2Schema.safeParse({
        categories: s.categories,
        totalDeposit: s.step1.amount,
      });
      if (!result.success) {
        const errs = extractZodErrors(result);
        set((state) => ({
          errors: {
            ...state.errors,
            step2: { categories: errs['categories'] ?? errs[''] },
          },
        }));
        return false;
      }
      set((state) => ({ errors: { ...state.errors, step2: {} } }));
      return true;
    }

    if (step === 2) {
      const vestingEntries = Object.entries(s.vestingConfigs);
      const errs: Record<string, Partial<Record<keyof VestingConfigValues, string>>> = {};
      let hasError = false;

      for (const [catName, config] of vestingEntries) {
        const result = VestingConfigSchema.safeParse(config);
        if (!result.success) {
          hasError = true;
          const flat = extractZodErrors(result);
          errs[catName] = {
            enabled:        flat['enabled'],
            cliff:          flat['cliff'],
            duration:       flat['duration'],
            interval:       flat['interval'],
            initialRelease: flat['initialRelease'],
          };
        }
      }

      if (hasError) {
        set((state) => ({ errors: { ...state.errors, step3: errs } }));
        return false;
      }
      set((state) => ({ errors: { ...state.errors, step3: {} } }));
      return true;
    }

    if (step === 3) {
      const result = Step4Schema.safeParse({
        approvalMode: s.approvalMode,
        admin1: s.admin1,
        admin2: s.admin2,
      });
      if (!result.success) {
        const errs = extractZodErrors(result);
        set((state) => ({
          errors: {
            ...state.errors,
            step4: {
              admin1: errs['admin1'],
              admin2: errs['admin2'],
            },
          },
        }));
        return false;
      }
      set((state) => ({ errors: { ...state.errors, step4: {} } }));
      return true;
    }

    return true;
  },

  clearErrors: () => set({ errors: DEFAULT_ERRORS }),

  // ── Submission ──────────────────────────────────────────────────────────────

  setSubmitting: (v) => set({ submitting: v }),
  setSubmitError: (err) => set({ submitError: err }),

  // ── Reset ─────────────────────────────────────────────────────────────────

  reset: () => set(initialState),
}));

// ─── Derived selector ─────────────────────────────────────────────────────────

export function selectCreateVaultPayload(s: WizardState) {
  return {
    // Resolve token address — sentinel for native, actual address for ERC-20
    tokenAddress: s.step1.isNative ? NATIVE_TOKEN : s.step1.tokenAddress,
    isNative: s.step1.isNative,
    amount: s.step1.amount,
    startDate: s.step1.startDate,
    categories: s.categories,
    vestingConfigs: s.vestingConfigs,
    approvalMode: s.approvalMode,
    admin1: s.admin1,
    admin2: s.admin2,
    executor: s.executor, 
  };
}