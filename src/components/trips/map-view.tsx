"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export interface MapPlace {
  label: string;
  location: string;
  category: "destination" | "accommodation" | "activity" | "event";
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
};

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

export default function MapView({
  destinations,
  places,
}: {
  destinations: string[];
  places: MapPlace[];
}) {
  const [destMarkers, setDestMarkers] = useState<(GeocodedPlace & { destIndex: number })[]>([]);
  const [placeMarkers, setPlaceMarkers] = useState<GeocodedPlace[]>([]);
  const [ready, setReady] = useState(false);

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

          {/* Destination route polyline */}
          {destMarkers.length > 1 && (
            <Polyline
              positions={destMarkers.map<[number, number]>((m) => [m.lat, m.lng])}
              pathOptions={{ color: "#2563eb", weight: 2.5, opacity: 0.5, dashArray: "8 5" }}
            />
          )}

          {/* Day route polylines */}
          {days.map((day, idx) => {
            const pts = dayGroups[day].map<[number, number]>((m) => [m.lat, m.lng]);
            if (pts.length < 2) return null;
            return (
              <Polyline
                key={`route-day-${day}`}
                positions={pts}
                pathOptions={{ color: DAY_COLORS[idx % DAY_COLORS.length], weight: 2.5, opacity: 0.7, dashArray: "5 4" }}
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
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

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
              Dia {day} · {dayGroups[day].length} local{dayGroups[day].length !== 1 ? "is" : ""}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
