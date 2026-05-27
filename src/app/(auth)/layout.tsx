import { Plane } from "lucide-react";
import Link from "next/link";
import { CookieBanner } from "@/components/lgpd/cookie-banner";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0A1018 0%, #0E1828 60%, #091420 100%)" }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial glow — subtle blue */}
      <div
        className="absolute top-[-15%] left-[20%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(26,95,204,0.12) 0%, transparent 65%)" }}
      />
      <div
        className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(13,123,163,0.10) 0%, transparent 65%)" }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-3 group">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #1A5FCC 0%, #2570E8 100%)",
                boxShadow: "0 6px 20px rgba(26,95,204,0.40)",
              }}
            >
              <Plane className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text tracking-tight">RoteiroApp</span>
          </Link>
          <p className="text-slate-500 text-xs mt-2 font-medium tracking-wide uppercase">Travel Planner</p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-7 border border-white/8"
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          {children}
        </div>

        {/* Privacy link */}
        <p className="text-center text-[11px] text-slate-600 mt-5">
          <Link href="/privacy" className="hover:text-slate-400 transition-colors underline underline-offset-2">
            Política de Privacidade
          </Link>
          {" · "}
          <Link href="/privacy#5" className="hover:text-slate-400 transition-colors underline underline-offset-2">
            Cookies
          </Link>
          {" · "}LGPD compliant
        </p>
      </div>
      <CookieBanner />
    </div>
  );
}
