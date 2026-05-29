import Link from "next/link";
import { Plane, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(160deg, #0A1018 0%, #0E1828 60%, #091420 100%)" }}
    >
      <div className="text-center max-w-sm">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: "linear-gradient(135deg, #1A5FCC 0%, #2570E8 100%)", boxShadow: "0 12px 40px rgba(26,95,204,0.40)" }}
        >
          <Plane className="h-10 w-10 text-white" />
        </div>

        <p className="text-7xl font-black text-white/10 mb-2 select-none">404</p>
        <h1 className="text-2xl font-black text-white mb-3">Página não encontrada</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          Essa rota não existe ou foi removida. Verifique o endereço e tente novamente.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm transition-colors"
          >
            Ir para o Dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 font-semibold text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
