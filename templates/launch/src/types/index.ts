export type BillingCycle = "monthly" | "annual";

export type Plan = {
  id: string;
  name: string;
  eyebrow: string;
  description: string;
  monthlyPrice: number;
  annualMonthlyPrice: number;
  recommended: boolean;
  cta: string;
};

export type FeatureRow = {
  name: string;
  description: string;
  values: Record<string, string | boolean>;
};
