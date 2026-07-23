"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Plus, Globe, Plane, Calendar, TrendingUp, MapPin, ArrowRight, FileWarning, Search, Route, Sparkles, ListChecks } from "lucide-react";
import { TripCard } from "@/components/trips/trip-card";
import { useLanguage } from "@/contexts/language-context";
import { PushPermissionPrompt } from "@/components/native/push-permission-prompt";

interface Trip {
  id: string;
  title: string;
  destination: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  coverImage: string | null;
  currency: string;
  budget: number | null;
  _count: { activities: number; expenses: number };
}

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr + "T12:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / 86400000);
}

function CountdownBanner({ trip }: { trip: Trip }) {
  const days = trip.startDate ? daysUntil(trip.startDate) : null;
  if (days === null) return null;

  const isToday    = days === 0;
  const isTomorrow = days === 1;
  const isThisWeek = days <= 7;

  const label = isToday    ? "começa hoje"
              : isTomorrow ? "começa amanhã"
              : `começa em ${days} dias`;

  const gradient = isToday || isTomorrow
    ? "from-emerald-600 to-teal-700"
    : isThisWeek
    ? "from-primary-600 to-blue-700"
    : "from-violet-600 to-purple-700";

  const pulse = isToday || isTomorrow;

  return (
    <Link
      href={`/trips/${trip.id}`}
      className={`relative flex items-center gap-4 rounded-2xl bg-gradient-to-r ${gradient} p-4 sm:p-5 text-white overflow-hidden hover:brightness-110 transition-all group`}
    >
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }}
      />

      <div className={`relative shrink-0 w-14 h-14 rounded-2xl bg-white/20 flex flex-col items-center justify-center text-white ${pulse ? "animate-pulse" : ""}`}>
        {isToday ? (
          <Plane className="h-7 w-7" />
        ) : (
          <>
            <span className="text-2xl font-black leading-none">{days}</span>
            <span className="text-[10px] font-semibold opacity-80 uppercase tracking-wide">dias</span>
          </>
        )}
      </div>

      <div className="relative flex-1 min-w-0">
        <p className="text-white/75 text-xs font-semibold uppercase tracking-widest mb-0.5">
          Próxima viagem · {label}
        </p>
        <h3 className="text-lg font-black leading-tight text-white truncate">{trip.title}</h3>
        <p className="text-white/70 text-sm flex items-center gap-1.5 mt-0.5">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {trip.destination}
        </p>
      </div>

      <ArrowRight className="relative h-5 w-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
    </Link>
  );
}

function DocumentAlertBanner({ trips }: { trips: Trip[] }) {
  const tripsWithDocs = trips.filter((t) =>
    (t.status === "PLANNING" || t.status === "CONFIRMED" || t.status === "IN_PROGRESS") &&
    t.startDate
  );

  if (tripsWithDocs.length === 0) return null;

  return (
    <Link
      href={`/trips/${tripsWithDocs[0].id}/documents`}
      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 transition-colors text-sm"
    >
      <FileWarning className="h-4 w-4 text-amber-500 shrink-0" />
      <span className="text-amber-800 font-medium flex-1">
        Verifique a validade dos seus documentos antes de viajar
      </span>
      <ArrowRight className="h-4 w-4 text-amber-400 shrink-0" />
    </Link>
  );
}

export default function DashboardPage() {
  const { t } = useLanguage();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/trips")
      .then((r) => r.json())
      .then((data) => { setTrips(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return trips;
    const q = search.toLowerCase();
    return trips.filter((t) =>
      t.title.toLowerCase().includes(q) || t.destination.toLowerCase().includes(q)
    );
  }, [trips, search]);

  const ongoing  = filtered.filter((t) => t.status === "IN_PROGRESS");
  const upcoming = filtered.filter((t) => t.status === "PLANNING" || t.status === "CONFIRMED");
  const past     = filtered.filter((t) => t.status === "COMPLETED" || t.status === "CANCELLED");
  const hasTrips = trips.length > 0;

  // Viagem acontecendo agora. Usa `trips` e não `filtered`: o atalho não deve
  // sumir porque o usuário digitou algo na busca.
  const viagemAgora = useMemo(
    () => trips.find((t) => t.status === "IN_PROGRESS") ?? null,
    [trips]
  );

  const nextTrip = useMemo(() => {
    const candidates = [...ongoing, ...upcoming].filter((t) => t.startDate);
    if (candidates.length === 0) return null;
    const withDays = candidates
      .map((t) => ({ trip: t, days: daysUntil(t.startDate!) }))
      .filter(({ days }) => days >= 0 && days <= 30)
      .sort((a, b) => a.days - b.days);
    return withDays[0]?.trip ?? null;
  }, [ongoing, upcoming]);

  const showDocAlert = useMemo(() =>
    [...ongoing, ...upcoming].some((t) => t.startDate && daysUntil(t.startDate) <= 60 && daysUntil(t.startDate) >= 0),
    [ongoing, upcoming]
  );

  if (loading) {
    // Esqueleto no MESMO formato do conteúdo, em vez de um spinner solto: a
    // rota já mostra o skeleton de `loading.tsx` durante a navegação, então um
    // spinner logo depois fazia a tela piscar entre dois estados diferentes.
    return (
      <div className="space-y-6" aria-busy="true" aria-live="polite">
        <div className="skeleton rounded-2xl h-[180px]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton rounded-2xl h-44" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">

      {/* Convite para ativar avisos — só no app nativo e só depois que a pessoa
          já tem viagem, quando o benefício é concreto. */}
      <PushPermissionPrompt temViagem={hasTrips} />

      {/* ── Viagem acontecendo agora ──
          Durante a viagem o que importa é achar rápido o roteiro do dia, o número
          da reserva e o documento — e isso estava a 4 toques, com os documentos
          escondidos atrás de um dropdown. Aqui vira 1 toque, no topo da tela
          inicial. Só aparece quando há viagem em andamento. */}
      {viagemAgora && (
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
              Viagem em andamento
            </span>
          </div>
          <p className="font-black text-gray-900 truncate">{viagemAgora.title}</p>
          <p className="text-sm text-gray-600 truncate mb-3">{viagemAgora.destination}</p>

          <div className="grid grid-cols-3 gap-2">
            {[
              { href: `/trips/${viagemAgora.id}/itinerary`,     label: "Roteiro",    Icon: ListChecks },
              { href: `/trips/${viagemAgora.id}/accommodation`, label: "Reservas",   Icon: MapPin },
              { href: `/trips/${viagemAgora.id}/documents`,     label: "Documentos", Icon: FileWarning },
            ].map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center justify-center gap-1 min-h-[60px] rounded-xl bg-white border border-emerald-100 text-emerald-800 hover:border-emerald-300 transition-colors"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="text-xs font-semibold">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Hero Banner ── */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8 min-h-[180px] flex items-center gap-6">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, #60a5fa 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />

        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl" aria-hidden="true">✈️</span>
            <p className="text-primary-400 text-sm font-semibold tracking-wide uppercase">{t.dashboard.welcomeBack}</p>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">{t.dashboard.hello}!</h1>
          <p className="text-slate-300 text-sm">
            {!hasTrips
              ? t.dashboard.noTripsDesc
              : `${trips.length} viagem${trips.length > 1 ? "s" : ""} · ${ongoing.length} ${t.dashboard.ongoing.toLowerCase()} · ${upcoming.length} ${t.dashboard.upcoming.toLowerCase()}`}
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 hidden md:flex gap-3">
          {[
            { icon: Globe,      label: "Total",              value: trips.length    },
            { icon: TrendingUp, label: t.dashboard.ongoing,  value: ongoing.length  },
            { icon: Calendar,   label: t.dashboard.upcoming, value: upcoming.length },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="travel-glass rounded-xl px-5 py-4 text-center min-w-[88px]">
              <Icon className="h-4 w-4 text-primary-400 mx-auto mb-1" aria-hidden="true" />
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        <Link
          href="/trips/new"
          className="relative z-10 hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary-500 hover:bg-primary-400 text-white shadow-lg shadow-primary-900/40 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> {t.dashboard.newTrip}
        </Link>
      </div>

      {/* ── Search ── */}
      {trips.length >= 4 && (
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou destino..."
            className="w-full h-10 rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/15 transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-600 text-lg leading-none">×</button>
          )}
        </div>
      )}

      {/* ── Countdown ── */}
      {!search && nextTrip && <CountdownBanner trip={nextTrip} />}

      {/* ── Document alert ── */}
      {!search && showDocAlert && !nextTrip && <DocumentAlertBanner trips={[...ongoing, ...upcoming]} />}

      {/* ── Search results label ── */}
      {search && (
        <p className="text-sm text-gray-500">
          {ongoing.length + upcoming.length + past.length} resultado{(ongoing.length + upcoming.length + past.length) !== 1 ? "s" : ""} para <span className="font-semibold text-gray-900">"{search}"</span>
        </p>
      )}

      {/* ── Onboarding / empty state (Théo/UX): dois caminhos claros + como funciona ── */}
      {!hasTrips && (
        <div className="max-w-2xl mx-auto py-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center mx-auto mb-5">
              <MapPin className="h-9 w-9 text-primary-500" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Bora planejar sua primeira viagem?</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Em poucos minutos você tem roteiro, orçamento, mala e lembretes por prazo — tudo num lugar só.
            </p>
          </div>

          {/* Dois caminhos — o modelo pronto é o mais rápido */}
          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            <Link href="/routes" className="group rounded-2xl border-2 border-primary-500/60 bg-gradient-to-b from-primary-50 to-white p-5 hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-1">
                <Route className="h-5 w-5 text-primary-600" />
                <span className="font-bold text-gray-900">Começar por um modelo pronto</span>
              </div>
              <p className="text-sm text-gray-500">Roteiros da comunidade prontos para copiar e adaptar. O jeito mais rápido de começar.</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary-600">
                Ver roteiros <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
            <Link href="/trips/new" className="group rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300 hover:shadow-sm transition-all">
              <div className="flex items-center gap-2 mb-1">
                <Plus className="h-5 w-5 text-gray-700" />
                <span className="font-bold text-gray-900">Criar do zero</span>
              </div>
              <p className="text-sm text-gray-500">Você define destino e datas e monta o roteiro do seu jeito.</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-gray-700">
                Nova viagem <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          </div>

          {/* Como funciona em 3 passos */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Como funciona</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { n: 1, icon: MapPin,     title: "Crie a viagem",   desc: "Destino, datas e uma foto de capa." },
                { n: 2, icon: Sparkles,   title: "Monte o roteiro", desc: "Adicione atividades ou gere com IA." },
                { n: 3, icon: ListChecks, title: "Fique pronto",    desc: "Prontidão, mala e lembretes por prazo." },
              ].map((s) => (
                <div key={s.n} className="flex sm:flex-col gap-3 sm:gap-2">
                  <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-black text-sm shrink-0">
                    {s.n}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      <s.icon className="h-3.5 w-3.5 text-primary-500" /> {s.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {ongoing.length > 0 && (
        <TripSection icon={<Plane className="h-5 w-5 text-emerald-500" />} title={t.dashboard.ongoing} accent="border-emerald-200 bg-emerald-50 text-emerald-700" trips={ongoing} newLabel={t.common.new} />
      )}
      {upcoming.length > 0 && (
        <TripSection icon={<Calendar className="h-5 w-5 text-primary-500" />} title={t.dashboard.upcoming} accent="border-primary-200 bg-primary-50 text-primary-700" trips={upcoming} newLabel={t.common.new} />
      )}
      {past.length > 0 && (
        <TripSection icon={<Globe className="h-5 w-5 text-slate-400" />} title={t.dashboard.past} accent="border-gray-200 bg-gray-50 text-gray-500" trips={past} muted newLabel={t.common.new} />
      )}

      {hasTrips && (
        <div className="fixed bottom-safe-nav right-6 sm:hidden z-50">
          <Link href="/trips/new" className="w-14 h-14 rounded-full bg-primary-500 hover:bg-primary-400 text-white flex items-center justify-center shadow-xl transition-colors" aria-label={t.dashboard.newTrip}>
            <Plus className="h-6 w-6" />
          </Link>
        </div>
      )}
    </div>
  );
}

function TripSection({
  icon, title, accent, trips, muted = false, newLabel,
}: {
  icon: React.ReactNode;
  title: string;
  accent: string;
  trips: Trip[];
  muted?: boolean;
  newLabel: string;
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          {icon}
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${accent}`}>{trips.length}</span>
        </div>
        <Link href="/trips/new" className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700">
          <Plus className="h-3.5 w-3.5" /> {newLabel}
        </Link>
      </div>
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 ${muted ? "opacity-75" : ""}`}>
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </section>
  );
}
