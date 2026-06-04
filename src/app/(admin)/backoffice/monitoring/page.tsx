"use client";

import { useEffect, useState } from "react";
import {
  Activity, Database, CheckCircle2, AlertCircle, ExternalLink,
  BarChart3, Search, Server, Bug, Mail, Brain, Users, Plane,
  TrendingUp, RefreshCw, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Health {
  db: { ok: boolean; latencyMs: number };
  totals: { users: number; trips: number };
  recent: { newUsers24h: number; newUsers7d: number; newTrips7d: number };
  env: { ga4Configured: boolean; sentryConfigured: boolean; resendConfigured: boolean; anthropicConfigured: boolean };
}

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span className={cn("inline-block w-2 h-2 rounded-full shrink-0", ok ? "bg-emerald-400" : "bg-red-400")} />
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-white/6 p-5", className)}
      style={{ background: "rgba(255,255,255,0.03)" }}>
      {children}
    </div>
  );
}

function ToolCard({
  icon: Icon, name, description, href, configured, configNote, color,
}: {
  icon: React.ElementType; name: string; description: string; href: string;
  configured?: boolean; configNote?: string; color: string;
}) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", color)}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <a href={href} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-300 transition-colors">
          Abrir <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-bold text-white">{name}</p>
          {configured !== undefined && <StatusDot ok={configured} />}
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
        {configured === false && configNote && (
          <p className="text-[10px] text-amber-500/80 mt-2 leading-relaxed">{configNote}</p>
        )}
      </div>
    </Card>
  );
}

export default function MonitoringPage() {
  const [health, setHealth] = useState<Health | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  function load() {
    setLoading(true);
    fetch("/api/admin/site-health")
      .then(r => r.json())
      .then(d => { setHealth(d); setLastRefresh(new Date()); })
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  const dbLatencyColor = !health ? "text-slate-500"
    : health.db.latencyMs < 100  ? "text-emerald-400"
    : health.db.latencyMs < 300  ? "text-yellow-400"
    : "text-red-400";

  return (
    <div className="space-y-7 pb-12">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-600/20 flex items-center justify-center">
              <Activity className="h-4 w-4 text-teal-400" />
            </div>
            Monitoramento
          </h1>
          <p className="text-slate-500 text-sm mt-1">Saúde do sistema e ferramentas externas de analytics</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors disabled:opacity-40"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          Atualizar
        </button>
      </div>

      {/* ── Saúde em tempo real ── */}
      <div>
        <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">Saúde do sistema</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* DB */}
          <Card className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 flex items-center justify-center shrink-0">
              <Database className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                {health ? <StatusDot ok={health.db.ok} /> : <span className="w-2 h-2 rounded-full bg-slate-700 shrink-0" />}
                <p className="text-xs font-bold text-white">PostgreSQL</p>
              </div>
              <p className={cn("text-[11px] font-semibold", dbLatencyColor)}>
                {loading ? "..." : health ? `${health.db.latencyMs}ms` : "—"}
              </p>
            </div>
          </Card>

          {/* New users 24h */}
          <Card className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600/20 flex items-center justify-center shrink-0">
              <Users className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <p className="text-xl font-black text-white leading-none">{health?.recent.newUsers24h ?? "—"}</p>
              <p className="text-[10px] text-slate-600 mt-0.5">novos usuários (24h)</p>
            </div>
          </Card>

          {/* New users 7d */}
          <Card className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 flex items-center justify-center shrink-0">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xl font-black text-white leading-none">{health?.recent.newUsers7d ?? "—"}</p>
              <p className="text-[10px] text-slate-600 mt-0.5">novos usuários (7d)</p>
            </div>
          </Card>

          {/* New trips 7d */}
          <Card className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-600/20 flex items-center justify-center shrink-0">
              <Plane className="h-4 w-4 text-sky-400" />
            </div>
            <div>
              <p className="text-xl font-black text-white leading-none">{health?.recent.newTrips7d ?? "—"}</p>
              <p className="text-[10px] text-slate-600 mt-0.5">novas viagens (7d)</p>
            </div>
          </Card>
        </div>

        {/* Last refresh */}
        <p className="text-[10px] text-slate-700 mt-2 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Atualizado às {lastRefresh.toLocaleTimeString("pt-BR")}
        </p>
      </div>

      {/* ── Integrações configuradas ── */}
      {health && (
        <Card>
          <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-4">Status das integrações</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Google Analytics 4", ok: health.env.ga4Configured, note: "Defina NEXT_PUBLIC_GA_ID no Railway" },
              { label: "Sentry (erros)",     ok: health.env.sentryConfigured, note: "Defina NEXT_PUBLIC_SENTRY_DSN" },
              { label: "Resend (emails)",    ok: health.env.resendConfigured, note: "Defina RESEND_API_KEY" },
              { label: "Claude AI",          ok: health.env.anthropicConfigured, note: "Defina ANTHROPIC_API_KEY" },
            ].map(({ label, ok, note }) => (
              <div key={label} className="flex items-start gap-2.5 p-3 rounded-xl border border-white/5 bg-white/2">
                {ok
                  ? <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  : <AlertCircle  className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />}
                <div>
                  <p className="text-xs font-semibold text-slate-300">{label}</p>
                  {!ok && <p className="text-[10px] text-slate-600 mt-0.5">{note}</p>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Analytics e ferramentas externas ── */}
      <div>
        <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">Analytics e ferramentas externas</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ToolCard
            icon={BarChart3}
            name="Google Analytics 4"
            description="Métricas de tráfego: usuários ativos, sessões, origem do tráfego, top páginas, funil de conversão."
            href="https://analytics.google.com"
            configured={health?.env.ga4Configured}
            configNote="Não configurado. Adicione NEXT_PUBLIC_GA_ID no Railway para ativar o rastreamento."
            color="bg-orange-600/60"
          />
          <ToolCard
            icon={Search}
            name="Google Search Console"
            description="Desempenho orgânico: impressões, cliques, CTR, posição média, páginas indexadas, erros de crawl."
            href="https://search.google.com/search-console"
            color="bg-green-600/60"
          />
          <ToolCard
            icon={Bug}
            name="Sentry"
            description="Monitoramento de erros em produção: exceções, performance, replays de sessão, alertas de regressão."
            href="https://sentry.io"
            configured={health?.env.sentryConfigured}
            configNote="Não configurado. Adicione NEXT_PUBLIC_SENTRY_DSN no Railway."
            color="bg-violet-600/60"
          />
          <ToolCard
            icon={Server}
            name="Railway"
            description="Métricas de infraestrutura: CPU, memória, latência HTTP, taxa de erros, logs de build e runtime."
            href="https://railway.com/project/666fe1ef-f96a-4c9a-aede-893f4e1a7cfd"
            color="bg-slate-600/60"
          />
          <ToolCard
            icon={Mail}
            name="Resend"
            description="Emails transacionais: OTP de login, verificação de email, redefinição de senha. Taxa de entrega e bounces."
            href="https://resend.com/emails"
            configured={health?.env.resendConfigured}
            configNote="Não configurado. Adicione RESEND_API_KEY no Railway."
            color="bg-sky-600/60"
          />
          <ToolCard
            icon={Brain}
            name="Anthropic (Claude AI)"
            description="API de IA para sugestões de atividades no itinerário. Monitore uso e custos no dashboard da Anthropic."
            href="https://console.anthropic.com"
            configured={health?.env.anthropicConfigured}
            configNote="Não configurado. Adicione ANTHROPIC_API_KEY para ativar as sugestões de IA."
            color="bg-amber-600/60"
          />
        </div>
      </div>

      {/* ── Guia: Integrar GA4 Data API ── */}
      <Card>
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-orange-600/20 flex items-center justify-center shrink-0">
            <BarChart3 className="h-4 w-4 text-orange-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Como ver dados do GA4 direto aqui</p>
            <p className="text-xs text-slate-500 mt-0.5">Para exibir pageviews, sessões e top páginas neste painel, siga os passos abaixo:</p>
          </div>
        </div>
        <ol className="space-y-3 text-xs text-slate-400 leading-relaxed">
          <li className="flex gap-2.5">
            <span className="w-5 h-5 rounded-full bg-orange-600/20 text-orange-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
            <span>No <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-orange-400 underline">Google Cloud Console</a>, crie um <strong className="text-slate-300">Service Account</strong> com a role <code className="text-orange-300 bg-white/5 px-1 rounded">Viewer</code>.</span>
          </li>
          <li className="flex gap-2.5">
            <span className="w-5 h-5 rounded-full bg-orange-600/20 text-orange-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
            <span>Ative a <strong className="text-slate-300">Google Analytics Data API</strong> no projeto do Cloud Console.</span>
          </li>
          <li className="flex gap-2.5">
            <span className="w-5 h-5 rounded-full bg-orange-600/20 text-orange-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
            <span>No GA4 Admin → Property Access → adicione o email da service account como <strong className="text-slate-300">Viewer</strong>.</span>
          </li>
          <li className="flex gap-2.5">
            <span className="w-5 h-5 rounded-full bg-orange-600/20 text-orange-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">4</span>
            <span>Gere a chave JSON da service account. No Railway, adicione:<br />
              <code className="text-orange-300 bg-white/5 px-1.5 py-0.5 rounded mt-1 inline-block">GA4_PROPERTY_ID=<em>seu_property_id_numérico</em></code><br />
              <code className="text-orange-300 bg-white/5 px-1.5 py-0.5 rounded mt-1 inline-block">GA4_SERVICE_ACCOUNT_JSON=&#123;...conteúdo do JSON...&#125;</code>
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="w-5 h-5 rounded-full bg-orange-600/20 text-orange-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">5</span>
            <span>Após o próximo deploy, os dados de tráfego aparecerão automaticamente nesta página.</span>
          </li>
        </ol>
        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-[10px] text-slate-700">
            Alternativa rápida: use o <a href="https://lookerstudio.google.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 underline hover:text-slate-300">Looker Studio</a> para criar um dashboard GA4 compartilhável e embedar via iframe aqui.
          </p>
        </div>
      </Card>

      {/* ── Links rápidos ── */}
      <Card>
        <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-4">Acesso rápido</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "GA4 Realtime", href: "https://analytics.google.com/analytics/web/#/realtime" },
            { label: "GSC Performance", href: "https://search.google.com/search-console/performance/search-analytics" },
            { label: "Railway Métricas", href: "https://railway.com/project/666fe1ef-f96a-4c9a-aede-893f4e1a7cfd/service/5f0f3202-724d-4ff7-b298-d67f0b553a40" },
            { label: "Sentry Issues", href: "https://sentry.io/issues/" },
            { label: "Resend Logs", href: "https://resend.com/emails" },
            { label: "Anthropic Usage", href: "https://console.anthropic.com/settings/usage" },
          ].map(({ label, href }) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/8 bg-white/3 text-xs text-slate-400 hover:text-slate-200 hover:border-white/15 transition-all">
              {label} <ExternalLink className="h-3 w-3 opacity-50" />
            </a>
          ))}
        </div>
      </Card>

    </div>
  );
}
