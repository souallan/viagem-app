import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatCurrency, tripStatusLabel, tripStatusColor } from "@/lib/utils";
import {
  Calendar, MapPin, DollarSign, FileText, Luggage,
  Activity, Map, BarChart2, ExternalLink, Globe,
  Hotel, Star, Compass, Newspaper, Share2,
  Plane, TrendingUp, Package,
} from "lucide-react";
import WeatherWidget from "@/components/trips/weather-widget";
import ImmigrationAlerts from "@/components/trips/immigration-alerts";
import ShareRouteButton from "@/components/trips/share-route-button";
import DestinationClocks from "@/components/trips/destination-clocks";
import TripPublicShare from "@/components/trips/trip-public-share";
import TripCollaboration from "@/components/trips/trip-collaboration";

export default async function TripOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  const trip = await prisma.trip.findFirst({
    where: { id, userId: session!.user!.id! },
    include: {
      _count: { select: { activities: true, accommodations: true, transports: true, expenses: true, documents: true } },
      expenses: { select: { amount: true } },
      packingList: {
        include: {
          _count: { select: { items: true } },
          items: { where: { isPacked: true }, select: { id: true } },
        },
      },
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

      <DestinationClocks destination={trip.destination} />
      <WeatherWidget destination={trip.destination} />
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
                <r.icon className="h-4.5 w-4.5" />
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

      {/* ── Edit link ── */}
      <div className="flex gap-3 pt-1 border-t border-gray-100">
        <Link href={`/trips/${id}/edit`} className="text-sm text-primary-600 hover:underline font-medium">
          Editar informações da viagem
        </Link>
      </div>
    </div>
  );
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
