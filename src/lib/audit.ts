import { prisma } from "@/lib/prisma";

interface AuditParams {
  actorId: string;
  actorEmail: string;
  action: string;
  targetId?: string;
  targetType?: string;
  detail?: string;
  ip?: string;
}

export async function auditLog(params: AuditParams) {
  try {
    await prisma.auditLog.create({ data: params });
  } catch {
    // non-blocking — audit failure must never break the main action
  }
}
