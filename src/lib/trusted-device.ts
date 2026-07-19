import crypto from "crypto";
import { prisma } from "@/lib/prisma";

// Cookie httpOnly que marca o dispositivo como confiável ("confiar neste computador").
// Valor = `${deviceId}.${segredo}`. No banco guardamos SÓ o hash do segredo.
export const TRUST_COOKIE = "rdt";
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 dias
export const TRUST_MAX_AGE = 30 * 24 * 60 * 60; // segundos (maxAge do cookie)

function sha256(s: string): string {
  return crypto.createHash("sha256").update(s).digest("hex");
}

function timingSafeEqualHex(a: string, b: string): boolean {
  const ab = Buffer.from(a, "hex");
  const bb = Buffer.from(b, "hex");
  if (ab.length !== bb.length || ab.length === 0) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function parseCookieValue(raw: string): { id: string; secret: string } | null {
  const i = raw.indexOf(".");
  if (i < 1 || i >= raw.length - 1) return null;
  return { id: raw.slice(0, i), secret: raw.slice(i + 1) };
}

/** Extrai o valor do cookie `rdt` a partir do header Cookie bruto (usado no authorize). */
export function readTrustCookie(cookieHeader: string | null | undefined): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === TRUST_COOKIE) {
      return decodeURIComponent(part.slice(eq + 1).trim());
    }
  }
  return null;
}

/** Cria um dispositivo confiável e devolve o valor a gravar no cookie. */
export async function createTrustedDevice(
  userId: string,
  userAgent?: string | null
): Promise<string> {
  const secret = crypto.randomBytes(32).toString("hex");
  const device = await prisma.trustedDevice.create({
    data: {
      userId,
      tokenHash: sha256(secret),
      userAgent: userAgent ? userAgent.slice(0, 255) : null,
      expiresAt: new Date(Date.now() + TTL_MS),
    },
  });
  return `${device.id}.${secret}`;
}

/** Checagem somente-leitura: o cookie corresponde a um dispositivo confiável válido deste usuário? */
export async function isTrustedDeviceValid(raw: string, userId: string): Promise<boolean> {
  const parsed = parseCookieValue(raw);
  if (!parsed) return false;
  const device = await prisma.trustedDevice.findUnique({ where: { id: parsed.id } });
  if (!device || device.userId !== userId) return false;
  if (device.expiresAt < new Date()) return false;
  return timingSafeEqualHex(sha256(parsed.secret), device.tokenHash);
}

/**
 * Valida o cookie no momento do login (authorize) e, se válido, renova a janela
 * de 30 dias (sliding). Remove registros expirados. Retorna true se autenticou.
 */
export async function consumeTrustedDevice(raw: string, userId: string): Promise<boolean> {
  const parsed = parseCookieValue(raw);
  if (!parsed) return false;
  const device = await prisma.trustedDevice.findUnique({ where: { id: parsed.id } });
  if (!device || device.userId !== userId) return false;
  if (device.expiresAt < new Date()) {
    await prisma.trustedDevice.delete({ where: { id: device.id } }).catch(() => {});
    return false;
  }
  if (!timingSafeEqualHex(sha256(parsed.secret), device.tokenHash)) return false;
  await prisma.trustedDevice
    .update({
      where: { id: device.id },
      data: { lastUsedAt: new Date(), expiresAt: new Date(Date.now() + TTL_MS) },
    })
    .catch(() => {});
  return true;
}

/** Revoga todos os dispositivos confiáveis do usuário (ex.: perdeu o aparelho). */
export async function revokeAllTrustedDevices(userId: string): Promise<number> {
  const res = await prisma.trustedDevice.deleteMany({ where: { userId } });
  return res.count;
}
