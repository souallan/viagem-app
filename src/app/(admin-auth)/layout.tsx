import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Shield } from "lucide-react";
import Link from "next/link";

export default async function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user?.id && (session.user as { role?: string }).role === "ADMIN") {
    redirect("/backoffice");
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #080810 0%, #0C0C1C 60%, #06060E 100%)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="absolute top-[-15%] left-[20%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(153,27,27,0.12) 0%, transparent 65%)" }}
      />
      <div
        className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(120,20,20,0.08) 0%, transparent 65%)" }}
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-3 group">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #7C1A1A 0%, #991B1B 100%)",
                boxShadow: "0 6px 20px rgba(153,27,27,0.45)",
              }}
            >
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white tracking-tight">RoteiroApp</span>
              <span className="block text-xs font-bold text-red-400/70 uppercase tracking-widest mt-0.5">
                Área Restrita
              </span>
            </div>
          </Link>
        </div>

        <div
          className="rounded-2xl p-7 border border-white/8"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          {children}
        </div>

        <p className="text-center text-[11px] text-slate-700 mt-5">
          Acesso exclusivo para administradores ·{" "}
          <Link href="/login" className="hover:text-slate-500 transition-colors underline underline-offset-2">
            Login comum
          </Link>
        </p>
      </div>
    </div>
  );
}
