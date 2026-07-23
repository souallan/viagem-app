"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { ExternalLink, MapPin, BedDouble, CalendarDays, Layers, Plane, Search, Route, Bus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import type { MapPlace } from "@/components/trips/map-view";

const MapView = dynamic(() => import("@/components/trips/map-view"), {
  ssr: false,
  loading: () => (
    <div className="h-[520px] rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
      Carregando mapa…
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

interface Transport {
  id: string;
  type: string;
  from: string;
  to: string;
}

interface Trip {
  id: string;
  title: string;
  destination: string;
}

type Filter = "all" | "destinations" | "accommodations" | "activities" | "transports";

const activityTypeIcon: Record<string, string> = {
  ACTIVITY: "🎯",
  MEAL: "🍽️",
  TRANSPORT: "🚌",
  ACCOMMODATION: "🏨",
  EVENT: "🎪",
  OTHER: "📌",
};

const transportTypeIcon: Record<string, string> = {
  FLIGHT: "✈️",
  BUS: "🚌",
  TRAIN: "🚆",
  CAR: "🚗",
  BOAT: "⛴️",
  OTHER: "🚏",
};

function buildGoogleMapsUrl(destination: string, places: MapPlace[]): string {
  const waypoints = places
    .filter((p) => p.location)
    .slice(0, 9)
    .map((p) => encodeURIComponent(p.location))
    .join("|");
  const dest = encodeURIComponent(destination);
  if (!waypoints) return `https://maps.google.com/?q=${dest}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}&waypoints=${waypoints}`;
}

export default function MapPage() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [transports, setTransports] = useState<Transport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [optimize, setOptimize] = useState(false);

  useEffect(() => {
    async function load() {
      const [t, a, h, tr] = await Promise.all([
        fetch(`/api/trips/${id}`).then((r) => r.json()),
        fetch(`/api/trips/${id}/activities`).then((r) => r.json()),
        fetch(`/api/trips/${id}/accommodations`).then((r) => r.json()),
        fetch(`/api/trips/${id}/transports`).then((r) => r.json()),
      ]);
      setTrip(t);
      setActivities(Array.isArray(a) ? a : []);
      setAccommodations(Array.isArray(h) ? h : []);
      setTransports(Array.isArray(tr) ? tr : []);
      setLoading(false);
    }
    load();
  }, [id]);

  const destinations = useMemo(() =>
    trip?.destination
      ? trip.destination.split(" → ").map((d) => d.trim()).filter(Boolean)
      : [],
  [trip]);

  const sortedDates = useMemo(() =>
    [...new Set(activities.map((a) => a.date.split("T")[0]))].sort(),
  [activities]);

  const dateToDay = useMemo(() => {
    const m: Record<string, number> = {};
    sortedDates.forEach((d, i) => { m[d] = i + 1; });
    return m;
  }, [sortedDates]);

  const accomPlaces: MapPlace[] = useMemo(() =>
    accommodations
      .filter((a) => a.address)
      .map((a) => ({
        label: a.name,
        location: a.address!,
        category: "accommodation" as const,
        icon: "🏨",
      })),
  [accommodations]);

  const activityPlaces: MapPlace[] = useMemo(() =>
    activities
      .filter((a) => a.location || a.address)
      .map((a) => ({
        label: a.title,
        location: a.location || a.address || "",
        category: (a.type === "EVENT" ? "event" : "activity") as MapPlace["category"],
        icon: activityTypeIcon[a.type] ?? "📌",
        day: dateToDay[a.date.split("T")[0]] ?? undefined,
      })),
  [activities, dateToDay]);

  const transportPlaces: MapPlace[] = useMemo(() => {
    const seen = new Set<string>();
    const out: MapPlace[] = [];
    for (const tr of transports) {
      const icon = transportTypeIcon[tr.type] ?? "🚏";
      for (const loc of [tr.from, tr.to]) {
        const key = (loc || "").trim().toLowerCase();
        if (!key || seen.has(key)) continue;
        seen.add(key);
        out.push({ label: loc, location: loc, category: "transport", icon });
      }
    }
    return out;
  }, [transports]);

  // Filtered data passed to MapView (por categoria + busca por texto)
  const filteredDestinations = useMemo(() => {
    const inCat = (filter === "accommodations" || filter === "activities" || filter === "transports") ? [] : destinations;
    const q = search.trim().toLowerCase();
    return q ? inCat.filter((d) => d.toLowerCase().includes(q)) : inCat;
  }, [filter, destinations, search]);

  const filteredPlaces = useMemo(() => {
    let list: MapPlace[];
    if (filter === "all") list = [...accomPlaces, ...activityPlaces, ...transportPlaces];
    else if (filter === "accommodations") list = accomPlaces;
    else if (filter === "activities") list = activityPlaces;
    else if (filter === "transports") list = transportPlaces;
    else list = [];
    const q = search.trim().toLowerCase();
    return q ? list.filter((p) => p.label.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)) : list;
  }, [filter, accomPlaces, activityPlaces, transportPlaces, search]);

  const allPlaces = useMemo(() => [...accomPlaces, ...activityPlaces, ...transportPlaces], [accomPlaces, activityPlaces, transportPlaces]);

  const FILTERS: { id: Filter; label: string; Icon: React.ElementType; count: number; color: string }[] = [
    { id: "all",           label: t.map.filterAll,            Icon: Layers,      count: destinations.length + allPlaces.length, color: "primary" },
    { id: "destinations",  label: t.map.filterCities,         Icon: MapPin,      count: destinations.length,  color: "blue"   },
    { id: "accommodations",label: t.map.filterAccommodations, Icon: BedDouble,   count: accomPlaces.length,   color: "purple" },
    { id: "activities",    label: t.map.filterActivities,     Icon: CalendarDays,count: activityPlaces.length, color: "green"  },
    { id: "transports",    label: "Transportes",              Icon: Plane,       count: transportPlaces.length, color: "cyan"   },
  ];

  const activeStyle: Record<string, string> = {
    primary: "bg-primary-600 text-white border-primary-600 shadow-sm shadow-primary-200",
    blue:    "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200",
    purple:  "bg-violet-600 text-white border-violet-600 shadow-sm shadow-violet-200",
    green:   "bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-200",
    cyan:    "bg-cyan-600 text-white border-cyan-600 shadow-sm shadow-cyan-200",
  };

  if (loading || !trip) {
    return (
      <div className="text-center py-16 text-gray-500">
        <div className="text-5xl mb-3">🗺️</div>
        <p>{t.common.loading}</p>
      </div>
    );
  }

  const hasAny = destinations.length > 0 || allPlaces.length > 0;

  return (
    <div className="space-y-4">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-semibold text-gray-900">{t.map.title}</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setOptimize((v) => !v)}
            title="Reordena as atividades de cada dia pela menor distância"
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors",
              optimize ? "bg-primary-600 text-white border-primary-600" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
            )}
          >
            <Route className="h-3.5 w-3.5" /> {optimize ? "Trajeto otimizado" : "Otimizar trajeto"}
          </button>
          {hasAny && !optimize && (
            <a
              href={buildGoogleMapsUrl(trip.destination, allPlaces)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {t.map.exportGoogleMaps}
            </a>
          )}
        </div>
      </div>

      {/* ── Map ── */}
      <MapView destinations={filteredDestinations} places={filteredPlaces} optimize={optimize} />

      {/* ── Filter buttons (below the map) ── */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-3">
        {/* Busca por texto */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar local (hotel, restaurante, aeroporto…)"
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/15"
          />
        </div>

        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2.5 px-1">
          {t.map.showOnMap}
        </p>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(({ id, label, Icon, count, color }) => {
            const active = filter === id;
            return (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={cn(
                  "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-semibold transition-all",
                  active
                    ? activeStyle[color]
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-800"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
                <span className={cn(
                  "text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center leading-none",
                  active ? "bg-white/25 text-white" : "bg-gray-200 text-gray-500"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Description of the active filter */}
        <p className="text-xs text-gray-500 mt-2.5 px-1">
          {filter === "all"           && t.map.filterDescAll}
          {filter === "destinations"  && t.map.filterDescDestinations}
          {filter === "accommodations"&& t.map.filterDescAccommodations}
          {filter === "activities"    && t.map.filterDescActivities}
          {filter === "transports"    && "Aeroportos e estações dos seus transportes. Toque num marcador para traçar a rota."}
        </p>
      </div>

      {/* ── Empty state ── */}
      {!hasAny && (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
          {t.map.noLocationsExtended}
        </div>
      )}

      {/* ── Transporte público local ── */}
      {destinations.length > 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center">
              <Bus className="h-4 w-4 text-cyan-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Transporte público local</h3>
              <p className="text-xs text-gray-500">Como se locomover em cada destino</p>
            </div>
          </div>
          <div className="space-y-2">
            {destinations.map((dest, i) => {
              const city = dest.split(",")[0].trim();
              const q = encodeURIComponent(city + " transporte público");
              return (
                <div key={i} className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-gray-800 min-w-[84px]">{city}</span>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noreferrer" className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-colors">Google Maps</a>
                  <a href="https://citymapper.com/?lang=pt" target="_blank" rel="noreferrer" className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 transition-colors">Citymapper</a>
                  <a href="https://moovitapp.com/" target="_blank" rel="noreferrer" className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-orange-50 text-orange-600 border border-orange-100 hover:bg-orange-100 transition-colors">Moovit</a>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-gray-500 mt-2.5">Citymapper e Moovit abrem o app (se a cidade for suportada). Para um local específico, use o botão “🚌 Transporte” no marcador do mapa.</p>
        </div>
      )}

      {/* ── Location list for current filter ── */}
      {(filteredDestinations.length > 0 || filteredPlaces.length > 0) && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t.map.shownLocations}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredDestinations.map((dest, i) => (
              <div key={`dest-${i}`} className="flex items-center gap-2.5 text-sm bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
                <span className="font-semibold text-blue-800 truncate">{dest.split(",")[0]}</span>
                <span className="text-[10px] font-bold text-blue-400 ml-auto shrink-0">{t.map.destination} {i + 1}</span>
              </div>
            ))}
            {filteredPlaces.map((p, i) => {
              const isAccom = p.category === "accommodation";
              return (
                <div key={`place-${i}`} className={cn(
                  "flex items-center gap-2.5 text-sm rounded-xl px-3 py-2.5 border",
                  isAccom ? "bg-violet-50 border-violet-100" : "bg-emerald-50 border-emerald-100"
                )}>
                  <span className="text-base shrink-0 leading-none">{p.icon}</span>
                  <span className={cn("font-semibold truncate", isAccom ? "text-violet-800" : "text-emerald-800")}>
                    {p.label}
                  </span>
                  <span className={cn("text-xs truncate ml-auto shrink-0 max-w-[120px]", isAccom ? "text-violet-400" : "text-emerald-400")}>
                    {p.location}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
