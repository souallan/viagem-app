import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const PLATFORMS = ["android", "ios"] as const;

/** Registra (ou reassocia) o token de push do aparelho atual ao usuário logado. */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { token, platform } = await req.json().catch(() => ({}));

  if (typeof token !== "string" || token.length < 10 || token.length > 4096) {
    return NextResponse.json({ error: "Token inválido." }, { status: 400 });
  }
  if (!PLATFORMS.includes(platform)) {
    return NextResponse.json({ error: "Plataforma inválida." }, { status: 400 });
  }

  // upsert por `token` (que é único): se o aparelho já estava registrado para
  // OUTRA conta — celular emprestado, troca de login — o registro muda de dono
  // em vez de duplicar. Sem isso, o dono anterior continuaria recebendo os
  // pushes de um aparelho que não é mais dele.
  await prisma.deviceToken.upsert({
    where: { token },
    create: { token, platform, userId: session.user.id },
    update: { userId: session.user.id, platform, lastSeenAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}

/** Remove o token deste aparelho (logout / usuário desativou as notificações). */
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { token } = await req.json().catch(() => ({}));
  if (typeof token !== "string" || !token) {
    return NextResponse.json({ error: "Token inválido." }, { status: 400 });
  }

  // Escopado ao usuário: ninguém desregistra o aparelho de outra pessoa.
  await prisma.deviceToken.deleteMany({ where: { token, userId: session.user.id } });

  return NextResponse.json({ ok: true });
}
