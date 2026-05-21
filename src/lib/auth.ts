// Dev mode: auth is bypassed — all requests run as the fixed dev user.
import { prisma } from "@/lib/prisma";
import { handlers as _handlers, signIn, signOut } from "../../auth";

export { signIn, signOut };
export const handlers = _handlers;

const DEV_USER_ID = "dev-viagem-local";
const DEV_USER_EMAIL = "dev@viagem.local";
const DEV_USER_NAME = "Usuário Dev";

let ready = false;

async function ensureDevUser() {
  if (ready) return;
  await prisma.user.upsert({
    where: { id: DEV_USER_ID },
    update: {},
    create: { id: DEV_USER_ID, email: DEV_USER_EMAIL, name: DEV_USER_NAME },
  });
  ready = true;
}

export async function auth() {
  await ensureDevUser();
  return {
    user: { id: DEV_USER_ID, email: DEV_USER_EMAIL, name: DEV_USER_NAME },
    expires: "2099-01-01",
  };
}
