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
}

async function userIdFromCustomer(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer
): Promise<string | null> {
  const customerId = typeof customer === "string" ? customer : customer.id;
  const u = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } });
  return u?.id ?? null;
}
