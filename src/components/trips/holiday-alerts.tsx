"use client";

import { useState, useEffect } from "react";
import { PartyPopper, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

// City/region → ISO 3166-1 alpha-2 country code
const CITY_COUNTRY: Record<string, string> = {
  // Brasil
  "são paulo": "BR", "sao paulo": "BR", "rio de janeiro": "BR", "brasília": "BR",
  "brasilia": "BR", "manaus": "BR", "fortaleza": "BR", "salvador": "BR",
  "curitiba": "BR", "porto alegre": "BR", "belo horizonte": "BR", "recife": "BR",
  // Europa
  "paris": "FR", "lyon": "FR", "nice": "FR", "marseille": "FR",
  "london": "GB", "londres": "GB", "manchester": "GB", "edimburgo": "GB", "edinburgh": "GB",
  "berlim": "DE", "berlin": "DE", "munique": "DE", "munich": "DE", "hamburg": "DE",
  "roma": "IT", "rome": "IT", "milão": "IT", "milan": "IT", "veneza": "IT", "venice": "IT", "florença": "IT", "florence": "IT",
  "madrid": "ES", "barcelona": "ES", "sevilha": "ES", "seville": "ES",
  "lisboa": "PT", "lisbon": "PT", "porto": "PT",
  "amsterdam": "NL", "amsterdã": "NL",
  "bruxelas": "BE", "brussels": "BE",
  "viena": "AT", "vienna": "AT",
  "zurique": "CH", "zurich": "CH", "genebra": "CH", "geneva": "CH",
  "estocolmo": "SE", "stockholm": "SE", "oslo": "NO",
  "copenhague": "DK", "copenhagen": "DK",
  "helsinki": "FI", "dublin": "IE", "dublim": "IE",
  "praga": "CZ", "prague": "CZ", "budapeste": "HU", "budapest": "HU",
  "varsóvia": "PL", "warsaw": "PL", "cracóvia": "PL", "krakow": "PL",
  "bucareste": "RO", "bucharest": "RO", "sofia": "BG",
  "atenas": "GR", "athens": "GR",
  "istambul": "TR", "istanbul": "TR",
  "moscou": "RU", "moscow": "RU",
  // Américas
  "nova york": "US", "new york": "US", "miami": "US", "chicago": "US",
  "los angeles": "US", "san francisco": "US", "las vegas": "US",
  "toronto": "CA", "montreal": "CA", "vancouver": "CA",
  "buenos aires": "AR", "santiago": "CL", "lima": "PE",
  "bogotá": "CO", "bogota": "CO", "caracas": "VE",
  "cidade do méxico": "MX", "mexico city": "MX",
  "havana": "CU", "montevideo": "UY",
  // Ásia
  "tóquio": "JP", "tokyo": "JP", "osaka": "JP",
  "seul": "KR", "seoul": "KR",
  "pequim": "CN", "beijing": "CN", "xangai": "CN", "shanghai": "CN",
  "hong kong": "HK",
  "bangkok": "TH", "banguecoque": "TH",
  "singapura": "SG", "singapore": "SG",
  "jakarta": "ID", "bali": "ID",
  "kuala lumpur": "MY",
  "manila": "PH",
  "mumbai": "IN", "delhi": "IN", "nova delhi": "IN", "new delhi": "IN",
  "dubai": "AE", "abu dhabi": "AE",
  "doha": "QA",
  "taipei": "TW",
  "ho chi minh": "VN", "hanói": "VN", "hanoi": "VN",
  // África
  "cairo": "EG", "casablanca": "MA",
  "johannesburgo": "ZA", "johannesburg": "ZA", "cape town": "ZA",
  "nairobi": "KE",
  // Oceania
  "sydney": "AU", "melbourne": "AU", "brisbane": "AU",
  "auckland": "NZ", "wellington": "NZ",
};

function guessCountry(city: string): string | null {
  const key = city.toLowerCase().trim();
  if (CITY_COUNTRY[key]) return CITY_COUNTRY[key];
  for (const [k, cc] of Object.entries(CITY_COUNTRY)) {
    if (key.includes(k) || k.includes(key)) return cc;
  }
  return null;
}

interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
}

interface HolidayMatch {
  date: string;
  holiday: Holiday;
}

export default function HolidayAlerts({ destinations, activityDates }: { destinations: string[]; activityDates: string[] }) {
  const [matches, setMatches] = useState<HolidayMatch[]>([]);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!destinations.length || !activityDates.length) return;

    const countries = [...new Set(
      destinations.map(d => guessCountry(d)).filter((c): c is string => !!c)
    )];

    const years = [...new Set(activityDates.map(d => d.slice(0, 4)))];

    if (!countries.length) return;

    Promise.all(
      countries.flatMap(cc =>
        years.map(year =>
          fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${cc}`)
            .then(r => r.ok ? r.json() as Promise<Holiday[]> : [])
            .catch(() => [])
        )
      )
    ).then(results => {
      const allHolidays: Holiday[] = results.flat();
      const dateSet = new Set(activityDates);
      const found: HolidayMatch[] = [];
      allHolidays.forEach(h => {
        if (dateSet.has(h.date)) {
          if (!found.some(m => m.date === h.date && m.holiday.countryCode === h.countryCode)) {
            found.push({ date: h.date, holiday: h });
          }
        }
      });
      found.sort((a, b) => a.date.localeCompare(b.date));
      setMatches(found);
    });
  }, [JSON.stringify(destinations), JSON.stringify(activityDates)]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!matches.length) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl overflow-hidden">
      <button
        className="w-full flex items-center gap-3 px-5 py-3.5 text-left"
        onClick={() => setOpen(v => !v)}
      >
        <PartyPopper className="h-[18px] w-[18px] text-amber-600 shrink-0" />
        <span className="text-sm font-bold text-amber-800 flex-1">
          {matches.length === 1 ? "1 atividade em feriado" : `${matches.length} atividades em feriados`}
        </span>
        {open ? <ChevronUp className="h-4 w-4 text-amber-500" /> : <ChevronDown className="h-4 w-4 text-amber-500" />}
      </button>
      {open && (
        <div className="border-t border-amber-200 divide-y divide-amber-100">
          {matches.map(m => {
            const date = new Date(m.date + "T12:00:00");
            return (
              <div key={m.date + m.holiday.countryCode} className="flex items-center gap-3 px-5 py-3">
                <div className="shrink-0 text-center w-10">
                  <p className="text-xs font-bold text-amber-700">
                    {date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-amber-900">{m.holiday.localName}</p>
                  {m.holiday.localName !== m.holiday.name && (
                    <p className="text-xs text-amber-600">{m.holiday.name}</p>
                  )}
                </div>
                <span className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0",
                  "bg-amber-200 text-amber-800"
                )}>
                  {m.holiday.countryCode}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
