import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Webhook não configurado." }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Assinatura ausente." }, { status: 400 });

  // Precisa do corpo cru (string) para validar a assinatura.
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    return NextResponse.json(
      { error: `Assinatura inválida: ${(err as Error).message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        const userId = s.metadata?.userId;
        const subscriptionId =
          typeof s.subscription === "string" ? s.subscription : s.subscription?.id;
        if (userId && subscriptionId) {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          await applySubscription(userId, sub);
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId ?? (await userIdFromCustomer(sub.customer));
        if (userId) await applySubscription(userId, sub);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId ?? (await userIdFromCustomer(sub.customer));
        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: { plan: "FREE", stripeSubscriptionId: null },
          });
        }
        break;
      }
    }
  } catch (err) {
    console.error("[stripe webhook]", err);
    return NextResponse.json({ error: "Erro ao processar evento." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

/** Marca PREMIUM (com validade = fim do período) ou reverte para FREE. */
async function applySubscription(userId: string, sub: Stripe.Subscription) {
  const active = sub.status === "active" || sub.status === "trialing";
  // `current_period_end` (epoch s). Nas versões novas da API do Stripe ele saiu do
  // objeto da assinatura e passou para o item — lemos dos dois lugares (tolerante à versão).
  const s = sub as unknown as {
    current_period_end?: number;
    items?: { data?: Array<{ current_period_end?: number }> };
  };
  const periodEnd = s.current_period_end ?? s.items?.data?.[0]?.current_period_end;
  await prisma.user.update({
    where: { id: userId },
    data: {
      plan: active ? "PREMIUM" : "FREE",
      planExpiresAt: periodEnd ? new Date(periodEnd * 1000) : null,
      stripeSubscriptionId: sub.id,
    },
  });

  // Recompensa de indicação: quando o INDICADO assina, quem o indicou ganha
  // 30 dias de Premium. Só quando a assinatura fica ativa (paga) e só UMA vez
  // (referralRewarded evita repetir a cada renovação).
  if (active) {
    await rewardReferrerOnce(userId).catch((e) =>
      console.error("[stripe webhook] recompensa de indicação falhou", e)
    );
  }
}

const DIAS_RECOMPENSA_INDICACAO = 30;

/** Credita 30 dias de Premium a quem indicou este usuário — no máximo uma vez. */
async function rewardReferrerOnce(referredUserId: string) {
  const referido = await prisma.user.findUnique({
    where: { id: referredUserId },
    select: { referredBy: true, referralRewarded: true },
  });
  if (!referido?.referredBy || referido.referralRewarded) return;

  const referrer = await prisma.user.findUnique({
    where: { id: referido.referredBy },
    select: { id: true, plan: true, planExpiresAt: true, bannedAt: true },
  });
  // Marca como recompensado mesmo se o indicador sumiu/foi banido, para não
  // ficar reconsultando a cada renovação.
  if (!referrer || referrer.bannedAt) {
    await prisma.user.update({ where: { id: referredUserId }, data: { referralRewarded: true } });
    return;
  }

  // Soma ao prazo vigente quando ainda está em dia; senão conta a partir de hoje
  // (mesma regra do Premium de cortesia — nunca encurta o acesso).
  const emDia = referrer.plan === "PREMIUM" && referrer.planExpiresAt && referrer.planExpiresAt > new Date();
  const base = emDia ? new Date(referrer.planExpiresAt!) : new Date();
  base.setDate(base.getDate() + DIAS_RECOMPENSA_INDICACAO);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: referrer.id },
      data: { plan: "PREMIUM", planExpiresAt: base },
    }),
    prisma.user.update({
      where: { id: referredUserId },
      data: { referralRewarded: true },
    }),
  ]);
}

async function userIdFromCustomer(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer
): Promise<string | null> {
  const customerId = typeof customer === "string" ? customer : customer.id;
  const u = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } });
  return u?.id ?? null;
}
