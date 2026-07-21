import { NextRequest, NextResponse } from "next/server";
import { verifyEmailToken } from "@/lib/otp";

// Base PÚBLICA do site. Não dá para usar `req.url` aqui: atrás do proxy da Railway
// ele vale `http://0.0.0.0:8080/...`, e o usuário era redirecionado para um
// endereço interno inalcançável ("não foi possível conectar") logo após validar
// o token — o email confirmava a conta mas a pessoa via um erro no navegador.
const APP_URL = process.env.NEXTAUTH_URL ?? "https://roteiroapp.com";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  if (!token || !email) {
    return NextResponse.redirect(new URL("/verify-email?error=invalid", APP_URL));
  }

  const ok = await verifyEmailToken(decodeURIComponent(email), token);
  if (!ok) {
    return NextResponse.redirect(new URL("/verify-email?error=expired", APP_URL));
  }

  return NextResponse.redirect(new URL("/verify-email?success=1", APP_URL));
}
