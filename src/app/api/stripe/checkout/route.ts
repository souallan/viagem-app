import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, priceIdForPlan } from "@/lib/stripe";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Pagamentos ainda não estão disponíveis." }, { status: 503 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Faça login para assinar o Premium." }, { status: 401 });
  }

  const { plan } = await req.json().catch(() => ({ plan: "annual" }));
  const priceId = priceIdForPlan(plan);
  if (!priceId) {
    return NextResponse.json({ error: "Plano não configurado." }, { status: 503 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }

  // Já é Premium com assinatura ativa → NÃO abrir novo checkout. A Stripe aceita
  // criar uma segunda assinatura para o mesmo customer sem reclamar, ou seja, um
  // clique a mais em "Assinar Premium" cobraria o cliente DUAS vezes.
  const planoNoPrazo = !user.planExpiresAt || user.planExpiresAt > new Date();
  if (user.plan === "PREMIUM" && user.stripeSubscriptionId && planoNoPrazo) {
    return NextResponse.json(
      { error: "Você já tem o Premium ativo. Gerencie sua assinatura no seu perfil." },
      { status: 409 }
    );
  }

  try {
    // Reaproveita o customer da Stripe ou cria um novo (1 por usuário).
    // O ID salvo pode ser órfão: criado em OUTRO ambiente/conta da Stripe (ex.:
    // migração de teste → live, ou troca de conta). Nesse caso a Stripe responde
    // `resource_missing` e o checkout inteiro falhava, deixando o usuário travado
    // sem conseguir assinar nunca mais. Validamos antes e recriamos se preciso.
    let customerId = user.stripeCustomerId;
    if (customerId) {
      try {
        const existing = await stripe.customers.retrieve(customerId);
        if ((existing as Stripe.DeletedCustomer).deleted) customerId = null;
      } catch {
        logger.warn("stripe: customer órfão, recriando", { userId: user.id });
        customerId = null;
      }
    }

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
    }

    const origin =
      req.headers.get("origin") || process.env.NEXTAUTH_URL || "https://roteiroapp.com";

    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${origin}/dashboard?upgrade=success`,
      cancel_url: `${origin}/pricing?upgrade=cancel`,
      metadata: { userId: user.id },
      subscription_data: { metadata: { userId: user.id } },
    });

    if (!checkout.url) {
      logger.error("stripe: checkout sem url", { userId: user.id });
      return NextResponse.json(
        { error: "Não foi possível abrir o pagamento. Tente novamente." },
        { status: 502 }
      );
    }

    return NextResponse.json({ url: checkout.url });
  } catch (err) {
    // Sem isto a exceção virava 500 mudo e o usuário só via "tente mais tarde",
    // sem nada no log dizendo o motivo.
    const e = err as { type?: string; code?: string; message?: string };
    logger.error("stripe: falha ao criar checkout", {
      userId: user.id,
      type: e?.type,
      code: e?.code,
      message: e?.message,
    });
    return NextResponse.json(
      { error: "Não foi possível iniciar o pagamento. Tente novamente em instantes." },
      { status: 502 }
    );
  }
}
