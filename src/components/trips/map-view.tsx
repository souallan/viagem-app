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
}

const categoryColor: Record<string, string> = {
  destination: "#3b82f6",
  accommodation: "#8b5cf6",
  activity: "#10b981",
  event: "#f59e0b",
};

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

function makeIcon(emoji: string, color: string, dayNum?: number) {
  const badge = dayNum != null
    ? `<div style="position:absolute;top:-6px;right:-6px;background:#1e293b;color:white;font-size:9px;font-weight:700;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:1px solid white">D${dayNum}</div>`
    : "";
  return L.divIcon({
    html: `<div style="position:relative;width:34px;height:34px">
      <div style="background:${color};width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35)">${emoji}</div>
      ${badge}
    </div>`,
    className: "",
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -36],
  });
}

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length === 1) map.setView(positions[0], 13);
    else if (positions.length > 1) map.fitBounds(L.latLngBounds(positions), { padding: [48, 48] });
  }, [map, positions]);
  return null;
}

export default function MapView({
  destination,
  places,
}: {
  destination: string;
  places: MapPlace[];
}) {
  const [markers, setMarkers] = useState<GeocodedPlace[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const results: GeocodedPlace[] = [];

      const dest = await geocode(destination);
      if (cancelled) return;
      if (dest) {
        results.push({ label: destination, location: destination, category: "destination", icon: "📍", lat: dest.lat, lng: dest.lng });
      }

      for (const place of places) {
        if (cancelled) return;
        if (!place.location) continue;
        await new Promise((r) => setTimeout(r, 350));
        const coords = await geocode(`${place.location}, ${destination}`);
        if (coords && !cancelled) results.push({ ...place, lat: coords.lat, lng: coords.lng });
      }

      if (!cancelled) { setMarkers(results); setReady(true); }
    }
    load();
    return () => { cancelled = true; };
  }, [destination, places]);

  // Group by day for polylines
  const dayGroups = markers.reduce<Record<number, GeocodedPlace[]>>((acc, m) => {
    if (m.day != null && m.category !== "destination") {
      (acc[m.day] ??= []).push(m);
    }
    return acc;
  }, {});
  const days = Object.keys(dayGroups).map(Number).sort((a, b) => a - b);

  const positions = markers.map<[number, number]>((m) => [m.lat, m.lng]);

  return (
    <div className="space-y-3">
      <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm">
        {!ready && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="animate-spin">🌍</span> Geocodificando locais...
            </div>
          </div>
        )}
        <MapContainer center={[-15.788, -47.879]} zoom={4} style={{ height: 500, zIndex: 0 }} scrollWheelZoom>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {ready && <FitBounds positions={positions} />}

          {/* Day route polylines */}
          {days.map((day, idx) => {
            const pts = dayGroups[day].map<[number, number]>((m) => [m.lat, m.lng]);
            if (pts.length < 2) return null;
            return (
              <Polyline
                key={`route-day-${day}`}
                positions={pts}
                pathOptions={{ color: DAY_COLORS[idx % DAY_COLORS.length], weight: 3, opacity: 0.75, dashArray: "6 4" }}
              />
            );
          })}

          {/* Markers */}
          {markers.map((m, i) => (
            <Marker
              key={i}
              position={[m.lat, m.lng]}
              icon={makeIcon(
                m.icon,
                m.day != null && m.category !== "destination"
                  ? DAY_COLORS[days.indexOf(m.day) % DAY_COLORS.length]
                  : categoryColor[m.category] ?? "#6b7280",
                m.day != null && m.category !== "destination" ? m.day : undefined
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

      {/* Day legend */}
      {days.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {days.map((day, idx) => (
            <span
              key={day}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ background: `${DAY_COLORS[idx % DAY_COLORS.length]}22`, color: DAY_COLORS[idx % DAY_COLORS.length], border: `1px solid ${DAY_COLORS[idx % DAY_COLORS.length]}44` }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: DAY_COLORS[idx % DAY_COLORS.length], display: "inline-block" }} />
              Dia {day} — {dayGroups[day].length} local{dayGroups[day].length !== 1 ? "is" : ""}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
