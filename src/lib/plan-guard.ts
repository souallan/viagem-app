import { prisma } from "@/lib/prisma";
import { getActivePlan, PLAN_LIMITS } from "@/lib/plans";

type LimitKey = keyof (typeof PLAN_LIMITS)["FREE"];

/**
 * Limite do plano ATIVO do usuário para um recurso (Infinity = ilimitado/Premium).
 *
 * Usar sempre no servidor, antes de criar o recurso — é o único ponto que
 * realmente separa o plano grátis do Premium. Sem isto, o Premium vira só um selo.
 */
export async function planLimitFor(userId: string, key: LimitKey): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, planExpiresAt: true },
  });
  const activePlan = getActivePlan(user?.plan ?? "FREE", user?.planExpiresAt);
  return PLAN_LIMITS[activePlan][key];
}

/** Resposta padrão de limite atingido — o front usa `code: "PLAN_LIMIT"` para oferecer o upgrade. */
export function planLimitError(message: string) {
  return { error: message, code: "PLAN_LIMIT" as const };
}
