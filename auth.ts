import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyOtp } from "@/lib/otp";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        otp:   { label: "Código", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) return null;

        const email = String(credentials.email).trim().toLowerCase();
        const otp   = String(credentials.otp).trim();

        const valid = await verifyOtp(email, otp);
        if (!valid) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        if (user.bannedAt) return null; // conta suspensa não autentica

        return {
          id:    user.id,
          email: user.email,
          name:  user.name,
          image: user.image,
          role:  user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id;
        token.role = (user as { role?: string }).role ?? "USER";
      }
      // Revalida role/banimento a CADA request lendo o banco. Sem isto, o JWT
      // (até 30 dias) fica defasado: banir um usuário ou rebaixar um admin não
      // teria efeito até o token expirar. (middleware não chama auth() → sem edge.)
      if (token.id) {
        const fresh = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, bannedAt: true },
        });
        if (!fresh || fresh.bannedAt) {
          (token as { banned?: boolean }).banned = true;
        } else {
          (token as { banned?: boolean }).banned = false;
          token.role = fresh.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Banido (ou conta apagada) → sessão SEM id: o app inteiro checa
      // `session.user.id`, então isto o trata como não autenticado em páginas e APIs.
      if ((token as { banned?: boolean })?.banned) return session;
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
});
