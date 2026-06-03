import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/app-shell";
import { LanguageProvider } from "@/contexts/language-context";
import { CookieBanner } from "@/components/lgpd/cookie-banner";
import { EmailVerificationBanner } from "@/components/layout/email-verification-banner";
import { AnnouncementBanner } from "@/components/layout/announcement-banner";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const isAdmin = (session.user as { role?: string }).role === "ADMIN";

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { emailVerified: true, email: true },
  });

  const emailVerified = !!user?.emailVerified;

  return (
    <LanguageProvider>
      <AppShell isAdmin={isAdmin}>
        <AnnouncementBanner />
        {!emailVerified && !isAdmin && <EmailVerificationBanner email={user?.email ?? ""} />}
        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </AppShell>
      <CookieBanner />
    </LanguageProvider>
  );
}
