import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatCurrency, tripStatusLabel } from "@/lib/utils";
import {
  Calendar, MapPin, DollarSign, FileText,
  Activity, Map, BarChart2, ExternalLink, Globe,
  Hotel, Star, Compass, Newspaper,
  Plane, TrendingUp, Package, Pencil, Clock, ArrowRight,
  ListChecks, CheckCircle2, Circle, Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ImmigrationAlerts from "@/components/trips/immigration-alerts";
import ShareRouteButton from "@/components/trips/share-route-button";
import TripPublicShare from "@/components/trips/trip-public-share";
import DestinationAlertsToggle from "@/components/trips/destination-alerts-toggle";
import TripCollaboration from "@/components/trips/trip-collaboration";

export default async function TripOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  const uid = session!.user!.id!;
  const trip = await prisma.trip.findFirst({
    where: { id, OR: [{ userId: uid }, { members: { some: { userId: uid } } }] },
    include: {
      _count: { select: { activities: true, accommodations: true, transports: true, expenses: true, documents: true } },
      expenses: { select: { amount: true } },
      packingList: {
        include: {
          _count: { select: { items: true } },
          items: { where: { isPacked: true }, select: { id: true } },
        },
      },
      activities: { select: { id: true, title: true, date: true, startTime: true, location: true, city: true, bookingRef: true } },
      accommodations: { select: { id: true, name: true, checkIn: true, checkOut: true, confirmationNumber: true, address: true } },
      transports: { select: { id: true, type: true, from: true, to: true, departureTime: true, carrier: true, bookingRef: true, seat: true } },
    },
  });

  if (!trip) notFound();

  const totalSpent = trip.expenses.reduce((sum, e) => sum + e.amount, 0);
  const packedCount = trip.packingList?.items.length ?? 0;
  const totalItems = trip.packingList?._count.items ?? 0;
  const budgetPct = trip.budget && trip.budget > 0 ? Math.min(100, Math.round((totalSpent / trip.budget) * 100)) : null;
  const dest = encodeURIComponent(trip.destination);

  // Calculate trip duration
  let durationDays: number | null = null;
  if (trip.startDate && trip.endDate) {
    durationDays = Math.max(1, Math.ceil((trip.endDate.getTime() - trip.startDate.getTime()) / 86400000));
  }

  // ── Agora & próximo evento (Théo/UX): reserva/voo a 0 toque, offline via cache do SW ──
  const now = new Date();
  type Ev = { at: Date; kind: "checkin" | "checkout" | "transport" | "activity"; title: string; detail?: string; href: string };
  const base = `/trips/${id}`;
  const events: Ev[] = [];
  for (const a of trip.accommodations) {
    events.push({ at: a.checkIn, kind: "checkin", title: `Check-in · ${a.name}`, detail: a.confirmationNumber ? `Confirmação ${a.confirmationNumber}` : a.address ?? undefined, href: `${base}/accommodation` });
    events.push({ at: a.checkOut, kind: "checkout", title: `Check-out · ${a.name}`, detail: a.address ?? undefined, href: `${base}/accommodation` });
  }
  for (const tr of trip.transports) {
    const det = [transportLabel(tr.type), tr.bookingRef ? `Reserva ${tr.bookingRef}` : null, tr.seat ? `Assento ${tr.seat}` : null].filter(Boolean).join(" · ");
    events.push({ at: tr.departureTime, kind: "transport", title: `${tr.from} → ${tr.to}`, detail: det || undefined, href: `${base}/transport` });
  }
  for (const ac of trip.activities) {
    const det = [ac.location || ac.city, ac.bookingRef ? `Reserva ${ac.bookingRef}` : null].filter(Boolean).join(" · ");
    events.push({ at: combineDateTime(ac.date, ac.startTime), kind: "activity", title: ac.title, detail: det || undefined, href: `${base}/itinerary` });
  }
  const nextEvent = events
    .filter((e) => e.at.getTime() >= now.getTime())
    .sort((a, b) => a.at.getTime() - b.at.getTime())[0] ?? null;
  const ongoingStay = trip.accommodations.find((a) => a.checkIn.getTime() <= now.getTime() && now.getTime() <= a.checkOut.getTime()) ?? null;
  const kindIcon = { checkin: Hotel, checkout: Hotel, transport: Plane, activity: Activity } as const;
  const NextIcon = nextEvent ? kindIcon[nextEvent.kind] : null;

  const travelResources = [
    { name: "TripAdvisor", icon: Star, color: "text-green-600 bg-green-50 border-green-100", desc: "Avaliações e atrações", url: `https://www.tripadvisor.com/Search?q=${dest}` },
    { name: "Booking.com", icon: Hotel, color: "text-blue-600 bg-blue-50 border-blue-100", desc: "Hotéis e acomodações", url: `https://www.booking.com/search.html?ss=${dest}` },
    { name: "GetYourGuide", icon: Compass, color: "text-orange-600 bg-orange-50 border-orange-100", desc: "Tours e experiências", url: `https://www.getyourguide.com/s/?q=${dest}` },
    { name: "Google Maps", icon: MapPin, color: "text-red-600 bg-red-50 border-red-100", desc: "Mapa e navegação", url: `https://maps.google.com/?q=${dest}` },
    { name: "Lonely Planet", icon: Newspaper, color: "text-purple-600 bg-purple-50 border-purple-100", desc: "Guia de viagem", url: `https://www.lonelyplanet.com/search?q=${dest}` },
    { name: "Airbnb", icon: Globe, color: "text-rose-600 bg-rose-50 border-rose-100", desc: "Aluguéis locais", url: `https://www.airbnb.com/s/${dest}/homes` },
  ];

  return (
    <div className="space-y-6">

      {/* ── Hero card: Status + Dates + Actions ── */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-primary-200">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary-200">Status da viagem</span>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`text-sm font-bold px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white`}>
                {tripStatusLabel(trip.status)}
              </span>
              {durationDays && (
                <span className="flex items-center gap-1.5 text-sm font-semibold text-primary-100">
                  <Calendar className="h-4 w-4" />
                  {durationDays} {durationDays === 1 ? "dia" : "dias"}
                </span>
              )}
            </div>
            {(trip.startDate || trip.endDate) && (
              <div className="flex items-center gap-2 text-primary-100 text-sm">
                <Calendar className="h-4 w-4 shrink-0" />
                {trip.startDate ? formatDate(trip.startDate.toISOString()) : "—"}
                {trip.endDate ? ` → ${formatDate(trip.endDate.toISOString())}` : ""}
              </div>
            )}
            <div className="flex items-center gap-1.5 text-primary-100 text-sm">
              <MapPin className="h-4 w-4 shrink-0" />
              {trip.destination}
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Link
              href={`/trips/${id}/edit`}
              className="inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl bg-white text-primary-700 hover:bg-primary-50 shadow-sm transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" /> Editar viagem
            </Link>
            <Link href={`/trips/${id}/map`} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-white transition-colors">
              <Map className="h-3.5 w-3.5" /> Ver no mapa
            </Link>
            <Link href={`/trips/${id}/compare`} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-white transition-colors">
              <BarChart2 className="h-3.5 w-3.5" /> Comparar preços
            </Link>
            <ShareRouteButton tripId={id} />
          </div>
        </div>

        {trip.description && (
          <p className="mt-4 text-primary-100 text-sm leading-relaxed border-t border-white/15 pt-4">{trip.description}</p>
        )}
      </div>

      {/* ── Agora & próximo evento ── */}
      {(ongoingStay || nextEvent) && (
        <div className="rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-primary-100 flex items-center justify-center">
              <Clock className="h-4 w-4 text-primary-600" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Agora &amp; próximo</h3>
          </div>

          {ongoingStay && (
            <div className="flex items-start gap-3 mb-2 px-3 py-2.5 rounded-xl bg-white border border-gray-100">
              <Hotel className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Agora</p>
                <p className="text-sm font-semibold text-gray-900 truncate">Hospedado em {ongoingStay.name}</p>
                {ongoingStay.confirmationNumber && (
                  <p className="text-xs text-gray-500 truncate">Confirmação {ongoingStay.confirmationNumber}</p>
                )}
              </div>
            </div>
          )}

          {nextEvent && NextIcon && (
            <Link
              href={nextEvent.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white border border-gray-100 hover:border-primary-200 hover:shadow-sm transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                <NextIcon className="h-4 w-4 text-primary-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary-600">
                  {nextEvent.kind === "activity" ? "Próxima atividade" : "Próximo"} · {whenLabel(nextEvent.at, now)}
                </p>
                <p className="text-sm font-semibold text-gray-900 truncate">{nextEvent.title}</p>
                {nextEvent.detail && <p className="text-xs text-gray-500 truncate">{nextEvent.detail}</p>}
              </div>
              <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-primary-500 shrink-0" />
            </Link>
          )}
        </div>
      )}

      {/* ── Guia de prontidão (Théo/UX): o "fio condutor" — o que falta para a viagem ficar pronta ── */}
      {(() => {
        const checks = [
          { ok: trip._count.transports > 0,     label: "Transporte / voo", href: `/trips/${id}/transport` },
          { ok: trip._count.accommodations > 0, label: "Hospedagem",        href: `/trips/${id}/accommodation` },
          { ok: trip._count.activities > 0,     label: "Roteiro de atividades", href: `/trips/${id}/itinerary` },
          { ok: trip._count.documents > 0,      label: "Documentos",        href: `/trips/${id}/documents` },
          { ok: totalItems > 0,                 label: "Lista de malas",     href: `/trips/${id}/packing` },
        ];
        const ready = checks.filter((c) => c.ok).length;
        if (ready === checks.length) return null; // tudo pronto → não polui a tela
        return (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                  <ListChecks className="h-4 w-4 text-amber-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">Guia de prontidão</h3>
              </div>
              <span className="text-xs font-bold text-amber-700">{ready}/{checks.length} prontos</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {checks.map((c) => c.ok ? (
                <div key={c.label} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/70 border border-gray-100 text-sm text-gray-400">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  <span className="line-through">{c.label}</span>
                </div>
              ) : (
                <Link key={c.label} href={c.href} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-amber-200 text-sm font-medium text-gray-800 hover:border-amber-300 hover:shadow-sm transition-all group min-h-[44px]">
                  <Circle className="h-4 w-4 text-amber-400 shrink-0" />
                  <span className="flex-1">{c.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </Link>
              ))}
            </div>
            {trip._count.activities === 0 && (
              <Link href={`/trips/${id}/itinerary`} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700">
                <Sparkles className="h-3.5 w-3.5" /> Gerar um roteiro com IA em segundos
              </Link>
            )}
          </div>
        );
      })()}

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <BigStatCard
          icon={Activity}
          label="Atividades"
          value={trip._count.activities}
          unit={trip._count.activities === 1 ? "atividade" : "atividades"}
          href={`/trips/${id}/itinerary`}
          gradient="from-blue-500 to-blue-600"
          bg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <BigStatCard
          icon={Hotel}
          label="Hospedagens"
          value={trip._count.accommodations}
          unit={trip._count.accommodations === 1 ? "hospedagem" : "hospedagens"}
          href={`/trips/${id}/accommodation`}
          gradient="from-purple-500 to-purple-600"
          bg="bg-purple-50"
          iconColor="text-purple-600"
        />
        <BigStatCard
          icon={Plane}
          label="Transportes"
          value={trip._count.transports}
          unit={trip._count.transports === 1 ? "trecho" : "trechos"}
          href={`/trips/${id}/transport`}
          gradient="from-emerald-500 to-emerald-600"
          bg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <BigStatCard
          icon={FileText}
          label="Documentos"
          value={trip._count.documents}
          unit={trip._count.documents === 1 ? "documento" : "documentos"}
          href={`/trips/${id}/documents`}
          gradient="from-orange-500 to-orange-600"
          bg="bg-orange-50"
          iconColor="text-orange-600"
        />
        <BigStatCard
          icon={Package}
          label="Malas"
          value={`${packedCount}/${totalItems}`}
          unit="itens prontos"
          href={`/trips/${id}/packing`}
          gradient="from-rose-500 to-rose-600"
          bg="bg-rose-50"
          iconColor="text-rose-600"
        />
        <BigStatCard
          icon={DollarSign}
          label="Gastos"
          value={formatCurrency(totalSpent, trip.currency)}
          unit={trip.budget ? `de ${formatCurrency(trip.budget, trip.currency)}` : "registrados"}
          href={`/trips/${id}/budget`}
          gradient="from-amber-500 to-amber-600"
          bg="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      {/* ── Budget progress bar ── */}
      {budgetPct !== null && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Orçamento usado</p>
                <p className="text-xs text-gray-400">
                  {formatCurrency(totalSpent, trip.currency)} de {formatCurrency(trip.budget!, trip.currency)}
                </p>
              </div>
            </div>
            <span className={`text-lg font-black ${budgetPct >= 90 ? "text-red-600" : budgetPct >= 70 ? "text-amber-600" : "text-green-600"}`}>
              {budgetPct}%
            </span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${budgetPct >= 90 ? "bg-red-500" : budgetPct >= 70 ? "bg-amber-500" : "bg-green-500"}`}
              style={{ width: `${budgetPct}%` }}
            />
          </div>
        </div>
      )}

      {trip.userId === uid && (
        <DestinationAlertsToggle tripId={id} initialEnabled={trip.alertsEnabled} />
      )}
      <ImmigrationAlerts destination={trip.destination} />
      <TripPublicShare tripId={id} initialToken={trip.shareToken ?? null} />
      <TripCollaboration tripId={id} />

      {/* ── Travel resources ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center">
            <Globe className="h-4 w-4 text-sky-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Recursos de pesquisa</h3>
            <p className="text-xs text-gray-400">Links úteis para {trip.destination.split(" → ")[0]}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {travelResources.map((r) => (
            <a
              key={r.name}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-3 rounded-xl border bg-white hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${r.color}`}>
                <r.icon className="h-[18px] w-[18px]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate">{r.name}</p>
                <p className="text-xs text-gray-400 truncate">{r.desc}</p>
              </div>
              <ExternalLink className="h-3 w-3 text-gray-300 group-hover:text-gray-500 ml-auto shrink-0" />
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}

function combineDateTime(date: Date, time: string | null): Date {
  if (!time) return date;
  const [h, m] = time.split(":").map(Number);
  const d = new Date(date);
  if (!Number.isNaN(h)) d.setHours(h, Number.isNaN(m) ? 0 : m, 0, 0);
  return d;
}

function transportLabel(type: string): string {
  return (({ FLIGHT: "Voo", BUS: "Ônibus", TRAIN: "Trem", CAR: "Carro", BOAT: "Barco", OTHER: "Transporte" }) as Record<string, string>)[type] ?? "Transporte";
}

function whenLabel(at: Date, now: Date): string {
  const time = format(at, "HH:mm");
  const hasTime = time !== "00:00";
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  if (at.toDateString() === now.toDateString()) return hasTime ? `Hoje · ${time}` : "Hoje";
  if (at.toDateString() === tomorrow.toDateString()) return hasTime ? `Amanhã · ${time}` : "Amanhã";
  return format(at, hasTime ? "d MMM · HH:mm" : "d MMM", { locale: ptBR });
}

function BigStatCard({
  icon: Icon, label, value, unit, href, gradient, bg, iconColor,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  unit: string;
  href: string;
  gradient: string;
  bg: string;
  iconColor: string;
}) {
  return (
    <Link href={href}>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden group">
        <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />
        <div className="p-4 sm:p-5">
          <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">{value}</p>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{unit}</p>
        </div>
      </div>
    </Link>
  );
}
