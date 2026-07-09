"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { optimizeOrder, pathDistanceKm } from "@/lib/route-opt";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export interface MapPlace {
  label: string;
  location: string;
  category: "destination" | "accommodation" | "activity" | "event" | "transport";
  icon: string;
  day?: number;
}

interface GeocodedPlace extends MapPlace {
  lat: number;
  lng: number;
  destIndex?: number;
}

const categoryColor: Record<string, string> = {
  destination: "#2563eb",
  accommodation: "#7c3aed",
  activity: "#059669",
  event: "#d97706",
  transport: "#0284c7",
};

function directionsUrl(lat: number, lng: number, origin?: { lat: number; lng: number } | null): string {
  const o = origin ? `&origin=${origin.lat},${origin.lng}` : "";
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}${o}&travelmode=driving`;
}
function transitUrl(lat: number, lng: number, origin?: { lat: number; lng: number } | null): string {
  const o = origin ? `&origin=${origin.lat},${origin.lng}` : "";
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}${o}&travelmode=transit`;
}
function wazeUrl(lat: number, lng: number): string {
  return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
}
function gmapsFromCoords(coords: { lat: number; lng: number }[]): string {
  const dest = coords[coords.length - 1];
  const wps = coords.slice(0, -1).slice(0, 9).map((c) => `${c.lat},${c.lng}`).join("|");
  const d = `${dest.lat},${dest.lng}`;
  return wps
    ? `https://www.google.com/maps/dir/?api=1&destination=${d}&waypoints=${wps}&travelmode=driving`
    : `https://www.google.com/maps/dir/?api=1&destination=${d}`;
}
function makeUserIcon() {
  return L.divIcon({
    html: `<div style="width:18px;height:18px;border-radius:50%;background:#2563eb;border:3px solid white;box-shadow:0 0 0 4px rgba(37,99,235,0.25),0 2px 6px rgba(0,0,0,0.35)"></div>`,
    className: "",
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

const DEST_COLORS = [
  "#2563eb", "#0891b2", "#7c3aed", "#db2777",
  "#ea580c", "#65a30d", "#0d9488",
];

const DAY_COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16",
];

async function geocode(query: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
      { headers: { "Accept-Language": "pt-BR,pt;q=0.9" } }
    );
    const data = await res.json();
    if (data[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch { /* ignore */ }
  return null;
}

/** Teardrop pin for destinations */
function makePinIcon(label: string, color: string, index: number) {
  return L.divIcon({
    html: `
      <div style="position:relative;width:36px;height:44px">
        <div style="
          background:${color};
          width:36px;height:36px;border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          border:3px solid white;
          box-shadow:0 3px 12px rgba(0,0,0,0.35);
          display:flex;align-items:center;justify-content:center;
        ">
          <div style="transform:rotate(45deg);color:white;font-size:11px;font-weight:900;line-height:1">
            ${index + 1}
          </div>
        </div>
      </div>`,
    className: "",
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -46],
  });
}

/** Circular icon for activities/accommodations */
function makeCircleIcon(emoji: string, color: string, dayNum?: number) {
  const badge = dayNum != null
    ? `<div style="position:absolute;top:-5px;right:-5px;background:#1e293b;color:white;font-size:9px;font-weight:700;width:15px;height:15px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:1px solid white">D${dayNum}</div>`
    : "";
  return L.divIcon({
    html: `<div style="position:relative;width:32px;height:32px">
      <div style="background:${color};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">${emoji}</div>
      ${badge}
    </div>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -34],
  });
}

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length === 1) map.setView(positions[0], 12);
    else if (positions.length > 1) map.fitBounds(L.latLngBounds(positions), { padding: [52, 52] });
  }, [map, positions]);
  return null;
}

function FlyTo({ pos }: { pos: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (pos) map.flyTo([pos.lat, pos.lng], 14);
  }, [map, pos]);
  return null;
}

/** Botões de rota dentro do popup (Google Maps / transporte público / Waze) */
function RouteLinks({ lat, lng, origin }: { lat: number; lng: number; origin: { lat: number; lng: number } | null }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
      <a href={directionsUrl(lat, lng, origin)} target="_blank" rel="noreferrer"
        style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: "#2563eb", padding: "4px 8px", borderRadius: 8, textDecoration: "none" }}>
        🧭 Rota
      </a>
      <a href={transitUrl(lat, lng, origin)} target="_blank" rel="noreferrer"
        style={{ fontSize: 11, fontWeight: 700, color: "#0369a1", background: "#e0f2fe", padding: "4px 8px", borderRadius: 8, textDecoration: "none" }}>
        🚌 Transporte
      </a>
      <a href={wazeUrl(lat, lng)} target="_blank" rel="noreferrer"
        style={{ fontSize: 11, fontWeight: 700, color: "#334155", background: "#f1f5f9", padding: "4px 8px", borderRadius: 8, textDecoration: "none" }}>
        Waze
      </a>
    </div>
  );
}

export default function MapView({
  destinations,
  places,
  optimize = false,
}: {
  destinations: string[];
  places: MapPlace[];
  optimize?: boolean;
}) {
  const [destMarkers, setDestMarkers] = useState<(GeocodedPlace & { destIndex: number })[]>([]);
  const [placeMarkers, setPlaceMarkers] = useState<GeocodedPlace[]>([]);
  const [ready, setReady] = useState(false);
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState(false);

  function locate() {
    if (typeof navigator === "undefined" || !navigator.geolocation) { setGeoError(true); return; }
    setLocating(true); setGeoError(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocating(false); },
      () => { setGeoError(true); setLocating(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      // 1. Geocode each destination → numbered pins
      const dests: (GeocodedPlace & { destIndex: number })[] = [];
      for (let i = 0; i < destinations.length; i++) {
        if (cancelled) return;
        const coords = await geocode(destinations[i]);
        if (coords && !cancelled) {
          dests.push({
            label: destinations[i],
            location: destinations[i],
            category: "destination",
            icon: "📍",
            lat: coords.lat,
            lng: coords.lng,
            destIndex: i,
          });
        }
        if (i < destinations.length - 1) await new Promise((r) => setTimeout(r, 300));
      }
      if (!cancelled) setDestMarkers(dests);

      // 2. Geocode activity / accommodation places
      const mainCity = destinations[0] ?? "";
      const pts: GeocodedPlace[] = [];
      for (const place of places) {
        if (cancelled) return;
        if (!place.location) continue;
        await new Promise((r) => setTimeout(r, 300));
        const coords = await geocode(place.location.includes(",") ? place.location : `${place.location}, ${mainCity}`);
        if (coords && !cancelled) pts.push({ ...place, lat: coords.lat, lng: coords.lng });
      }
      if (!cancelled) { setPlaceMarkers(pts); setReady(true); }
    }
    load();
    return () => { cancelled = true; };
  }, [destinations, places]);

  const allMarkers = [...destMarkers, ...placeMarkers];
  const positions = allMarkers.map<[number, number]>((m) => [m.lat, m.lng]);

  const dayGroups = placeMarkers.reduce<Record<number, GeocodedPlace[]>>((acc, m) => {
    if (m.day != null) (acc[m.day] ??= []).push(m);
    return acc;
  }, {});
  const days = Object.keys(dayGroups).map(Number).sort((a, b) => a - b);

  // Trajeto por dia: ordem cronológica ou otimizada (menor distância) + km
  const dayRoutes: Record<number, { ordered: GeocodedPlace[]; km: number }> = {};
  for (const day of days) {
    const pts = dayGroups[day];
    let ordered = pts;
    if (optimize && pts.length > 2) {
      const idx = optimizeOrder(pts.map((p) => ({ lat: p.lat, lng: p.lng })));
      ordered = idx.map((i) => pts[i]);
    }
    dayRoutes[day] = { ordered, km: pathDistanceKm(ordered.map((p) => ({ lat: p.lat, lng: p.lng }))) };
  }

  const optimizedCoords = optimize ? days.flatMap((d) => dayRoutes[d].ordered) : [];
  const optimizedGmapsUrl = optimizedCoords.length >= 2
    ? gmapsFromCoords(optimizedCoords.map((p) => ({ lat: p.lat, lng: p.lng })))
    : null;

  return (
    <div className="space-y-3">
      <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
        {!ready && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/85 rounded-2xl">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="animate-spin inline-block">🌍</span> Posicionando locais no mapa...
            </div>
          </div>
        )}
        <MapContainer center={[-15.788, -47.879]} zoom={4} style={{ height: 520, zIndex: 0 }} scrollWheelZoom>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {ready && <FitBounds positions={positions} />}
          <FlyTo pos={userLoc} />
          {userLoc && (
            <Marker position={[userLoc.lat, userLoc.lng]} icon={makeUserIcon()}>
              <Popup>Você está aqui</Popup>
            </Marker>
          )}

          {/* Destination route polyline */}
          {destMarkers.length > 1 && (
            <Polyline
              positions={destMarkers.map<[number, number]>((m) => [m.lat, m.lng])}
              pathOptions={{ color: "#2563eb", weight: 2.5, opacity: 0.5, dashArray: "8 5" }}
            />
          )}

          {/* Day route polylines */}
          {days.map((day, idx) => {
            const pts = dayRoutes[day].ordered.map<[number, number]>((m) => [m.lat, m.lng]);
            if (pts.length < 2) return null;
            return (
              <Polyline
                key={`route-day-${day}`}
                positions={pts}
                pathOptions={{ color: DAY_COLORS[idx % DAY_COLORS.length], weight: optimize ? 3.5 : 2.5, opacity: 0.75, dashArray: optimize ? undefined : "5 4" }}
              />
            );
          })}

          {/* Destination pins (teardrop) */}
          {destMarkers.map((m) => (
            <Marker
              key={`dest-${m.destIndex}`}
              position={[m.lat, m.lng]}
              icon={makePinIcon(m.label, DEST_COLORS[m.destIndex % DEST_COLORS.length], m.destIndex)}
            >
              <Popup>
                <p className="font-bold text-sm">{m.label}</p>
                <p className="text-xs text-blue-600 font-semibold">Destino {m.destIndex + 1}</p>
                <RouteLinks lat={m.lat} lng={m.lng} origin={userLoc} />
              </Popup>
            </Marker>
          ))}

          {/* Activity / accommodation circles */}
          {placeMarkers.map((m, i) => (
            <Marker
              key={`place-${i}`}
              position={[m.lat, m.lng]}
              icon={makeCircleIcon(
                m.icon,
                m.day != null
                  ? DAY_COLORS[days.indexOf(m.day) % DAY_COLORS.length]
                  : categoryColor[m.category] ?? "#6b7280",
                m.day != null ? m.day : undefined
              )}
            >
              <Popup>
                <p className="font-semibold text-sm">{m.label}</p>
                {m.day != null && <p className="text-xs text-sky-600 font-medium">Dia {m.day}</p>}
                <p className="text-xs text-gray-500">{m.location}</p>
                <RouteLinks lat={m.lat} lng={m.lng} origin={userLoc} />
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Botão "Minha localização" (geolocation) */}
        <button
          onClick={locate}
          className="absolute top-3 right-3 z-[1000] inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-white/95 text-gray-700 border border-gray-200 shadow-md hover:bg-white transition-colors"
          title="Minha localização"
        >
          <span>{locating ? "⏳" : "📍"}</span>
          {locating ? "Localizando…" : "Minha localização"}
        </button>
        {geoError && (
          <p className="absolute top-14 right-3 z-[1000] text-[11px] bg-red-50 text-red-600 border border-red-100 px-2 py-1 rounded-md shadow-sm">
            Não foi possível obter a localização
          </p>
        )}
      </div>

      {optimizedGmapsUrl && (
        <a
          href={optimizedGmapsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
        >
          🧭 Abrir trajeto otimizado no Google Maps
        </a>
      )}

      {/* Destination legend */}
      {destMarkers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {destMarkers.map((d) => (
            <span
              key={d.destIndex}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border"
              style={{
                background: `${DEST_COLORS[d.destIndex % DEST_COLORS.length]}18`,
                color: DEST_COLORS[d.destIndex % DEST_COLORS.length],
                borderColor: `${DEST_COLORS[d.destIndex % DEST_COLORS.length]}40`,
              }}
            >
              <span style={{
                width: 16, height: 16, borderRadius: "50% 50% 50% 0",
                background: DEST_COLORS[d.destIndex % DEST_COLORS.length],
                transform: "rotate(-45deg)",
                display: "inline-block", flexShrink: 0,
              }} />
              {d.destIndex + 1}. {d.label.split(",")[0]}
            </span>
          ))}
          {days.map((day, idx) => (
            <span
              key={day}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ background: `${DAY_COLORS[idx % DAY_COLORS.length]}22`, color: DAY_COLORS[idx % DAY_COLORS.length], border: `1px solid ${DAY_COLORS[idx % DAY_COLORS.length]}44` }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: DAY_COLORS[idx % DAY_COLORS.length], display: "inline-block" }} />
              Dia {day} · {dayGroups[day].length} local{dayGroups[day].length !== 1 ? "is" : ""}{dayRoutes[day].km > 0 ? ` · ~${dayRoutes[day].km.toFixed(1)} km` : ""}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
