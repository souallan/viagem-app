"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
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

function makeIcon(emoji: string, color: string) {
  return L.divIcon({
    html: `<div style="background:${color};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35)">${emoji}</div>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -34],
  });
}

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length === 1) {
      map.setView(positions[0], 13);
    } else if (positions.length > 1) {
      map.fitBounds(L.latLngBounds(positions), { padding: [48, 48] });
    }
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
        results.push({
          label: destination,
          location: destination,
          category: "destination",
          icon: "📍",
          lat: dest.lat,
          lng: dest.lng,
        });
      }

      for (const place of places) {
        if (cancelled) return;
        if (!place.location) continue;
        await new Promise((r) => setTimeout(r, 350));
        const coords = await geocode(`${place.location}, ${destination}`);
        if (coords && !cancelled) {
          results.push({ ...place, lat: coords.lat, lng: coords.lng });
        }
      }

      if (!cancelled) {
        setMarkers(results);
        setReady(true);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [destination, places]);

  const positions = markers.map<[number, number]>((m) => [m.lat, m.lng]);
  const defaultCenter: [number, number] = [-15.788, -47.879];

  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-200">
      {!ready && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="animate-spin">🌍</span> Geocodificando locais...
          </div>
        </div>
      )}
      <MapContainer
        center={defaultCenter}
        zoom={4}
        style={{ height: 500, zIndex: 0 }}
        scrollWheelZoom
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {ready && <FitBounds positions={positions} />}
        {markers.map((m, i) => (
          <Marker
            key={i}
            position={[m.lat, m.lng]}
            icon={makeIcon(m.icon, categoryColor[m.category] ?? "#6b7280")}
          >
            <Popup>
              <p className="font-semibold text-sm">{m.label}</p>
              <p className="text-xs text-gray-500 capitalize">{m.location}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
