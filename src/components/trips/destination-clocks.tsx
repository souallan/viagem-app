"use client";

import { useState, useEffect } from "react";
import { Globe, Clock } from "lucide-react";

const CITY_TZ: Record<string, string> = {
  // Europa
  "paris": "Europe/Paris", "london": "Europe/London", "londres": "Europe/London",
  "madrid": "Europe/Madrid", "barcelona": "Europe/Madrid",
  "roma": "Europe/Rome", "rome": "Europe/Rome", "milão": "Europe/Rome", "milan": "Europe/Rome",
  "berlim": "Europe/Berlin", "berlin": "Europe/Berlin",
  "amsterdam": "Europe/Amsterdam", "amsterdã": "Europe/Amsterdam",
  "viena": "Europe/Vienna", "vienna": "Europe/Vienna",
  "praga": "Europe/Prague", "prague": "Europe/Prague",
  "budapest": "Europe/Budapest", "budapeste": "Europe/Budapest",
  "lisboa": "Europe/Lisbon", "lisbon": "Europe/Lisbon", "porto": "Europe/Lisbon",
  "atenas": "Europe/Athens", "athens": "Europe/Athens",
  "estocolmo": "Europe/Stockholm", "stockholm": "Europe/Stockholm",
  "oslo": "Europe/Oslo", "copenhague": "Europe/Copenhagen", "copenhagen": "Europe/Copenhagen",
  "zurique": "Europe/Zurich", "zurich": "Europe/Zurich",
  "genebra": "Europe/Zurich", "geneva": "Europe/Zurich",
  "bruxelas": "Europe/Brussels", "brussels": "Europe/Brussels",
  "moscou": "Europe/Moscow", "moscow": "Europe/Moscow", "moscovo": "Europe/Moscow",
  "istambul": "Europe/Istanbul", "istanbul": "Europe/Istanbul",
  "dublim": "Europe/Dublin", "dublin": "Europe/Dublin",
  "edimburgo": "Europe/London", "edinburgh": "Europe/London",
  "varsóvia": "Europe/Warsaw", "warsaw": "Europe/Warsaw",
  "bucareste": "Europe/Bucharest", "bucharest": "Europe/Bucharest",
  "sofia": "Europe/Sofia", "zagreb": "Europe/Zagreb",
  "belgrado": "Europe/Belgrade", "belgrade": "Europe/Belgrade",
  "helsinki": "Europe/Helsinki", "riga": "Europe/Riga",
  "tallinn": "Europe/Tallinn", "vilnius": "Europe/Vilnius",
  // Américas
  "são paulo": "America/Sao_Paulo", "sao paulo": "America/Sao_Paulo",
  "rio de janeiro": "America/Sao_Paulo", "brasília": "America/Sao_Paulo",
  "brasilia": "America/Sao_Paulo", "belo horizonte": "America/Sao_Paulo",
  "manaus": "America/Manaus", "recife": "America/Recife",
  "fortaleza": "America/Fortaleza", "salvador": "America/Bahia",
  "buenos aires": "America/Argentina/Buenos_Aires",
  "santiago": "America/Santiago", "lima": "America/Lima",
  "bogotá": "America/Bogota", "bogota": "America/Bogota",
  "caracas": "America/Caracas",
  "cidade do méxico": "America/Mexico_City", "mexico city": "America/Mexico_City",
  "nova york": "America/New_York", "new york": "America/New_York",
  "miami": "America/New_York", "chicago": "America/Chicago",
  "los angeles": "America/Los_Angeles", "san francisco": "America/Los_Angeles",
  "seattle": "America/Los_Angeles", "las vegas": "America/Los_Angeles",
  "toronto": "America/Toronto", "montreal": "America/Montreal",
  "vancouver": "America/Vancouver", "havana": "America/Havana",
  "montevideo": "America/Montevideo",
  // Ásia
  "tóquio": "Asia/Tokyo", "tokyo": "Asia/Tokyo", "osaka": "Asia/Tokyo",
  "pequim": "Asia/Shanghai", "beijing": "Asia/Shanghai",
  "xangai": "Asia/Shanghai", "shanghai": "Asia/Shanghai",
  "hong kong": "Asia/Hong_Kong",
  "seul": "Asia/Seoul", "seoul": "Asia/Seoul",
  "bangkok": "Asia/Bangkok", "banguecoque": "Asia/Bangkok",
  "singapura": "Asia/Singapore", "singapore": "Asia/Singapore",
  "jakarta": "Asia/Jakarta", "kuala lumpur": "Asia/Kuala_Lumpur",
  "manila": "Asia/Manila",
  "mumbai": "Asia/Kolkata", "delhi": "Asia/Kolkata",
  "nova delhi": "Asia/Kolkata", "new delhi": "Asia/Kolkata",
  "dubai": "Asia/Dubai", "abu dhabi": "Asia/Dubai",
  "doha": "Asia/Qatar", "riad": "Asia/Riyadh", "riyadh": "Asia/Riyadh",
  "teerã": "Asia/Tehran", "tehran": "Asia/Tehran",
  "taipei": "Asia/Taipei",
  "ho chi minh": "Asia/Ho_Chi_Minh", "hanói": "Asia/Bangkok", "hanoi": "Asia/Bangkok",
  "colombo": "Asia/Colombo", "karachi": "Asia/Karachi", "dhaka": "Asia/Dhaka",
  "katmandu": "Asia/Kathmandu", "kathmandu": "Asia/Kathmandu",
  "bali": "Asia/Makassar", "denpasar": "Asia/Makassar",
  // África & Oriente Médio
  "cairo": "Africa/Cairo", "casablanca": "Africa/Casablanca",
  "johannesburgo": "Africa/Johannesburg", "johannesburg": "Africa/Johannesburg",
  "nairobi": "Africa/Nairobi", "lagos": "Africa/Lagos",
  "tel aviv": "Asia/Jerusalem", "jerusalém": "Asia/Jerusalem", "jerusalem": "Asia/Jerusalem",
  // Oceania
  "sydney": "Australia/Sydney", "melbourne": "Australia/Melbourne",
  "brisbane": "Australia/Brisbane", "auckland": "Pacific/Auckland",
  "wellington": "Pacific/Auckland", "honolulu": "Pacific/Honolulu",
};

function guessTimezone(city: string): string | null {
  const key = city.toLowerCase().trim();
  if (CITY_TZ[key]) return CITY_TZ[key];
  for (const [k, tz] of Object.entries(CITY_TZ)) {
    if (key.includes(k) || k.includes(key)) return tz;
  }
  return null;
}

function ClockCard({ city, timezone }: { city: string; timezone: string }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const time = now.toLocaleTimeString("pt-BR", { timeZone: timezone, hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString("pt-BR", { timeZone: timezone, weekday: "short", day: "numeric", month: "short" });

  const localOffset = -now.getTimezoneOffset();
  const destFormatter = new Intl.DateTimeFormat("en", { timeZone: timezone, timeZoneName: "shortOffset" });
  const destOffsetStr = destFormatter.formatToParts(now).find(p => p.type === "timeZoneName")?.value ?? "";
  const destOffsetMins = (() => {
    const match = destOffsetStr.match(/([+-])(\d+)(?::(\d+))?/);
    if (!match) return 0;
    const sign = match[1] === "+" ? 1 : -1;
    return sign * (parseInt(match[2]) * 60 + (parseInt(match[3] ?? "0")));
  })();
  const diffMins = destOffsetMins - localOffset;
  const diffH = Math.round(diffMins / 60);
  const diffLabel = diffH === 0 ? "mesmo fuso" : diffH > 0 ? `+${diffH}h vs você` : `${diffH}h vs você`;

  const [h] = time.split(":").map(Number);
  const period = h >= 6 && h < 12 ? "🌅" : h >= 12 && h < 18 ? "☀️" : h >= 18 && h < 22 ? "🌆" : "🌙";

  return (
    <div className="flex-1 min-w-[140px] bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 p-3.5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide truncate">{city}</span>
        <span className="text-base">{period}</span>
      </div>
      <p className="text-2xl font-black text-gray-900 leading-none">{time}</p>
      <p className="text-[11px] text-gray-400 mt-1 capitalize">{date}</p>
      <p className={`text-[10px] font-semibold mt-1.5 px-1.5 py-0.5 rounded-full inline-block ${
        diffH === 0 ? "bg-gray-100 text-gray-500" : diffH > 0 ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"
      }`}>{diffLabel}</p>
    </div>
  );
}

export default function DestinationClocks({ destination }: { destination: string }) {
  const cities = destination.split(" → ").map(c => c.trim());
  const withTz = cities.map(c => ({ city: c, tz: guessTimezone(c) })).filter(x => x.tz !== null) as { city: string; tz: string }[];

  if (withTz.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
          <Globe className="h-4 w-4 text-indigo-500" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">Horário local</h3>
          <p className="text-xs text-gray-400">
            {withTz.length === 1 ? "Fuso horário do destino" : "Fuso horário dos destinos"}
          </p>
        </div>
        <Clock className="h-3.5 w-3.5 text-gray-300 ml-auto" />
      </div>
      <div className="flex flex-wrap gap-3">
        {withTz.map(({ city, tz }) => (
          <ClockCard key={city} city={city} timezone={tz} />
        ))}
      </div>
    </div>
  );
}
