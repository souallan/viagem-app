import { NextResponse } from "next/server";

// Digital Asset Links — prova ao Android que roteiroapp.com e o app
// com.roteiroapp.app pertencem ao mesmo dono, liberando os App Links (links do
// site abrem direto no app). Servido em /.well-known/assetlinks.json via rewrite
// no next.config.mjs.
//
// A impressão digital SHA-256 vem do Play Console (Configuração → Integridade do
// app → Assinatura de app) DEPOIS que o app é enviado pela primeira vez. Enquanto
// a env não existir, respondemos 404: melhor não publicar um arquivo vazio ou com
// dado errado, que faria o Android marcar a verificação como falha e cachear isso.
//
// Aceita várias impressões separadas por vírgula (útil quando a chave de upload e
// a de assinatura do Google são diferentes — o caso normal com Play App Signing).
export const dynamic = "force-dynamic";

const PACKAGE_NAME = "com.roteiroapp.app";

export async function GET() {
  const fingerprints = (process.env.ANDROID_CERT_FINGERPRINTS ?? "")
    .split(",")
    .map((f) => f.trim().toUpperCase())
    .filter(Boolean);

  if (fingerprints.length === 0) {
    return new NextResponse("assetlinks não configurado", { status: 404 });
  }

  return NextResponse.json(
    [
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: PACKAGE_NAME,
          sha256_cert_fingerprints: fingerprints,
        },
      },
    ],
    { headers: { "Cache-Control": "public, max-age=3600" } }
  );
}
