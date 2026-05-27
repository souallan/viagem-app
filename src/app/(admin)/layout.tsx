import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if ((session.user as { role?: string }).role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="flex min-h-screen" style={{ background: "#0B0F1A" }}>
      <AdminSidebar />
      <main className="flex-1 ml-60 p-8 min-h-screen">{children}</main>
    </div>
  );
}
