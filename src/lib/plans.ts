export type Plan = "FREE" | "PREMIUM";

export const PLAN_LIMITS = {
  FREE: {
    trips: 1,
    activitiesPerTrip: 20,
    // 0 = publicar roteiro na comunidade é recurso Premium. VER os roteiros da
    // comunidade segue livre (o GET não checa limite).
    communityRoutes: 0,
    // 0 = criar relato é recurso Premium. Quem já tem relatos continua VENDO e
    // EDITANDO os seus (a listagem e o PUT não checam limite) — o bloqueio é só
    // para publicar novos.
    experiences: 0,
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
