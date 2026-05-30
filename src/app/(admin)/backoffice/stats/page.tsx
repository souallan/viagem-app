"use client";

import { useEffect, useState } from "react";
import {
  BarChart3, Users, Plane, BookOpen, Route, TrendingUp,
  MapPin, Package, Wallet, FileText, Calendar, Star,
  Activity, Zap, Target, DollarSign, Clock, Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────
interface Analytics {
  totals: { users: number; trips: number; activities: number; transports: number; expenses: number; documents: number; packingItems: number };
  growthChart: { month: string; users: number; trips: number; experiences: number }[];
  userCohorts: { zero: number; one: number; two_to_five: number; six_plus: number };
  topDestinations: { destination: string; count: number }[];
  activityTypes: { type: string; count: number }[];
  transportTypes: { type: string; count: number }[];
  expenseCategories: { category: string; count: number; total: number }[];
  continents: { continent: string; count: number }[];
  tripStatuses: { status: string; count: number }[];
  durationBuckets: { weekend: number; week: number; two_weeks: number; month_plus: number; unknown: number };
  budgetBuckets: { low: number; mid: number; high: number; premium: number };
  topTags: { tag: string; count: number }[];
  experienceRatings: { rating: number | null; count: number }[];
  experienceMoods: { mood: string | null; count: number }[];
  featureAdoption: { feature: string; count: number; icon: string }[];
}

// ── Helpers ───────────────────────────────────────────────────────
const MONTH_LABELS: Record<string, string> = {
  "01": "Jan", "02": "Fev", "03": "Mar", "04": "Abr",
  "05": "Mai", "06": "Jun", "07": "Jul", "08": "Ago",
  "09": "Set", "10": "Out", "11": "Nov", "12": "Dez",
};
const fmtMonth = (key: string) => {
  const [, m] = key.split("-");
  return MONTH_LABELS[m] ?? key;
};

const ACTIVITY_LABEL: Record<string, string> = {
  ACTIVITY: "Atividade", MEAL: "Refeição", TRANSPORT: "Transporte",
  ACCOMMODATION: "Hospedagem", EVENT: "Evento", OTHER: "Outro",
};
const TRANSPORT_LABEL: Record<string, string> = {
  FLIGHT: "Voo ✈️", BUS: "Ônibus 🚌", TRAIN: "Trem 🚆",
  CAR: "Carro 🚗", BOAT: "Barco ⛵", OTHER: "Outro",
};
const EXPENSE_LABEL: Record<string, string> = {
  ACCOMMODATION: "Hospedagem", TRANSPORT: "Transporte", FOOD: "Alimentação",
  ACTIVITY: "Atividades", SHOPPING: "Compras", HEALTH: "Saúde", OTHER: "Outro",
};
const STATUS_LABEL: Record<string, string> = {
  PLANNING: "Planejando", CONFIRMED: "Confirmada",
  IN_PROGRESS: "Em andamento", COMPLETED: "Concluída", CANCELLED: "Cancelada",
};
const MOOD_LABEL: Record<string, string> = {
  AMAZING: "Incrível 🤩", GREAT: "Ótimo 😄", GOOD: "Bom 🙂",
  MIXED: "Misto 😐", CHALLENGING: "Desafiador 😤",
};

// ── Reusable chart components ─────────────────────────────────────
function HBar({ label, value, max, color, sub }: { label: string; value: number; max: number; color: string; sub?: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-400 truncate max-w-[65%]">{label}</span>
        <span className="text-xs font-semibold text-slate-300 shrink-0">{value}{sub ? ` ${sub}` : ""}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5">
        <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function SparkBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-full h-20 flex items-end rounded-sm overflow-hidden bg-white/3">
        <div className="w-full rounded-sm transition-all duration-700" style={{ height: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, label, color }: { icon: React.ElementType; label: string; color: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", color)}>
        <Icon className="h-3.5 w-3.5 text-white" />
      </div>
      <h2 className="text-sm font-bold text-slate-200">{label}</h2>
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-white/6 p-5", className)} style={{ background: "rgba(255,255,255,0.03)" }}>
      {children}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
export default function AdminStatsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics").then(r => r.json()).then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(5)].map((_, i) => <div key={i} className="h-48 rounded-2xl bg-white/5" />)}
      </div>
    );
  }

  if (!data) return <p className="text-slate-500">Erro ao carregar analytics.</p>;

  const {
    totals, growthChart, userCohorts, topDestinations, activityTypes,
    transportTypes, expenseCategories, continents, tripStatuses,
    durationBuckets, budgetBuckets, topTags, experienceRatings,
    experienceMoods, featureAdoption,
  } = data;

  const maxGrowthUsers = Math.max(...growthChart.map(g => g.users), 1);
  const maxGrowthTrips = Math.max(...growthChart.map(g => g.trips), 1);
  const maxDestCount = topDestinations[0]?.count ?? 1;
  const maxFeatureCount = featureAdoption[0]?.count ?? 1;
  const totalCohort = Object.values(userCohorts).reduce((a, b) => a + b, 0);
  const totalBudget = Object.values(budgetBuckets).reduce((a, b) => a + b, 0);
  const totalDuration = Object.values(durationBuckets).reduce((a, b) => a + b, 0);

  // Affiliate intelligence
  const topTransportType = transportTypes[0]?.type ?? "FLIGHT";
  const topDestination = topDestinations[0]?.destination ?? "—";
  const topExpenseCategory = expenseCategories[0]?.category ?? "—";
  const premiumUserPct = totalBudget > 0 ? Math.round(((budgetBuckets.high + budgetBuckets.premium) / totalBudget) * 100) : 0;
  const longTripPct = totalDuration > 0 ? Math.round(((durationBuckets.two_weeks + durationBuckets.month_plus) / totalDuration) * 100) : 0;

  return (
    <div className="space-y-7 pb-12">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-600/20 flex items-center justify-center">
            <BarChart3 className="h-4.5 w-4.5 text-orange-400" />
          </div>
          Analytics de Comportamento
        </h1>
        <p className="text-slate-500 text-sm mt-1">O que os usuários estão fazendo — dados para decisões de produto e afiliados</p>
      </div>

      {/* ── KPIs rápidos ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Usuários", value: totals.users, icon: Users, color: "#3B82F6" },
          { label: "Viagens", value: totals.trips, icon: Plane, color: "#8B5CF6" },
          { label: "Atividades planejadas", value: totals.activities, icon: Activity, color: "#10B981" },
          { label: "Itens de mala", value: totals.packingItems, icon: Package, color: "#F59E0B" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="flex items-center gap-3">
            <Icon className="h-5 w-5 shrink-0" style={{ color }} />
            <div>
              <p className="text-xl font-black text-white">{value.toLocaleString("pt-BR")}</p>
              <p className="text-[10px] text-slate-600">{label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Crescimento mensal (últimos 6 meses) ── */}
      <Card>
        <SectionTitle icon={TrendingUp} label="Crescimento mensal — últimos 6 meses" color="bg-blue-600/60" />
        <div className="grid grid-cols-6 gap-2 h-28 items-end mb-2">
          {growthChart.map((g) => (
            <div key={g.month} className="flex flex-col gap-1 h-full">
              <div className="flex-1 flex items-end gap-0.5">
                <SparkBar value={g.users} max={maxGrowthUsers} color="#3B82F6" />
                <SparkBar value={g.trips} max={maxGrowthTrips} color="#8B5CF6" />
              </div>
              <p className="text-[9px] text-slate-700 text-center">{fmtMonth(g.month)}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-1">
          <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <div className="w-2 h-2 rounded-sm bg-blue-500" />Novos usuários
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <div className="w-2 h-2 rounded-sm bg-violet-500" />Novas viagens
          </span>
        </div>
      </Card>

      {/* ── Cohort de usuários + Duração de viagens ── */}
      <div className="grid grid-cols-2 gap-5">
        <Card>
          <SectionTitle icon={Users} label="Coorte de usuários" color="bg-blue-600/60" />
          <div className="space-y-3">
            {[
              { label: "Sem viagem ainda", value: userCohorts.zero, color: "#64748B", insight: "potencial de ativação" },
              { label: "1 viagem", value: userCohorts.one, color: "#3B82F6", insight: "usuários novos" },
              { label: "2–5 viagens", value: userCohorts.two_to_five, color: "#8B5CF6", insight: "usuários ativos" },
              { label: "6+ viagens", value: userCohorts.six_plus, color: "#10B981", insight: "super-usuários" },
            ].map(({ label, value, color, insight }) => (
              <div key={label}>
                <HBar label={label} value={value} max={totalCohort} color={color}
                  sub={totalCohort > 0 ? `(${Math.round((value / totalCohort) * 100)}%)` : ""} />
                <p className="text-[9px] text-slate-700 mt-0.5 pl-0.5">{insight}</p>
              </div>
            ))}
          </div>
          {userCohorts.zero > 0 && (
            <div className="mt-4 p-2.5 rounded-xl bg-yellow-600/10 border border-yellow-600/20">
              <p className="text-[10px] text-yellow-400 font-semibold">
                💡 {Math.round((userCohorts.zero / totalCohort) * 100)}% dos usuários nunca criaram uma viagem — oportunidade de onboarding
              </p>
            </div>
          )}
        </Card>

        <Card>
          <SectionTitle icon={Clock} label="Duração das viagens" color="bg-violet-600/60" />
          <div className="space-y-3">
            {[
              { label: "Fim de semana (1–3 dias)", value: durationBuckets.weekend, color: "#F59E0B" },
              { label: "Semana (4–7 dias)", value: durationBuckets.week, color: "#10B981" },
              { label: "2 semanas (8–14 dias)", value: durationBuckets.two_weeks, color: "#3B82F6" },
              { label: "Longa (15+ dias)", value: durationBuckets.month_plus, color: "#8B5CF6" },
            ].map(({ label, value, color }) => (
              <HBar key={label} label={label} value={value} max={totalDuration} color={color}
                sub={totalDuration > 0 ? `(${Math.round((value / totalDuration) * 100)}%)` : ""} />
            ))}
          </div>
          {longTripPct > 30 && (
            <div className="mt-4 p-2.5 rounded-xl bg-blue-600/10 border border-blue-600/20">
              <p className="text-[10px] text-blue-400 font-semibold">
                ✈️ {longTripPct}% fazem viagens longas — forte candidato para seguro viagem afiliado
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* ── Top destinos ── */}
      <Card>
        <SectionTitle icon={MapPin} label="Top destinos — onde os usuários viajam" color="bg-emerald-600/60" />
        <div className="grid grid-cols-2 gap-x-8 gap-y-2.5">
          {topDestinations.slice(0, 10).map((d, i) => (
            <div key={d.destination} className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-slate-700 w-4 text-right shrink-0">#{i + 1}</span>
              <div className="flex-1 min-w-0">
                <HBar label={d.destination} value={d.count} max={maxDestCount} color="#10B981" sub="viagens" />
              </div>
            </div>
          ))}
        </div>
        {topDestinations.length === 0 && (
          <p className="text-slate-600 text-sm">Nenhuma viagem cadastrada ainda.</p>
        )}
      </Card>

      {/* ── Feature adoption ── */}
      <Card>
        <SectionTitle icon={Zap} label="Adoção de funcionalidades" color="bg-yellow-600/60" />
        <div className="space-y-2.5">
          {featureAdoption.map(({ feature, count, icon }) => (
            <div key={feature} className="flex items-center gap-3">
              <span className="text-base shrink-0 w-5 text-center">{icon}</span>
              <div className="flex-1">
                <HBar label={feature} value={count} max={maxFeatureCount} color="#F59E0B" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-2.5 rounded-xl bg-slate-800/60 border border-white/5">
          <p className="text-[10px] text-slate-500">
            Funcionalidades com uso baixo = oportunidade de melhoria de UX ou descobribilidade
          </p>
        </div>
      </Card>

      {/* ── Transporte + Atividades ── */}
      <div className="grid grid-cols-2 gap-5">
        <Card>
          <SectionTitle icon={Plane} label="Modais de transporte" color="bg-sky-600/60" />
          <div className="space-y-2.5">
            {transportTypes.map(({ type, count }) => (
              <HBar key={type} label={TRANSPORT_LABEL[type] ?? type} value={count}
                max={transportTypes[0]?.count ?? 1} color="#0EA5E9" sub="registros" />
            ))}
          </div>
          {transportTypes.length === 0 && <p className="text-slate-600 text-sm">Sem dados ainda.</p>}
        </Card>

        <Card>
          <SectionTitle icon={Activity} label="Tipos de atividade" color="bg-green-600/60" />
          <div className="space-y-2.5">
            {activityTypes.map(({ type, count }) => (
              <HBar key={type} label={ACTIVITY_LABEL[type] ?? type} value={count}
                max={activityTypes[0]?.count ?? 1} color="#22C55E" sub="itens" />
            ))}
          </div>
          {activityTypes.length === 0 && <p className="text-slate-600 text-sm">Sem dados ainda.</p>}
        </Card>
      </div>

      {/* ── Gastos e orçamentos ── */}
      <div className="grid grid-cols-2 gap-5">
        <Card>
          <SectionTitle icon={Wallet} label="Categorias de gasto" color="bg-rose-600/60" />
          <div className="space-y-2.5">
            {expenseCategories.map(({ category, count, total }) => (
              <div key={category} className="space-y-0.5">
                <HBar label={EXPENSE_LABEL[category] ?? category} value={count}
                  max={expenseCategories[0]?.count ?? 1} color="#F43F5E" sub="registros" />
                {total > 0 && (
                  <p className="text-[9px] text-slate-700 pl-0.5">
                    Total: R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                  </p>
                )}
              </div>
            ))}
          </div>
          {expenseCategories.length === 0 && <p className="text-slate-600 text-sm">Sem despesas registradas.</p>}
        </Card>

        <Card>
          <SectionTitle icon={DollarSign} label="Faixas de orçamento" color="bg-amber-600/60" />
          <div className="space-y-2.5">
            {[
              { label: "Econômico (< R$ 2k)", value: budgetBuckets.low, color: "#22C55E" },
              { label: "Intermediário (R$ 2–6k)", value: budgetBuckets.mid, color: "#F59E0B" },
              { label: "Premium (R$ 6–15k)", value: budgetBuckets.high, color: "#F97316" },
              { label: "Luxo (R$ 15k+)", value: budgetBuckets.premium, color: "#EF4444" },
            ].map(({ label, value, color }) => (
              <HBar key={label} label={label} value={value} max={Math.max(totalBudget, 1)} color={color}
                sub={totalBudget > 0 ? `(${Math.round((value / totalBudget) * 100)}%)` : ""} />
            ))}
          </div>
          {totalBudget === 0 && <p className="text-slate-600 text-sm">Sem orçamentos definidos ainda.</p>}
          {premiumUserPct > 0 && (
            <div className="mt-4 p-2.5 rounded-xl bg-orange-600/10 border border-orange-600/20">
              <p className="text-[10px] text-orange-400 font-semibold">
                💎 {premiumUserPct}% com orçamento premium — elegíveis para afiliados de luxo
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* ── Conteúdo: Tags + Avaliações + Humores ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card>
          <SectionTitle icon={FileText} label="Tags mais usadas" color="bg-purple-600/60" />
          <div className="flex flex-wrap gap-1.5">
            {topTags.length === 0 ? (
              <p className="text-slate-600 text-sm">Sem tags ainda.</p>
            ) : topTags.map(({ tag, count }) => (
              <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-semibold border border-white/8"
                style={{ background: `rgba(139,92,246,${Math.min(0.1 + (count / (topTags[0]?.count ?? 1)) * 0.4, 0.5)})`, color: "#C4B5FD" }}>
                {tag} ×{count}
              </span>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle icon={Star} label="Avaliações dos relatos" color="bg-yellow-600/60" />
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(star => {
              const entry = experienceRatings.find(r => r.rating === star);
              const count = entry?.count ?? 0;
              const max = experienceRatings[0]?.count ?? 1;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-[10px] text-yellow-400 shrink-0">{"★".repeat(star)}</span>
                  <div className="flex-1">
                    <HBar label="" value={count} max={max} color="#F59E0B" />
                  </div>
                  <span className="text-[10px] text-slate-600 w-4 shrink-0">{count}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <SectionTitle icon={BookOpen} label="Humor das experiências" color="bg-pink-600/60" />
          <div className="space-y-2.5">
            {experienceMoods.length === 0 ? (
              <p className="text-slate-600 text-sm">Sem relatos ainda.</p>
            ) : experienceMoods.map(({ mood, count }) => (
              <HBar key={mood ?? "?"} label={MOOD_LABEL[mood ?? ""] ?? (mood ?? "?")} value={count}
                max={experienceMoods[0]?.count ?? 1} color="#EC4899" />
            ))}
          </div>
        </Card>
      </div>

      {/* ── Continentes + Status das viagens ── */}
      <div className="grid grid-cols-2 gap-5">
        <Card>
          <SectionTitle icon={Globe} label="Continentes (roteiros comunidade)" color="bg-teal-600/60" />
          <div className="space-y-2.5">
            {continents.length === 0 ? (
              <p className="text-slate-600 text-sm">Sem roteiros publicados.</p>
            ) : continents.map(({ continent, count }) => (
              <HBar key={continent} label={continent} value={count}
                max={continents[0]?.count ?? 1} color="#14B8A6" sub="roteiros" />
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle icon={Calendar} label="Status das viagens" color="bg-indigo-600/60" />
          <div className="space-y-2.5">
            {[
              { status: "PLANNING", color: "#3B82F6" },
              { status: "CONFIRMED", color: "#22C55E" },
              { status: "IN_PROGRESS", color: "#EAB308" },
              { status: "COMPLETED", color: "#64748B" },
              { status: "CANCELLED", color: "#EF4444" },
            ].map(({ status, color }) => {
              const entry = tripStatuses.find(s => s.status === status);
              const count = entry?.count ?? 0;
              const maxStatus = Math.max(...tripStatuses.map(s => s.count), 1);
              return (
                <HBar key={status} label={STATUS_LABEL[status] ?? status} value={count}
                  max={maxStatus} color={color} />
              );
            })}
          </div>
        </Card>
      </div>

      {/* ── Inteligência de Afiliados ── */}
      <Card>
        <SectionTitle icon={Target} label="Inteligência de Afiliados — oportunidades baseadas nos dados" color="bg-red-600/60" />
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              title: "Hospedagem (Booking.com / Airbnb)",
              signal: topDestinations.slice(0, 3).map(d => d.destination).join(", ") || "Sem dados",
              insight: `${topDestinations.length} destinos únicos. Foque campanhas nos top 3.`,
              priority: "ALTA",
              color: "blue",
              link: "partners.booking.com",
            },
            {
              title: "Voos (Skyscanner / Decolar)",
              signal: `${TRANSPORT_LABEL[topTransportType] ?? topTransportType} é o modal mais usado`,
              insight: topTransportType === "FLIGHT"
                ? "Voos dominam — prioridade máxima para Skyscanner"
                : "Ônibus/carro lideram — explore parceiros rodoviários",
              priority: topTransportType === "FLIGHT" ? "ALTA" : "MÉDIA",
              color: "violet",
              link: "partners.skyscanner.net",
            },
            {
              title: "Atividades (GetYourGuide / Viator)",
              signal: `${totals.activities} atividades planejadas`,
              insight: "Usuários planejam atividades — alto potencial de conversão em passeios pagos",
              priority: totals.activities > 10 ? "ALTA" : "MÉDIA",
              color: "emerald",
              link: "partner.getyourguide.com",
            },
            {
              title: "Seguro Viagem",
              signal: `${longTripPct}% fazem viagens de 2+ semanas`,
              insight: longTripPct > 20
                ? "Viagens longas = maior risco. Banner de seguro na aba de documentos."
                : "Viagens curtas dominam — seguro de menor prioridade",
              priority: longTripPct > 20 ? "ALTA" : "BAIXA",
              color: "orange",
              link: "iata.org/travel-insurance",
            },
            {
              title: "Câmbio / Cartão Internacional",
              signal: expenseCategories.length > 0 ? `Maior gasto: ${EXPENSE_LABEL[topExpenseCategory] ?? topExpenseCategory}` : "Sem dados de gasto",
              insight: "Usuários registram despesas — integração com Wise/Nomad Pay pode agregar valor",
              priority: "MÉDIA",
              color: "yellow",
              link: "wise.com/partners",
            },
            {
              title: "Hotéis Luxo / Premium",
              signal: `${premiumUserPct}% com orçamento acima de R$ 6k`,
              insight: premiumUserPct > 15
                ? "Base com poder aquisitivo alto — explore Marriott Bonvoy Affiliates"
                : "Maioria é econômica — foque em Booking econômico",
              priority: premiumUserPct > 15 ? "MÉDIA" : "BAIXA",
              color: "red",
              link: "marriott.com/affiliates",
            },
          ].map(({ title, signal, insight, priority, color, link }) => {
            const priorityColor = priority === "ALTA" ? "text-green-400 bg-green-600/15 border-green-600/25"
              : priority === "MÉDIA" ? "text-yellow-400 bg-yellow-600/15 border-yellow-600/25"
              : "text-slate-500 bg-white/5 border-white/8";
            return (
              <div key={title} className="p-3.5 rounded-xl border border-white/8 bg-white/2 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-bold text-slate-200">{title}</p>
                  <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-md border shrink-0", priorityColor)}>
                    {priority}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">{signal}</p>
                <p className="text-[10px] text-slate-600 leading-relaxed">{insight}</p>
                <p className="text-[9px] text-slate-700 font-mono">{link}</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
