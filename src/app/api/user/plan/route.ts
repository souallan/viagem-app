import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isPremium } from "@/lib/plans";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";

/** Endpoint leve para o selo de plano (sidebar). Lê direto do banco (sempre fresco). */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, planExpiresAt: true, stripeCustomerId: true },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let { plan, planExpiresAt } = user;

  // Auto-cura: se o usuário TEM cliente na Stripe mas aqui aparece como não-Premium,
  // pode ter havido falha de entrega do webhook ("pagou e continuou grátis"). Reconcilia
  // com a Stripe na hora que ele abre o app. Só roda no caso de divergência (raro).
  if (stripe && user.stripeCustomerId && !isPremium(plan, planExpiresAt)) {
    try {
      const subs = await stripe.subscriptions.list({ customer: user.stripeCustomerId, status: "active", limit: 1 });
      const sub = subs.data[0] as (Stripe.Subscription & { current_period_end?: number; items?: { data?: Array<{ current_period_end?: number }> } }) | undefined;
      if (sub) {
        const periodEnd = sub.current_period_end ?? sub.items?.data?.[0]?.current_period_end;
        const updated = await prisma.user.update({
          where: { id: session.user.id },
          data: {
            plan: "PREMIUM",
            planExpiresAt: periodEnd ? new Date(periodEnd * 1000) : null,
            stripeSubscriptionId: sub.id,
          },
          select: { plan: true, planExpiresAt: true },
        });
        plan = updated.plan;
        planExpiresAt = updated.planExpiresAt;
      }
    } catch (e) {
      console.error("[plan reconcile]", e);
    }
  }

  return NextResponse.json({
    plan,
    isPremium: isPremium(plan, planExpiresAt),
  });
}
