import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/layout/sidebar";
import { LanguageProvider } from "@/contexts/language-context";
import { CookieBanner } from "@/components/lgpd/cookie-banner";
import { EmailVerificationBanner } from "@/components/layout/email-verification-banner";

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
      <div className="flex min-h-screen bg-background">
        <Sidebar isAdmin={isAdmin} />
        <div className="flex-1 ml-64 flex flex-col min-h-screen">
          {!emailVerified && <EmailVerificationBanner email={user?.email ?? ""} />}
          <main className="flex-1 p-8">{children}</main>
        </div>
      </div>
      <CookieBanner />
    </LanguageProvider>
  );
}
