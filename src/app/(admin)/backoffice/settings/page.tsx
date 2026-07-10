"use client";

import { useEffect, useState } from "react";
import { Settings, Shield, Globe, Mail, Bell, Database, CheckCircle2, XCircle, RefreshCw } from "lucide-react";

interface HealthStatus {
  db: boolean | null;
  auth: boolean | null;
  checking: boolean;
}

export default function AdminSettingsPage() {
  const [health, setHealth] = useState<HealthStatus>({ db: null, auth: null, checking: false });

  async function checkHealth() {
    setHealth({ db: null, auth: null, checking: true });
    try {
      const [dbRes, authRes] = await Promise.all([
        fetch("/api/admin/stats").then(r => ({ ok: r.ok })).catch(() => ({ ok: false })),
        fetch("/api/auth/session").then(r => ({ ok: r.ok })).catch(() => ({ ok: false })),
      ]);
      setHealth({ db: dbRes.ok, auth: authRes.ok, checking: false });
    } catch {
      setHealth({ db: false, auth: false, checking: false });
    }
  }

  useEffect(() => { checkHealth(); }, []);

  const StatusBadge = ({ ok }: { ok: boolean | null }) => {
    if (ok === null) return <span className="text-[10px] text-slate-600 font-bold">—</span>;
    return ok
      ? <span className="flex items-center gap-1 text-[10px] font-bold text-green-400"><CheckCircle2 className="h-3 w-3" />OK</span>
      : <span className="flex items-center gap-1 text-[10px] font-bold text-red-400"><XCircle className="h-3 w-3" />ERRO</span>;
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-600/20 flex items-center justify-center">
              <Settings className="h-[18px] w-[18px] text-slate-400" />
            </div>
            Configurações
          </h1>
          <p className="text-slate-500 text-sm mt-1">Configurações do sistema RoteiroApp</p>
        </div>
        <button
          onClick={checkHealth}
          disabled={health.checking}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${health.checking ? "animate-spin" : ""}`} />
          Verificar sistema
        </button>
      </div>

      {/* Health checks */}
      <div className="rounded-2xl border border-white/6 p-5" style={{ background: "rgba(255,255,255,0.03)" }}>
        <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-400" /> Saúde do sistema
        </h2>
        <div className="space-y-3">
          {[
            { label: "Banco de dados (PostgreSQL)", status: health.db },
            { label: "Autenticação (NextAuth)", status: health.auth },
          ].map(({ label, status }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-sm text-slate-400">{label}</span>
              <StatusBadge ok={status} />
            </div>
          ))}
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            icon: Shield,
            title: "Segurança",
            items: [
              "Autenticação via NextAuth v5",
              "Senhas com bcrypt (12 rounds)",
              "Sessões JWT — sem estado no servidor",
              "Headers de segurança: CSP, HSTS, X-Frame",
              "Rate limiting: 10 req/min em /api/auth",
              "Audit log de ações administrativas",
            ],
            color: "text-red-400",
            bg: "bg-red-600/20",
          },
          {
            icon: Database,
            title: "Banco de dados",
            items: [
              "PostgreSQL 15 (Railway)",
              "ORM: Prisma v5.22",
              "Conexão via Railway Private Network",
              "Backup automático habilitado no Railway",
              "Schema sync via prisma db push",
            ],
            color: "text-blue-400",
            bg: "bg-blue-600/20",
          },
          {
            icon: Globe,
            title: "Internacionalização",
            items: ["Idiomas: PT, ES, EN", "Context API para troca dinâmica", "Fallback: Português"],
            color: "text-green-400",
            bg: "bg-green-600/20",
          },
          {
            icon: Mail,
            title: "Contato",
            items: ["alandesouza.ac@gmail.com", "Instagram: @RoteiroApp", "WhatsApp disponível"],
            color: "text-violet-400",
            bg: "bg-violet-600/20",
          },
        ].map(({ icon: Icon, title, items, color, bg }) => (
          <div key={title} className="rounded-2xl border border-white/6 p-5" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <h2 className="text-sm font-bold text-slate-300">{title}</h2>
            </div>
            <ul className="space-y-2">
              {items.map(item => (
                <li key={item} className="text-xs text-slate-500 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-slate-700 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Feature flags */}
      <div className="rounded-2xl border border-white/6 p-5" style={{ background: "rgba(255,255,255,0.03)" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-yellow-600/20 flex items-center justify-center">
            <Bell className="h-4 w-4 text-yellow-400" />
          </div>
          <h2 className="text-sm font-bold text-slate-300">Funcionalidades ativas</h2>
        </div>
        <div className="space-y-3">
          {[
            { label: "Dicas semanais automáticas", active: true },
            { label: "Roteiros da comunidade", active: true },
            { label: "Relatos de experiências", active: true },
            { label: "Exportação para Maps", active: true },
            { label: "Diário de viagem", active: true },
            { label: "Lista de preparativos", active: true },
            { label: "Links afiliados (Booking/Skyscanner/GetYourGuide)", active: true },
            { label: "Exportação de dados (LGPD)", active: true },
            { label: "Exclusão de conta (LGPD)", active: true },
            { label: "Audit log de ações admin", active: true },
          ].map(({ label, active }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-sm text-slate-400">{label}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${active ? "bg-green-600/20 text-green-400" : "bg-slate-700/40 text-slate-600"}`}>
                {active ? "ATIVO" : "INATIVO"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
