"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Plus, Globe, Plane, Calendar, TrendingUp, MapPin, ArrowRight, FileWarning, Search } from "lucide-react";
import { TripCard } from "@/components/trips/trip-card";
import { useLanguage } from "@/contexts/language-context";

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
    ? "from-sky-600 to-blue-700"
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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-coral-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">

      {/* ── Hero Banner ── */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8 min-h-[180px] flex items-center gap-6">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, #60a5fa 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />

        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl" aria-hidden="true">✈️</span>
            <p className="text-sky-400 text-sm font-semibold tracking-wide uppercase">{t.dashboard.welcomeBack}</p>
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
              <Icon className="h-4 w-4 text-sky-400 mx-auto mb-1" aria-hidden="true" />
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        <Link
          href="/trips/new"
          className="relative z-10 hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-900/40 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> {t.dashboard.newTrip}
        </Link>
      </div>

      {/* ── Search ── */}
      {trips.length >= 4 && (
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou destino..."
            className="w-full h-10 rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/15 transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
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

      {/* ── Empty state ── */}
      {!hasTrips && (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center mx-auto mb-5">
            <MapPin className="h-9 w-9 text-sky-400" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{t.dashboard.noTrips}</h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">{t.dashboard.noTripsDesc}</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/trips/new" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-base font-semibold bg-sky-600 hover:bg-sky-700 text-white transition-colors shadow-sm">
              <Plus className="h-5 w-5" aria-hidden="true" /> {t.dashboard.newTrip}
            </Link>
            <Link href="/routes" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-base font-semibold border border-gray-200 bg-white text-gray-700 hover:border-sky-400 hover:text-sky-600 transition-colors">
              {t.dashboard.createFirst}
            </Link>
          </div>
        </div>
      )}

      {ongoing.length > 0 && (
        <TripSection icon={<Plane className="h-5 w-5 text-emerald-500" />} title={t.dashboard.ongoing} accent="border-emerald-200 bg-emerald-50 text-emerald-700" trips={ongoing} newLabel={t.common.new} />
      )}
      {upcoming.length > 0 && (
        <TripSection icon={<Calendar className="h-5 w-5 text-sky-500" />} title={t.dashboard.upcoming} accent="border-sky-200 bg-sky-50 text-sky-700" trips={upcoming} newLabel={t.common.new} />
      )}
      {past.length > 0 && (
        <TripSection icon={<Globe className="h-5 w-5 text-slate-400" />} title={t.dashboard.past} accent="border-gray-200 bg-gray-50 text-gray-500" trips={past} muted newLabel={t.common.new} />
      )}

      {hasTrips && (
        <div className="fixed bottom-safe right-6 sm:hidden z-50">
          <Link href="/trips/new" className="w-14 h-14 rounded-full bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center shadow-xl transition-colors" aria-label={t.dashboard.newTrip}>
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
        <Link href="/trips/new" className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 hover:text-sky-700">
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
