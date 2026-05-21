"use client";

import { useEffect, useState } from "react";

interface DayForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  code: number;
}

const WMO_ICONS: [number, string][] = [
  [99, "⛈️"], [95, "⛈️"], [86, "❄️"], [85, "🌨️"], [82, "⛈️"],
  [81, "🌧️"], [80, "🌦️"], [77, "❄️"], [75, "❄️"], [73, "🌨️"],
  [71, "🌨️"], [67, "🌧️"], [65, "🌧️"], [63, "🌧️"], [61, "🌦️"],
  [57, "🌧️"], [55, "🌧️"], [53, "🌦️"], [51, "🌦️"],
  [48, "🌫️"], [45, "🌫️"], [3, "☁️"], [2, "⛅"], [1, "🌤️"], [0, "☀️"],
];

const WMO_DESC: [number, string][] = [
  [99, "Trovoada c/ granizo intenso"], [95, "Trovoada"], [86, "Neve intensa"],
  [85, "Neve em pancadas"], [82, "Pancadas fortes"], [81, "Pancadas moderadas"],
  [80, "Pancadas leves"], [75, "Neve forte"], [73, "Neve moderada"], [71, "Neve leve"],
  [67, "Chuva forte"], [65, "Chuva forte"], [63, "Chuva moderada"], [61, "Chuva leve"],
  [55, "Garoa forte"], [53, "Garoa moderada"], [51, "Garoa leve"],
  [48, "Névoa com geada"], [45, "Névoa"], [3, "Nublado"], [2, "Parcialmente nublado"],
  [1, "Principalmente limpo"], [0, "Céu limpo"],
];

function lookupWMO(table: [number, string][], code: number): string {
  for (const [threshold, value] of table) {
    if (code >= threshold) return value;
  }
  return table[table.length - 1][1];
}

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

async function geocodeCity(city: string) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
    { headers: { "Accept-Language": "pt-BR" } }
  );
  const data = await res.json();
  if (data[0]) return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  return null;
}

async function fetchForecast(lat: number, lon: number): Promise<DayForecast[]> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&daily=temperature_2m_max,temperature_2m_min,weathercode&forecast_days=7&timezone=auto`;
  const res = await fetch(url);
  const data = await res.json();
  return (data.daily.time as string[]).map((date, i) => ({
    date,
    maxTemp: Math.round(data.daily.temperature_2m_max[i]),
    minTemp: Math.round(data.daily.temperature_2m_min[i]),
    code: data.daily.weathercode[i] as number,
  }));
}

export default function WeatherWidget({ destination }: { destination: string }) {
  const [forecast, setForecast] = useState<DayForecast[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const coords = await geocodeCity(destination);
        if (!coords || cancelled) { setState("error"); return; }
        const days = await fetchForecast(coords.lat, coords.lon);
        if (!cancelled) { setForecast(days); setState("ready"); }
      } catch {
        if (!cancelled) setState("error");
      }
    })();
    return () => { cancelled = true; };
  }, [destination]);

  if (state === "loading") return <div className="h-28 bg-blue-50 rounded-xl animate-pulse" />;
  if (state === "error" || forecast.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-sky-100 rounded-xl p-4 border border-blue-100">
      <p className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
        🌍 Previsão do tempo — {destination}
      </p>
      <div className="grid grid-cols-7 gap-1">
        {forecast.map((day) => {
          const d = new Date(day.date + "T12:00:00");
          return (
            <div
              key={day.date}
              title={lookupWMO(WMO_DESC, day.code)}
              className="flex flex-col items-center gap-0.5 p-2 rounded-lg bg-white/70 hover:bg-white transition-colors"
            >
              <span className="text-xs text-gray-500 font-medium">{DAYS[d.getDay()]}</span>
              <span className="text-2xl">{lookupWMO(WMO_ICONS, day.code)}</span>
              <span className="text-xs font-bold text-gray-800">{day.maxTemp}°</span>
              <span className="text-xs text-gray-400">{day.minTemp}°</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
