"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, FileText, BarChart3, Shield,
  ArrowLeft, Plane, Settings, Mail, X, ScrollText, GitBranch,
  Megaphone, MessageSquare, Activity, ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/backoffice", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/backoffice/posts", label: "Publicações", icon: FileText },
  { href: "/backoffice/announcements", label: "Anúncios", icon: Megaphone },
  { href: "/backoffice/moderation", label: "Moderação", icon: ShieldCheck },
  { href: "/backoffice/comments", label: "Comentários", icon: MessageSquare },
  { href: "/backoffice/users", label: "Usuários", icon: Users },
  { href: "/backoffice/audit", label: "Auditoria", icon: ScrollText },
  { href: "/backoffice/referrals", label: "Referrals", icon: GitBranch },
  { href: "/backoffice/content", label: "Conteúdo", icon: FileText },
  { href: "/backoffice/stats", label: "Estatísticas", icon: BarChart3 },
  { href: "/backoffice/monitoring", label: "Integrações & Saúde", icon: Activity },
  { href: "/backoffice/newsletter", label: "Newsletter", icon: Mail },
  { href: "/backoffice/settings", label: "Configurações", icon: Settings },
];

export function AdminSidebar({ onClose }: { onClose?: () => void } = {}) {
  const pathname = usePathname();

  return (
    <aside
      className="w-60 flex flex-col h-screen fixed left-0 top-0 border-r border-white/5"
      style={{ background: "linear-gradient(180deg, #0A0E1A 0%, #0D1320 100%)" }}
    >
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

      {/* Logo */}
      <div className="px-5 pt-5 pb-4 border-b border-white/6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)", boxShadow: "0 3px 10px rgba(220,38,38,0.40)" }}
          >
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="text-[14px] font-bold text-white leading-none">Admin Panel</span>
            <p className="text-[10px] text-slate-600 leading-tight mt-0.5 font-medium tracking-wide uppercase">RoteiroApp</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:text-white hover:bg-white/8 transition-colors">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-[9px] font-bold text-slate-700 uppercase tracking-widest px-2.5 pb-2">Gestão</p>
        {NAV.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "text-white bg-white/8"
                  : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
              )}
            >
              <div className={cn("w-6 h-6 rounded-md flex items-center justify-center shrink-0", isActive ? "bg-red-600/30" : "bg-white/4")}>
                <item.icon className={cn("h-3.5 w-3.5", isActive ? "text-red-400" : "text-slate-600")} />
              </div>
              <span>{item.label}</span>
              {isActive && <div className="ml-auto w-1 h-1 rounded-full bg-red-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Back to App */}
      <div className="px-3 pb-4 border-t border-white/5 pt-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all"
        >
          <div className="w-6 h-6 rounded-md flex items-center justify-center bg-white/4">
            <ArrowLeft className="h-3.5 w-3.5 text-slate-600" />
          </div>
          <span>Voltar ao app</span>
        </Link>
        <div className="mt-3 px-2.5">
          <div className="flex items-center gap-2">
            <Plane className="h-3 w-3 text-slate-700" />
            <p className="text-[9px] text-slate-700">RoteiroApp Admin v1.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
