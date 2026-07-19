"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  Printer, MapPin, Calendar, BedDouble, Plane, Wallet,
  FileText, Package, ChevronRight, Sunrise, Sun, Moon,
  Clock, Zap, Utensils, Bus, Building2, CalendarDays, Globe,
  AlertTriangle, CheckCircle2, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────

interface Trip {
  id: string;
  title: string;
  destination: string;
  description: string | null;
  status: string;
  startDate: string | null;
  endDate: string | null;
  currency: string;
  budget: number | null;
}

interface Activity {
  id: string;
  title: string;
  type: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  city: string | null;
  location: string | null;
  address: string | null;
  cost: number | null;
  description: string | null;
}

interface Accommodation {
  id: string;
  name: string;
  type: string;
  address: string | null;
  checkIn: string;
  checkOut: string;
  confirmationNumber: string | null;
  cost: number | null;
}

interface Transport {
  id: string;
  type: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string | null;
  carrier: string | null;
  bookingRef: string | null;
  cost: number | null;
}

interface Expense {
  id: string;
  title: string;
  category: string;
  amount: number;
  currency: string;
  date: string;
}

interface Document {
  id: string;
  title: string;
  type: string;
  expiresAt: string | null;
  notes: string | null;
}

// ── Config ───────────────────────────────────────────────────

const ACT_CFG: Record<string, { label: string; Icon: React.ElementType; color: string; bg: string; dot: string }> = {
  ACTIVITY:      { label: "Atividade",  Icon: Zap,          color: "text-blue-700",   bg: "bg-blue-50",   dot: "#3b82f6" },
  MEAL:          { label: "Refeição",   Icon: Utensils,     color: "text-orange-700", bg: "bg-orange-50", dot: "#f97316" },
  TRANSPORT:     { label: "Transporte", Icon: Bus,          color: "text-purple-700", bg: "bg-purple-50", dot: "#a855f7" },
  ACCOMMODATION: { label: "Hospedagem", Icon: Building2,    color: "text-green-700",  bg: "bg-green-50",  dot: "#22c55e" },
  EVENT:         { label: "Evento",     Icon: CalendarDays, color: "text-pink-700",   bg: "bg-pink-50",   dot: "#ec4899" },
  OTHER:         { label: "Outro",      Icon: FileText,     color: "text-gray-600",   bg: "bg-gray-50",   dot: "#9ca3af" },
};

const TRANSPORT_EMOJI: Record<string, string> = {
  FLIGHT: "✈️", BUS: "🚌", TRAIN: "🚂", CAR: "🚗", BOAT: "⛴️", OTHER: "🚀",
};

const ACCOM_EMOJI: Record<string, string> = {
  HOTEL: "🏨", HOSTEL: "🛏️", AIRBNB: "🏠", RESORT: "🌴", POUSADA: "🏡", OTHER: "📍",
};

const ACCOM_GRADIENT: Record<string, [string, string]> = {
  HOTEL:   ["#38bdf8", "#0ea5e9"],
  HOSTEL:  ["#2dd4bf", "#0d9488"],
  AIRBNB:  ["#fb7185", "#f43f5e"],
  RESORT:  ["#fbbf24", "#f59e0b"],
  POUSADA: ["#4ade80", "#16a34a"],
  OTHER:   ["#9ca3af", "#6b7280"],
};

const EXPENSE_COLOR: Record<string, string> = {
  ACCOMMODATION: "#38bdf8", TRANSPORT: "#a855f7", FOOD: "#f97316",
  ACTIVITY: "#3b82f6", SHOPPING: "#ec4899", HEALTH: "#22c55e", OTHER: "#9ca3af",
};
const EXPENSE_LABEL: Record<string, string> = {
  ACCOMMODATION: "Hospedagem", TRANSPORT: "Transporte", FOOD: "Alimentação",
  ACTIVITY: "Atividades", SHOPPING: "Compras", HEALTH: "Saúde", OTHER: "Outros",
};
const EXPENSE_EMOJI: Record<string, string> = {
  ACCOMMODATION: "🏨", TRANSPORT: "✈️", FOOD: "🍽️",
  ACTIVITY: "⚡", SHOPPING: "🛍️", HEALTH: "💊", OTHER: "📦",
};

const DOC_EMOJI: Record<string, string> = {
  PASSPORT: "🛂", VISA: "📋", INSURANCE: "🛡️", TICKET: "🎫", VOUCHER: "📄", OTHER: "📎",
};

// ── Helpers ──────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso.slice(0, 10) + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function fmtDateLong(iso: string) {
  return new Date(iso.slice(0, 10) + "T12:00:00").toLocaleDateString("pt-BR", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  });
}

function fmtMoney(v: number, currency = "BRL") {
  const sym = currency === "USD" ? "US$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "R$";
  return `${sym} ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
}

function tripDays(start: string | null, end: string | null): number {
  if (!start || !end) return 0;
  return Math.max(1, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000) + 1);
}

function nightsCount(cin: string, cout: string) {
  return Math.max(0, Math.round((new Date(cout).getTime() - new Date(cin).getTime()) / 86400000));
}

function getPeriodLabel(time: string | null): string {
  if (!time) return "";
  const h = parseInt(time.split(":")[0]);
  if (h >= 6 && h < 12) return "Manhã";
  if (h >= 12 && h < 18) return "Tarde";
  return "Noite";
}

function getPeriodIcon(time: string | null) {
  if (!time) return Clock;
  const h = parseInt(time.split(":")[0]);
  if (h >= 6 && h < 12) return Sunrise;
  if (h >= 12 && h < 18) return Sun;
  return Moon;
}

// Dates that have any event (activity, check-in, checkout, departure)
function collectDates(
  activities: Activity[],
  accommodations: Accommodation[],
  transports: Transport[],
): string[] {
  const set = new Set<string>();
  activities.forEach((a) => set.add(a.date.slice(0, 10)));
  accommodations.forEach((a) => {
    set.add(a.checkIn.slice(0, 10));
    set.add(a.checkOut.slice(0, 10));
  });
  transports.forEach((t) => set.add(t.departureTime.slice(0, 10)));
  return [...set].sort();
}

// ── Section components ───────────────────────────────────────

function SectionTitle({ icon: Icon, label, color }: { icon: React.ElementType; label: string; color: string }) {
  return (
    <div className={cn("flex items-center gap-2 mb-3 print:mb-2")}>
      <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center shrink-0", color)}>
        <Icon className="h-3.5 w-3.5 text-white" />
      </div>
      <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">{label}</h4>
    </div>
  );
}

// ── Print styles injected in-page ────────────────────────────

const PRINT_STYLE = `
@media print {
  @page { margin: 16mm 14mm; size: A4; }
  html, body { background: white !important; }
  body { font-size: 11px !important; }
  /* Isola o resumo: esconde TUDO (menu lateral, banners, etc.) e mostra só a área imprimível */
  body * { visibility: hidden !important; }
  .print-page, .print-page * { visibility: visible !important; }
  .print-page { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; margin: 0 !important; padding: 0 !important; background: white !important; }
  .no-print { display: none !important; }
  .shadow-sm, .shadow-lg, .shadow-md { box-shadow: none !important; }
  .rounded-3xl, .rounded-2xl, .rounded-xl { border-radius: 8px !important; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
`;

// ── Page ─────────────────────────────────────────────────────

export default function SummaryPage() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip]             = useState<Trip | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [transports, setTransports] = useState<Transport[]>([]);
  const [expenses, setExpenses]     = useState<Expense[]>([]);
  const [documents, setDocuments]   = useState<Document[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/trips/${id}`).then((r) => r.ok ? r.json() : null),
      fetch(`/api/trips/${id}/activities`).then((r) => r.ok ? r.json() : []),
      fetch(`/api/trips/${id}/accommodations`).then((r) => r.ok ? r.json() : []),
      fetch(`/api/trips/${id}/transports`).then((r) => r.ok ? r.json() : []),
      fetch(`/api/trips/${id}/expenses`).then((r) => r.ok ? r.json() : []),
      fetch(`/api/trips/${id}/documents`).then((r) => r.ok ? r.json() : []),
    ]).then(([t, a, ac, tr, ex, d]) => {
      setTrip(t);
      setActivities(a);
      setAccommodations(ac);
      setTransports(tr);
      setExpenses(ex);
      setDocuments(d);
      setLoading(false);
    });
  }, [id]);

  // Timeline dates
  const dates = useMemo(
    () => collectDates(activities, accommodations, transports),
    [activities, accommodations, transports]
  );

  // Expense totals per category
  const expByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      map[e.category] = (map[e.category] ?? 0) + e.amount;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const days          = tripDays(trip?.startDate ?? null, trip?.endDate ?? null);
  const destinations  = trip?.destination.split(" → ").map((d) => d.trim()).filter(Boolean) ?? [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!trip) return <p className="text-gray-500 py-10 text-center">Viagem não encontrada.</p>;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PRINT_STYLE }} />

      <div className="print-page space-y-6 pb-16 max-w-4xl mx-auto">

        {/* ── Print button ── */}
        <div className="flex items-center justify-between no-print">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Resumo da Viagem</h2>
            <p className="text-sm text-gray-400 mt-0.5">Todas as informações em um só lugar</p>
          </div>
          <Button
            onClick={() => window.print()}
            className="gap-2"
            style={{ background: "linear-gradient(135deg, #1a56cc, #6d28d9)" }}
          >
            <Printer className="h-4 w-4" />
            Imprimir / Salvar PDF
          </Button>
        </div>

        {/* ── Hero card ── */}
        <div
          className="relative rounded-3xl overflow-hidden text-white p-8"
          style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #4c1d95 100%)" }}
        >
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }} />
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
              <div>
                <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Roteiro de Viagem</p>
                <h1 className="text-3xl font-black tracking-tight leading-tight">{trip.title}</h1>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {destinations.map((dest, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-sm font-medium text-white/80">
                      {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-white/40" />}
                      <MapPin className="h-3.5 w-3.5 text-white/60" />
                      {dest}
                    </span>
                  ))}
                </div>
              </div>
              {/* Dates block */}
              {(trip.startDate || trip.endDate) && (
                <div className="text-right shrink-0">
                  {trip.startDate && (
                    <p className="text-white/80 text-sm font-semibold">{fmtDate(trip.startDate)}</p>
                  )}
                  {trip.endDate && trip.startDate && (
                    <p className="text-white/40 text-xs mt-0.5 flex items-center justify-end gap-1">
                      <ChevronRight className="h-3 w-3" /> {fmtDate(trip.endDate)}
                    </p>
                  )}
                  {days > 0 && (
                    <p className="text-white font-black text-2xl mt-1">{days}<span className="text-sm font-medium text-white/60 ml-1">{days === 1 ? "dia" : "dias"}</span></p>
                  )}
                </div>
              )}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Atividades", value: activities.length, icon: Zap, color: "#3b82f6" },
                { label: "Hospedagens", value: accommodations.length, icon: BedDouble, color: "#2dd4bf" },
                { label: "Transportes", value: transports.length, icon: Plane, color: "#a855f7" },
                { label: "Documentos", value: documents.length, icon: FileText, color: "#fb7185" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-white/10 border border-white/15 rounded-2xl px-4 py-3 text-center">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center mx-auto mb-1" style={{ backgroundColor: color + "33" }}>
                    <Icon className="h-3.5 w-3.5" style={{ color }} />
                  </div>
                  <p className="text-2xl font-black leading-none">{value}</p>
                  <p className="text-white/50 text-[10px] font-semibold uppercase tracking-wide mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Timeline ── */}
        {dates.length > 0 && (
          <section>
            <h3 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary-500" />
              Cronograma detalhado
            </h3>

            <div className="space-y-6">
              {dates.map((dateStr, dayIdx) => {
                const dayActivities = activities
                  .filter((a) => a.date.slice(0, 10) === dateStr)
                  .sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? ""));
                const checkIns  = accommodations.filter((a) => a.checkIn.slice(0, 10) === dateStr);
                const checkOuts = accommodations.filter((a) => a.checkOut.slice(0, 10) === dateStr && a.checkIn.slice(0, 10) !== dateStr);
                const departures = transports.filter((t) => t.departureTime.slice(0, 10) === dateStr);

                const hasContent = dayActivities.length + checkIns.length + checkOuts.length + departures.length > 0;
                if (!hasContent) return null;

                return (
                  <div key={dateStr} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Day header */}
                    <div
                      className="px-5 py-4 flex items-center gap-4"
                      style={{ background: "linear-gradient(90deg, #f0f9ff, #fdf4ff)" }}
                    >
                      <div
                        className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-white shrink-0 shadow-sm"
                        style={{ background: "linear-gradient(135deg, #1e3a5f, #6d28d9)" }}
                      >
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-70">DIA</span>
                        <span className="text-2xl font-black leading-none">{dayIdx + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-gray-900 capitalize text-base leading-tight">
                          {fmtDateLong(dateStr)}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap mt-1">
                          {dayActivities.length > 0 && (
                            <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full font-semibold">
                              {dayActivities.length} atividade{dayActivities.length !== 1 ? "s" : ""}
                            </span>
                          )}
                          {checkIns.length > 0 && (
                            <span className="text-[10px] bg-teal-50 text-teal-600 border border-teal-100 px-2 py-0.5 rounded-full font-semibold">
                              ✓ check-in
                            </span>
                          )}
                          {checkOuts.length > 0 && (
                            <span className="text-[10px] bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded-full font-semibold">
                              → check-out
                            </span>
                          )}
                          {departures.length > 0 && (
                            <span className="text-[10px] bg-purple-50 text-purple-600 border border-purple-100 px-2 py-0.5 rounded-full font-semibold">
                              {departures.length} transporte{departures.length !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 space-y-4">

                      {/* Check-outs */}
                      {checkOuts.length > 0 && (
                        <div>
                          <SectionTitle icon={BedDouble} label="Check-out" color="bg-rose-500" />
                          <div className="space-y-2">
                            {checkOuts.map((a) => {
                              const [c1, c2] = ACCOM_GRADIENT[a.type] ?? ["#9ca3af", "#6b7280"];
                              return (
                                <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                                  <span className="text-xl shrink-0">{ACCOM_EMOJI[a.type]}</span>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm text-gray-800 truncate">{a.name}</p>
                                    {a.address && <p className="text-xs text-gray-400 truncate">{a.address}</p>}
                                  </div>
                                  <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white shrink-0" style={{ background: `linear-gradient(90deg, ${c1}, ${c2})` }}>
                                    saída
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Check-ins */}
                      {checkIns.length > 0 && (
                        <div>
                          <SectionTitle icon={BedDouble} label="Check-in" color="bg-teal-500" />
                          <div className="space-y-2">
                            {checkIns.map((a) => {
                              const [c1] = ACCOM_GRADIENT[a.type] ?? ["#9ca3af", "#6b7280"];
                              const nights   = nightsCount(a.checkIn, a.checkOut);
                              return (
                                <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: c1 + "40", background: c1 + "08" }}>
                                  <span className="text-xl shrink-0">{ACCOM_EMOJI[a.type]}</span>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm text-gray-800 truncate">{a.name}</p>
                                    {a.address && <p className="text-xs text-gray-400 truncate">{a.address}</p>}
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      {fmtDate(a.checkIn)} → {fmtDate(a.checkOut)} · {nights} noite{nights !== 1 ? "s" : ""}
                                      {a.confirmationNumber && <span className="ml-2 font-mono text-gray-400">#{a.confirmationNumber}</span>}
                                    </p>
                                  </div>
                                  {a.cost != null && (
                                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                                      R$ {a.cost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Transports */}
                      {departures.length > 0 && (
                        <div>
                          <SectionTitle icon={Plane} label="Transportes" color="bg-purple-500" />
                          <div className="space-y-2">
                            {departures.map((t) => (
                              <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl bg-purple-50/50 border border-purple-100">
                                <span className="text-xl shrink-0">{TRANSPORT_EMOJI[t.type] ?? "🚀"}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 text-sm font-bold text-gray-800 flex-wrap">
                                    <span>{t.from}</span>
                                    <ChevronRight className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                                    <span>{t.to}</span>
                                  </div>
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    {t.departureTime.slice(11, 16) !== "00:00" && (
                                      <span className="mr-2">⏰ {t.departureTime.slice(11, 16)}</span>
                                    )}
                                    {t.carrier && <span className="mr-2">{t.carrier}</span>}
                                    {t.bookingRef && <span className="font-mono">#{t.bookingRef}</span>}
                                  </p>
                                </div>
                                {t.cost != null && (
                                  <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full shrink-0">
                                    R$ {t.cost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Activities */}
                      {dayActivities.length > 0 && (
                        <div>
                          <SectionTitle icon={Zap} label="Atividades" color="bg-blue-500" />
                          <div className="space-y-2">
                            {dayActivities.map((act) => {
                              const cfg = ACT_CFG[act.type] ?? ACT_CFG.OTHER;
                              const { Icon } = cfg;
                              const PeriodIcon = getPeriodIcon(act.startTime);
                              return (
                                <div key={act.id} className="flex gap-3">
                                  {/* Time column */}
                                  <div className="flex flex-col items-center w-12 shrink-0 pt-3">
                                    <span className="text-[10px] font-bold text-gray-400 leading-none">
                                      {act.startTime ?? "–"}
                                    </span>
                                    <div className="w-px flex-1 bg-gray-100 mt-1" />
                                  </div>
                                  {/* Card */}
                                  <div className={cn("flex-1 rounded-xl border p-3 mb-1", cfg.bg, "border-gray-100")}>
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full border", cfg.bg, cfg.color, "border-current/20")}>
                                          <Icon className="h-2.5 w-2.5" />
                                          {cfg.label}
                                        </span>
                                        {act.startTime && (
                                          <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                                            <PeriodIcon className="h-2.5 w-2.5" />
                                            {getPeriodLabel(act.startTime)}
                                          </span>
                                        )}
                                        {act.city && (
                                          <span className="text-[10px] text-primary-600 font-medium flex items-center gap-0.5">
                                            <MapPin className="h-2.5 w-2.5" />
                                            {act.city.split(",")[0]}
                                          </span>
                                        )}
                                      </div>
                                      {act.cost != null && (
                                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-full shrink-0">
                                          R$ {act.cost.toFixed(2)}
                                        </span>
                                      )}
                                    </div>
                                    <p className="font-bold text-sm text-gray-800 leading-snug">{act.title}</p>
                                    {act.location && (
                                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                        <MapPin className="h-3 w-3 text-gray-400 shrink-0" />
                                        {act.location}
                                      </p>
                                    )}
                                    {act.description && (
                                      <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">{act.description}</p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Two-column: Expenses + Documents ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Expenses */}
          {expenses.length > 0 && (
            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100" style={{ background: "linear-gradient(90deg, #f0fdf4, #ecfdf5)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
                    <Wallet className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-sm">Orçamento</h3>
                    <p className="text-xs text-gray-400">{fmtMoney(totalExpenses, trip.currency)} gastos</p>
                  </div>
                </div>
                {trip.budget && trip.budget > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Usado</span>
                      <span className="font-bold text-gray-700">
                        {Math.round((totalExpenses / trip.budget) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${Math.min(100, (totalExpenses / trip.budget) * 100)}%`,
                          background: totalExpenses > trip.budget
                            ? "linear-gradient(90deg, #f97316, #ef4444)"
                            : "linear-gradient(90deg, #22c55e, #10b981)",
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      Orçamento: {fmtMoney(trip.budget, trip.currency)}
                      {totalExpenses > trip.budget && (
                        <span className="text-red-500 ml-1 flex items-center gap-0.5 inline-flex">
                          <AlertTriangle className="h-2.5 w-2.5" />
                          Excedido
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
              <div className="p-5 space-y-2">
                {expByCategory.map(([cat, total]) => {
                  const pct = totalExpenses > 0 ? (total / totalExpenses) * 100 : 0;
                  return (
                    <div key={cat} className="flex items-center gap-3">
                      <span className="text-base shrink-0">{EXPENSE_EMOJI[cat] ?? "📦"}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-xs font-semibold text-gray-700">{EXPENSE_LABEL[cat] ?? cat}</span>
                          <span className="text-xs font-bold text-gray-800">{fmtMoney(total, trip.currency)}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full"
                            style={{ width: `${pct}%`, backgroundColor: EXPENSE_COLOR[cat] ?? "#9ca3af" }}
                          />
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 shrink-0 w-8 text-right">{Math.round(pct)}%</span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Documents */}
          {documents.length > 0 && (
            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100" style={{ background: "linear-gradient(90deg, #eff6ff, #f5f3ff)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-sm">Documentos</h3>
                    <p className="text-xs text-gray-400">{documents.length} documento{documents.length !== 1 ? "s" : ""}</p>
                  </div>
                </div>
              </div>
              <div className="p-5 space-y-2">
                {documents.map((doc) => {
                  const isExpiring = doc.expiresAt
                    ? (new Date(doc.expiresAt).getTime() - Date.now()) / 86400000 < 180
                    : false;
                  const isExpired = doc.expiresAt
                    ? new Date(doc.expiresAt).getTime() < Date.now()
                    : false;
                  return (
                    <div key={doc.id} className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border",
                      isExpired ? "bg-red-50 border-red-100" :
                      isExpiring ? "bg-amber-50 border-amber-100" :
                      "bg-gray-50 border-gray-100"
                    )}>
                      <span className="text-xl shrink-0">{DOC_EMOJI[doc.type] ?? "📎"}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-800 truncate">{doc.title}</p>
                        {doc.expiresAt && (
                          <p className={cn(
                            "text-xs mt-0.5 flex items-center gap-1",
                            isExpired ? "text-red-600" : isExpiring ? "text-amber-600" : "text-gray-400"
                          )}>
                            {isExpired ? <AlertTriangle className="h-3 w-3 shrink-0" /> : <CheckCircle2 className="h-3 w-3 shrink-0" />}
                            Validade: {fmtDate(doc.expiresAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* ── Packing reminder ── */}
        {trip && (
          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-violet-500 flex items-center justify-center">
                <Package className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-black text-gray-900 text-sm">Resumo do roteiro</h3>
                <p className="text-xs text-gray-400">{destinations.join(" → ")}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Globe, label: "Destinos", value: destinations.length, color: "#3b82f6" },
                { icon: Calendar, label: "Dias", value: days || "–", color: "#8b5cf6" },
                { icon: TrendingUp, label: "Custo total", value: totalExpenses > 0 ? fmtMoney(totalExpenses, trip.currency) : "–", color: "#22c55e" },
                { icon: Package, label: "Atividades", value: activities.length, color: "#f97316" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="rounded-2xl border border-gray-100 bg-gray-50 p-3 text-center">
                  <Icon className="h-5 w-5 mx-auto mb-1" style={{ color }} />
                  <p className="text-base font-black text-gray-800 leading-none">{value}</p>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Print footer */}
        <div className="hidden print:block text-center text-xs text-gray-400 pt-4 border-t border-gray-100">
          Gerado pelo RoteiroApp ·{new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
        </div>

      </div>
    </>
  );
}
