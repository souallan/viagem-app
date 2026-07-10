// Alertas de tempo extremo derivados da previsão (Open-Meteo, global, sem chave).
// Usado server-side no /api/notifications. Cache em memória para não martelar a API.

export type WeatherAlert = {
  kind: "storm" | "rain" | "heat" | "cold" | "wind";
  title: string;
  day: string; // YYYY-MM-DD
};

type Cached = { data: WeatherAlert[]; expires: number };
const cache = new Map<string, Cached>();
const TTL = 30 * 60 * 1000; // 30 min

async function j(url: string) {
  const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
  if (!res.ok) throw new Error(`fetch ${res.status}`);
  return res.json();
}

/** Detecta condições extremas nos próximos 3 dias para o destino. Falha silenciosa (retorna []). */
export async function getExtremeWeatherAlerts(destination: string): Promise<WeatherAlert[]> {
  const key = destination.trim().toLowerCase();
  if (!key) return [];
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.data;

  try {
    const city = destination.split(",")[0].trim();
    const geo = await j(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt`
    );
    const loc = geo?.results?.[0];
    if (!loc?.latitude) {
      cache.set(key, { data: [], expires: Date.now() + TTL });
      return [];
    }

    const fc = await j(
      `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max` +
        `&forecast_days=3&timezone=auto`
    );
    const d = fc?.daily;
    const alerts: WeatherAlert[] = [];
    const seen = new Set<string>(); // 1 alerta por tipo (o mais próximo)

    for (let i = 0; d?.time && i < d.time.length; i++) {
      const day = d.time[i] as string;
      const code = Number(d.weather_code?.[i]);
      const tmax = Number(d.temperature_2m_max?.[i]);
      const tmin = Number(d.temperature_2m_min?.[i]);
      const rain = Number(d.precipitation_sum?.[i]);
      const wind = Number(d.wind_speed_10m_max?.[i]);

      const push = (a: WeatherAlert) => {
        if (!seen.has(a.kind)) { seen.add(a.kind); alerts.push(a); }
      };

      if (code >= 95) push({ kind: "storm", title: "Tempestade prevista", day });
      else if (rain >= 50) push({ kind: "rain", title: `Chuva forte prevista (${Math.round(rain)} mm)`, day });
      if (tmax >= 40) push({ kind: "heat", title: `Calor extremo (${Math.round(tmax)}°C)`, day });
      if (tmin <= 0) push({ kind: "cold", title: `Frio extremo (${Math.round(tmin)}°C)`, day });
      if (wind >= 60) push({ kind: "wind", title: `Vento forte (${Math.round(wind)} km/h)`, day });
    }

    cache.set(key, { data: alerts, expires: Date.now() + TTL });
    return alerts;
  } catch {
    // rede/API falhou — não bloqueia as notificações; tenta de novo depois
    cache.set(key, { data: [], expires: Date.now() + 5 * 60 * 1000 });
    return [];
  }
}
