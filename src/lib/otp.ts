import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const VERIFY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const RESET_TTL_MS = 60 * 60 * 1000; // 1 hour

function otpIdentifier(email: string) {
  return `otp:${email.toLowerCase()}`;
}

function verifyIdentifier(email: string) {
  return `verify:${email.toLowerCase()}`;
}

export function generateOtp(): string {
  return String(crypto.randomInt(100000, 999999));
}

export function generateVerifyToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function createOtp(email: string): Promise<string> {
  const identifier = otpIdentifier(email);
  const token = generateOtp();
  const expires = new Date(Date.now() + OTP_TTL_MS);

  // Remove any existing OTP for this email first
  await prisma.verificationToken.deleteMany({ where: { identifier } });
  await prisma.verificationToken.create({ data: { identifier, token, expires } });

  return token;
}

export async function verifyOtp(email: string, otp: string): Promise<boolean> {
  const identifier = otpIdentifier(email);
  const record = await prisma.verificationToken.findFirst({
    where: { identifier, token: otp },
  });

  if (!record) return false;
  if (record.expires < new Date()) {
    await prisma.verificationToken.deleteMany({ where: { identifier } });
    return false;
  }

  // Single-use: delete after verification
  await prisma.verificationToken.deleteMany({ where: { identifier } });
  return true;
}

export async function createVerifyToken(email: string): Promise<string> {
  const identifier = verifyIdentifier(email);
  const token = generateVerifyToken();
  const expires = new Date(Date.now() + VERIFY_TTL_MS);

  await prisma.verificationToken.deleteMany({ where: { identifier } });
  await prisma.verificationToken.create({ data: { identifier, token, expires } });

  return token;
}

export async function createResetToken(email: string): Promise<string> {
  const identifier = `reset:${email.toLowerCase()}`;
  const token = generateVerifyToken();
  const expires = new Date(Date.now() + RESET_TTL_MS);
  await prisma.verificationToken.deleteMany({ where: { identifier } });
  await prisma.verificationToken.create({ data: { identifier, token, expires } });
  return token;
}

export async function verifyResetToken(email: string, token: string): Promise<boolean> {
  const identifier = `reset:${email.toLowerCase()}`;
  const record = await prisma.verificationToken.findFirst({ where: { identifier, token } });
  if (!record) return false;
  if (record.expires < new Date()) {
    await prisma.verificationToken.deleteMany({ where: { identifier } });
    return false;
  }
  await prisma.verificationToken.deleteMany({ where: { identifier } });
  return true;
}

export async function verifyEmailToken(email: string, token: string): Promise<boolean> {
  const identifier = verifyIdentifier(email);
  const record = await prisma.verificationToken.findFirst({
    where: { identifier, token },
  });

  if (!record) return false;
  if (record.expires < new Date()) {
    await prisma.verificationToken.deleteMany({ where: { identifier } });
    return false;
  }

  await prisma.verificationToken.deleteMany({ where: { identifier } });

  // Mark email as verified in User table
  await prisma.user.update({
    where: { email: email.toLowerCase() },
    data: { emailVerified: new Date() },
  });

  return true;
}
