import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/backoffice/login");
  if ((session.user as { role?: string }).role !== "ADMIN") redirect("/dashboard");

  return <AdminShell>{children}</AdminShell>;
}
