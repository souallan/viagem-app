import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

// Envio de push via FCM HTTP v1. Não usamos o SDK `firebase-admin` (pesado) —
// o protocolo é só um JWT assinado trocado por um access token OAuth2, o que o
// `crypto` do Node já faz. Enquanto as credenciais não existirem, `pushConfigured`
// é false e as funções viram no-op (feature inerte, não quebra build nem deploy).

const PROJECT_ID = process.env.FCM_PROJECT_ID;
const CLIENT_EMAIL = process.env.FCM_CLIENT_EMAIL;
// A chave vem do JSON da service account; em env var as quebras viram "\n" literais.
const PRIVATE_KEY = process.env.FCM_PRIVATE_KEY?.replace(/\\n/g, "\n");

export const pushConfigured = !!(PROJECT_ID && CLIENT_EMAIL && PRIVATE_KEY);

type CachedToken = { value: string; expiresAt: number };
let cached: CachedToken | null = null;

function base64url(input: string | Buffer): string {
  return Buffer.from(input).toString("base64url");
}

/** Access token OAuth2 da service account (cacheado até ~1 min antes de expirar). */
async function getAccessToken(): Promise<string | null> {
  if (!pushConfigured) return null;

  const now = Math.floor(Date.now() / 1000);
  if (cached && cached.expiresAt > now + 60) return cached.value;

  const header = { alg: "RS256", typ: "JWT" };
  const claims = {
    iss: CLIENT_EMAIL,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claims))}`;
  const signature = crypto
    .sign("RSA-SHA256", Buffer.from(unsigned), PRIVATE_KEY as string)
    .toString("base64url");

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${signature}`,
    }),
  });

  if (!res.ok) {
    logger.error("push: falha ao obter access token do FCM", {
      status: res.status,
      body: (await res.text()).slice(0, 300),
    });
    return null;
  }

  const data = (await res.json()) as { access_token: string; expires_in?: number };
  cached = { value: data.access_token, expiresAt: now + (data.expires_in ?? 3600) };
  return cached.value;
}

export type PushPayload = {
  title: string;
  body: string;
  /** Caminho aberto ao tocar na notificação (ex.: "/trips/abc"). */
  url?: string;
};

/**
 * Envia um push para todos os aparelhos do usuário.
 * Tokens que o FCM reportar como inválidos são REMOVIDOS do banco — sem isso a
 * tabela acumula lixo e todo envio futuro gasta requisições que já nascem mortas.
 * Retorna quantos aparelhos receberam.
 */
export async function sendPushToUser(userId: string, payload: PushPayload): Promise<number> {
  if (!pushConfigured) return 0;

  const devices = await prisma.deviceToken.findMany({ where: { userId } });
  if (devices.length === 0) return 0;

  const accessToken = await getAccessToken();
  if (!accessToken) return 0;

  const endpoint = `https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`;
  const stale: string[] = [];
  let delivered = 0;

  await Promise.all(
    devices.map(async (device) => {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: {
              token: device.token,
              notification: { title: payload.title, body: payload.body },
              // `data` chega no listener do app e leva o usuário à tela certa.
              data: payload.url ? { url: payload.url } : undefined,
              android: { notification: { sound: "default" } },
            },
          }),
        });

        if (res.ok) {
          delivered++;
          return;
        }

        // 404/UNREGISTERED = app desinstalado ou token rotacionado pelo FCM.
        // 400/INVALID_ARGUMENT em cima do token = token malformado.
        const text = await res.text();
        if (res.status === 404 || text.includes("UNREGISTERED") || text.includes("INVALID_ARGUMENT")) {
          stale.push(device.token);
        } else {
          logger.error("push: falha no envio", { status: res.status, body: text.slice(0, 200) });
        }
      } catch (err) {
        logger.error("push: erro de rede no envio", { message: (err as Error)?.message });
      }
    })
  );

  if (stale.length > 0) {
    await prisma.deviceToken.deleteMany({ where: { token: { in: stale } } }).catch(() => {});
    logger.info("push: tokens invalidos removidos", { count: stale.length });
  }

  return delivered;
}
