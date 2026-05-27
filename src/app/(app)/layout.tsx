import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { LanguageProvider } from "@/contexts/language-context";
import { CookieBanner } from "@/components/lgpd/cookie-banner";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const isAdmin = (session.user as { role?: string }).role === "ADMIN";

  return (
    <LanguageProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar isAdmin={isAdmin} />
        <main className="flex-1 ml-64 p-8 min-h-screen">{children}</main>
      </div>
      <CookieBanner />
    </LanguageProvider>
  );
}
