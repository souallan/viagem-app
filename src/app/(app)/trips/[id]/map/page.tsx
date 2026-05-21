"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import type { MapPlace } from "@/components/trips/map-view";

const MapView = dynamic(() => import("@/components/trips/map-view"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
      Carregando mapa...
    </div>
  ),
});

interface Activity {
  id: string;
  title: string;
  type: string;
  date: string;
  location: string | null;
  address: string | null;
}

interface Accommodation {
  id: string;
  name: string;
  address: string | null;
}

interface Trip {
  id: string;
  title: string;
  destination: string;
}

const activityTypeIcon: Record<string, string> = {
  ACTIVITY: "🎯",
  MEAL: "🍽️",
  TRANSPORT: "🚌",
  ACCOMMODATION: "🏨",
  EVENT: "🎪",
  OTHER: "📌",
};

const legend = [
  { color: "bg-blue-500", label: "Destino" },
  { color: "bg-purple-500", label: "Hospedagem" },
  { color: "bg-emerald-500", label: "Atividade" },
  { color: "bg-amber-500", label: "Evento" },
];

function buildGoogleMapsUrl(destination: string, places: MapPlace[]): string {
  const waypoints = places
    .filter((p) => p.location)
    .slice(0, 9) // Google Maps allows up to 9 waypoints
    .map((p) => encodeURIComponent(p.location))
    .join("|");
  const dest = encodeURIComponent(destination);
  if (!waypoints) return `https://maps.google.com/?q=${dest}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}&waypoints=${waypoints}`;
}

export default function MapPage() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [t, a, h] = await Promise.all([
        fetch(`/api/trips/${id}`).then((r) => r.json()),
        fetch(`/api/trips/${id}/activities`).then((r) => r.json()),
        fetch(`/api/trips/${id}/accommodations`).then((r) => r.json()),
      ]);
      setTrip(t);
      setActivities(a);
      setAccommodations(h);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading || !trip) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="text-5xl mb-3">🗺️</div>
        <p>Carregando...</p>
      </div>
    );
  }

  // Assign day numbers based on date order
  const sortedDates = [...new Set(activities.map((a) => a.date.split("T")[0]))].sort();
  const dateToDay: Record<string, number> = {};
  sortedDates.forEach((d, i) => { dateToDay[d] = i + 1; });

  const places: MapPlace[] = [
    ...activities
      .filter((a) => a.location || a.address)
      .map((a) => ({
        label: a.title,
        location: a.location || a.address || "",
        category: (a.type === "EVENT" ? "event" : "activity") as MapPlace["category"],
        icon: activityTypeIcon[a.type] ?? "📌",
        day: dateToDay[a.date.split("T")[0]] ?? undefined,
      })),
    ...accommodations
      .filter((a) => a.address)
      .map((a) => ({
        label: a.name,
        location: a.address!,
        category: "accommodation" as const,
        icon: "🏨",
      })),
  ];

  const hasLocations = places.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-semibold text-gray-900">Mapa da viagem</h2>
        <div className="flex items-center gap-3 flex-wrap">
          {legend.map((l) => (
            <span key={l.label} className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
              {l.label}
            </span>
          ))}
          {places.length > 0 && (
            <a
              href={buildGoogleMapsUrl(trip.destination, places)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              Exportar para Google Maps
            </a>
          )}
        </div>
      </div>

      <MapView destination={trip.destination} places={places} />

      {!hasLocations && (
        <Card>
          <CardContent className="p-4 text-sm text-gray-500">
            Nenhum local encontrado. Adicione atividades com campo "Localização" ou hospedagens
            com "Endereço" para vê-las no mapa.
          </CardContent>
        </Card>
      )}

      {places.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          {places.map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2"
            >
              <span>{p.icon}</span>
              <span className="font-medium truncate">{p.label}</span>
              <span className="text-gray-400 truncate text-xs ml-auto">{p.location}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
