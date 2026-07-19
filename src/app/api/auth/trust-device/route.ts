import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  createTrustedDevice,
  revokeAllTrustedDevices,
  TRUST_COOKIE,
  TRUST_MAX_AGE,
} from "@/lib/trusted-device";

const isProd = process.env.NODE_ENV === "production";

// Marca o dispositivo atual como confiável (chamado após um login por OTP bem-sucedido
// em que o usuário marcou "confiar neste dispositivo"). Requer sessão ativa.
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const cookieValue = await createTrustedDevice(
    session.user.id,
    req.headers.get("user-agent")
  );

  const res = NextResponse.json({ ok: true });
  res.cookies.set(TRUST_COOKIE, cookieValue, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: TRUST_MAX_AGE,
  });
  return res;
}

// Revoga TODOS os dispositivos confiáveis do usuário e limpa o cookie atual.
export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const count = await revokeAllTrustedDevices(session.user.id);

  const res = NextResponse.json({ ok: true, revoked: count });
  res.cookies.set(TRUST_COOKIE, "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
