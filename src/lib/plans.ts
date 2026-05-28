export type Plan = "FREE" | "PREMIUM";

export const PLAN_LIMITS = {
  FREE: {
    trips: 3,
    activitiesPerTrip: 20,
    communityRoutes: 1,
    experiences: 5,
  },
  PREMIUM: {
    trips: Infinity,
    activitiesPerTrip: Infinity,
    communityRoutes: Infinity,
    experiences: Infinity,
  },
} as const;

export const PLAN_PRICES = {
  monthly: { brl: 1990, label: "R$ 19,90/mês" },
  annual: { brl: 15900, label: "R$ 159/ano", perMonth: "R$ 13,25/mês" },
} as const;

export function isPremium(plan: string, planExpiresAt?: Date | null): boolean {
  if (plan !== "PREMIUM") return false;
  if (!planExpiresAt) return true; // lifetime or managed by Stripe webhook
  return planExpiresAt > new Date();
}

export function getActivePlan(plan: string, planExpiresAt?: Date | null): Plan {
  return isPremium(plan, planExpiresAt) ? "PREMIUM" : "FREE";
}
