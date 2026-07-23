import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { auditLog } from "@/lib/audit";

async function adminSession() {
  const session = await auth();
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "ADMIN";
  return { session, isAdmin };
}

export async function GET() {
  const { isAdmin } = await adminSession();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      // Prazo e origem do Premium: a tela precisa distinguir cortesia (sem
      // assinatura) de assinante pagante, porque só a cortesia pode ser revogada
      // por aqui.
      planExpiresAt: true,
      stripeSubscriptionId: true,
      image: true,
      createdAt: true,
      bannedAt: true,
      banReason: true,
      referralCode: true,
      _count: { select: { trips: true, experiences: true, communityRoutes: true } },
    },
  });

  return NextResponse.json(users);
}

export async function PATCH(req: NextRequest) {
  const { session, isAdmin } = await adminSession();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { id, role, action, banReason, meses } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  // ── Premium concedido pelo admin (cortesia, suporte, teste, influenciador) ──
  // NÃO mexe em stripeSubscriptionId de propósito: se a pessoa tem assinatura
  // paga, ela continua sendo a fonte da verdade e o webhook do Stripe segue
  // mandando. Aqui só estendemos o acesso.
  if (action === "GRANT_PREMIUM") {
    const qtd = Number(meses);
    if (!Number.isFinite(qtd) || qtd < 1 || qtd > 120) {
      return NextResponse.json({ error: "Informe de 1 a 120 meses." }, { status: 400 });
    }

    const atual = await prisma.user.findUnique({
      where: { id },
      select: { planExpiresAt: true, plan: true },
    });
    if (!atual) return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });

    // Soma ao prazo vigente quando ainda está em dia; senão conta a partir de hoje.
    // Sem isso, conceder a quem já é Premium ENCURTARIA o acesso.
    const base =
      atual.plan === "PREMIUM" && atual.planExpiresAt && atual.planExpiresAt > new Date()
        ? new Date(atual.planExpiresAt)
        : new Date();
    base.setMonth(base.getMonth() + qtd);

    const updated = await prisma.user.update({
      where: { id },
      data: { plan: "PREMIUM", planExpiresAt: base },
      select: { id: true, email: true, plan: true, planExpiresAt: true },
    });
    await auditLog({
      actorId: session!.user!.id!,
      actorEmail: session!.user!.email ?? "",
      action: "USER_GRANT_PREMIUM",
      targetId: id,
      targetType: "User",
      detail: `Premium concedido a ${updated.email} por ${qtd} mês(es) — expira em ${updated.planExpiresAt?.toISOString().slice(0, 10)}`,
      ip: req.headers.get("x-forwarded-for") ?? undefined,
    });
    return NextResponse.json(updated);
  }

  if (action === "REVOKE_PREMIUM") {
    const alvo = await prisma.user.findUnique({
      where: { id },
      select: { stripeSubscriptionId: true },
    });
    // Assinante pagante: revogar aqui deixaria o banco em desacordo com o Stripe
    // (ele continuaria cobrando e o webhook devolveria o Premium na renovação).
    // O caminho certo é cancelar no Stripe.
    if (alvo?.stripeSubscriptionId) {
      return NextResponse.json(
        { error: "Este usuário tem assinatura ativa na Stripe. Cancele por lá — revogar aqui não interrompe a cobrança." },
        { status: 409 }
      );
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { plan: "FREE", planExpiresAt: null },
      select: { id: true, email: true, plan: true, planExpiresAt: true },
    });
    await auditLog({
      actorId: session!.user!.id!,
      actorEmail: session!.user!.email ?? "",
      action: "USER_REVOKE_PREMIUM",
      targetId: id,
      targetType: "User",
      detail: `Premium removido de ${updated.email}`,
      ip: req.headers.get("x-forwarded-for") ?? undefined,
    });
    return NextResponse.json(updated);
  }

  if (action === "BAN") {
    const updated = await prisma.user.update({
      where: { id },
      data: { bannedAt: new Date(), banReason: banReason ?? "Violação dos termos de uso" },
      select: { id: true, email: true, bannedAt: true },
    });
    await auditLog({
      actorId: session!.user!.id!,
      actorEmail: session!.user!.email ?? "",
      action: "USER_BAN",
      targetId: id,
      targetType: "User",
      detail: `Usuário banido: ${updated.email} — motivo: ${banReason ?? "não informado"}`,
      ip: req.headers.get("x-forwarded-for") ?? undefined,
    });
    return NextResponse.json(updated);
  }

  if (action === "UNBAN") {
    const updated = await prisma.user.update({
      where: { id },
      data: { bannedAt: null, banReason: null },
      select: { id: true, email: true, bannedAt: true },
    });
    await auditLog({
      actorId: session!.user!.id!,
      actorEmail: session!.user!.email ?? "",
      action: "USER_UNBAN",
      targetId: id,
      targetType: "User",
      detail: `Usuário desbanido: ${updated.email}`,
      ip: req.headers.get("x-forwarded-for") ?? undefined,
    });
    return NextResponse.json(updated);
  }

  if (!role || !["USER", "ADMIN"].includes(role)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const updated = await prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, email: true, role: true },
  });
  await auditLog({
    actorId: session!.user!.id!,
    actorEmail: session!.user!.email ?? "",
    action: "USER_ROLE_CHANGE",
    targetId: id,
    targetType: "User",
    detail: `Role alterado para ${role} em ${updated.email}`,
    ip: req.headers.get("x-forwarded-for") ?? undefined,
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const { session, isAdmin } = await adminSession();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  if (session?.user?.id === id) {
    return NextResponse.json({ error: "Não pode excluir sua própria conta." }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id }, select: { email: true } });
  await prisma.user.delete({ where: { id } });

  await auditLog({
    actorId: session!.user!.id!,
    actorEmail: session!.user!.email ?? "",
    action: "USER_DELETE",
    targetId: id,
    targetType: "User",
    detail: `Usuário deletado: ${target?.email}`,
    ip: req.headers.get("x-forwarded-for") ?? undefined,
  });

  return NextResponse.json({ ok: true });
}
