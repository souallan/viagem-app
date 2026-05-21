import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, formatCurrency, tripStatusLabel, tripStatusColor } from "@/lib/utils";
import {
  Calendar, MapPin, DollarSign, FileText, Luggage,
  Activity, Map, BarChart2, ExternalLink, Globe,
  Hotel, Star, Compass, Newspaper,
} from "lucide-react";
import WeatherWidget from "@/components/trips/weather-widget";
import ImmigrationAlerts from "@/components/trips/immigration-alerts";

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
  const dest = encodeURIComponent(trip.destination);

  const travelResources = [
    { name: "TripAdvisor", icon: Star, color: "text-green-600 bg-green-50", desc: "Avaliações e atrações", url: `https://www.tripadvisor.com/Search?q=${dest}` },
    { name: "Booking.com", icon: Hotel, color: "text-blue-600 bg-blue-50", desc: "Hotéis e acomodações", url: `https://www.booking.com/search.html?ss=${dest}` },
    { name: "GetYourGuide", icon: Compass, color: "text-orange-600 bg-orange-50", desc: "Tours e experiências", url: `https://www.getyourguide.com/s/?q=${dest}` },
    { name: "Google Maps", icon: MapPin, color: "text-red-600 bg-red-50", desc: "Mapa e navegação", url: `https://maps.google.com/?q=${dest}` },
    { name: "Lonely Planet", icon: Newspaper, color: "text-purple-600 bg-purple-50", desc: "Guia de viagem", url: `https://www.lonelyplanet.com/search?q=${dest}` },
    { name: "Airbnb", icon: Globe, color: "text-rose-600 bg-rose-50", desc: "Aluguéis locais", url: `https://www.airbnb.com/s/${dest}/homes` },
  ];

  return (
    <div className="space-y-6">
      {/* Status + Datas */}
      <div className="flex flex-wrap gap-4 items-center">
        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${tripStatusColor(trip.status)}`}>
          {tripStatusLabel(trip.status)}
        </span>
        {(trip.startDate || trip.endDate) && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              {trip.startDate ? formatDate(trip.startDate.toISOString()) : "—"}
              {trip.endDate ? ` → ${formatDate(trip.endDate.toISOString())}` : ""}
            </span>
          </div>
        )}
        <div className="ml-auto flex gap-2">
          <Link href={`/trips/${id}/map`} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors">
            <Map className="h-3.5 w-3.5" /> Ver no mapa
          </Link>
          <Link href={`/trips/${id}/compare`} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors">
            <BarChart2 className="h-3.5 w-3.5" /> Comparar preços
          </Link>
        </div>
      </div>

      {trip.description && <p className="text-gray-600">{trip.description}</p>}

      <WeatherWidget destination={trip.destination} />

      <ImmigrationAlerts destination={trip.destination} />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard icon={Activity} label="Atividades" value={trip._count.activities} href={`/trips/${id}/itinerary`} color="text-sky-600 bg-sky-50" />
        <StatCard icon={MapPin} label="Hospedagens" value={trip._count.accommodations} href={`/trips/${id}/accommodation`} color="text-purple-600 bg-purple-50" />
        <StatCard icon={Calendar} label="Transportes" value={trip._count.transports} href={`/trips/${id}/transport`} color="text-emerald-600 bg-emerald-50" />
        <StatCard icon={DollarSign} label="Gastos" value={`${formatCurrency(totalSpent, trip.currency)}${trip.budget ? ` / ${formatCurrency(trip.budget, trip.currency)}` : ""}`} href={`/trips/${id}/budget`} color="text-amber-600 bg-amber-50" />
        <StatCard icon={FileText} label="Documentos" value={trip._count.documents} href={`/trips/${id}/documents`} color="text-orange-600 bg-orange-50" />
        <StatCard icon={Luggage} label="Malas" value={`${packedCount}/${totalItems} itens`} href={`/trips/${id}/packing`} color="text-rose-600 bg-rose-50" />
      </div>

      {/* Travel resources */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Globe className="h-4 w-4 text-sky-500" />
          Recursos para {trip.destination}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {travelResources.map((r) => (
            <a
              key={r.name}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-100 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${r.color}`}>
                <r.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">{r.name}</p>
                <p className="text-xs text-gray-400 truncate">{r.desc}</p>
              </div>
              <ExternalLink className="h-3 w-3 text-gray-300 group-hover:text-gray-500 ml-auto shrink-0" />
            </a>
          ))}
        </div>
      </div>

      {/* Edit link */}
      <div className="flex gap-3 pt-1">
        <Link href={`/trips/${id}/edit`} className="text-sm text-blue-600 hover:underline font-medium">
          Editar informações da viagem
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon, label, value, href, color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  href: string;
  color: string;
}) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer border-gray-100">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-sm font-semibold text-gray-900">{value}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
