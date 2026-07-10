"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Suggestion {
  display: string;
  cleanAddress: string;
  name: string;
  city: string;
  state: string;
  country: string;
  countryCode: string;
}

export interface LocationInputProps {
  value: string;
  onChange: (value: string, validated: boolean) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  id?: string;
  /** "city" = cidade/país (padrão). "address" = endereço completo. */
  mode?: "city" | "address";
  /** Geographic context appended to queries (e.g. city name) to bias results. */
  searchContext?: string;
  /** Called when user selects a suggestion; provides the short venue name and full address separately. */
  onSelect?: (venueName: string, fullAddress: string) => void;
}

function countryCodeToFlag(code: string): string {
  if (!code || code.length !== 2) return "📍";
  return String.fromCodePoint(
    ...code.toUpperCase().split("").map((c) => 127397 + c.charCodeAt(0))
  );
}

export function LocationInput({
  value,
  onChange,
  placeholder = "Ex: Paris, França",
  className,
  required,
  id,
  mode = "city",
  searchContext,
  onSelect,
}: LocationInputProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [touched, setTouched] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
    if (value) setValidated(true);
  }, [value]);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  const fetchSuggestions = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const contextualQ = searchContext ? `${q}, ${searchContext}` : q;
      const params = new URLSearchParams({
        q: contextualQ,
        format: "json",
        addressdetails: "1",
        limit: mode === "address" ? "8" : "7",
        "accept-language": "pt-BR,pt;q=0.9,en;q=0.5",
        ...(mode === "city" && { featuretype: "city,state,country" }),
      });
      const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
        headers: { "User-Agent": "RoteiroApp/1.0" },
      });
      const data = await res.json() as Record<string, unknown>[];

      const mapped: Suggestion[] = data
        .filter((r) => r.address)
        .map((r) => {
          const addr = r.address as Record<string, string>;
          const rawName = (r.name as string) ?? "";
          const city = addr.city ?? addr.town ?? addr.village ?? addr.municipality ?? rawName ?? "";
          const state = addr.state ?? addr.county ?? "";
          const country = addr.country ?? "";
          const countryCode = (addr.country_code ?? "").toUpperCase();
          const display = mode === "address"
            ? (r.display_name as string ?? "")
            : [city, state, country].filter(Boolean).filter((p, i, arr) => arr.indexOf(p) === i).join(", ");

          // Build a clean address from individual Nominatim fields
          const road = [addr.road, addr.house_number].filter(Boolean).join(", ");
          const neighborhood = addr.suburb ?? addr.neighbourhood ?? addr.city_district ?? "";
          const cityPart = city;
          const postcode = addr.postcode ?? "";
          const cleanAddress = [road, neighborhood, cityPart, postcode, state, country]
            .filter(Boolean)
            .filter((p, i, arr) => arr.indexOf(p) === i)
            .join(", ");

          return { display, cleanAddress: cleanAddress || display, name: rawName, city, state, country, countryCode };
        })
        .filter((s) => s.country && s.display);

      const seen = new Set<string>();
      const unique: Suggestion[] = [];
      for (const s of mapped) {
        if (!seen.has(s.display)) {
          seen.add(s.display);
          unique.push(s);
        }
      }

      setSuggestions(unique.slice(0, mode === "address" ? 6 : 6));
      setOpen(unique.length > 0);
      setActiveIdx(-1);
    } catch {
      setSuggestions([]);
    }
    setLoading(false);
  }, [mode, searchContext]);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    setValidated(false);
    setTouched(true);
    onChange(val, false);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(() => fetchSuggestions(val.trim()), 400);
  }

  function select(s: Suggestion) {
    const displayVal = onSelect ? (s.name || s.display) : s.display;
    setQuery(displayVal);
    onChange(displayVal, true);
    setValidated(true);
    setOpen(false);
    setSuggestions([]);
    onSelect?.(s.name || s.display, s.cleanAddress);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      select(suggestions[activeIdx]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const showError = required && touched && !validated && query.length > 0;

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          id={id}
          type="text"
          value={query}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onBlur={() => setTouched(true)}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          className={cn(
            "w-full h-10 rounded-xl border bg-white pl-9 pr-9 text-sm text-gray-900",
            "placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all",
            validated
              ? "border-green-400 focus:border-green-400 focus:ring-green-400/15"
              : showError
              ? "border-red-400 focus:border-red-400 focus:ring-red-400/15"
              : "border-gray-200 focus:border-primary-400 focus:ring-primary-400/15",
            className
          )}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 text-gray-300 animate-spin" />
          ) : validated ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
          ) : showError ? (
            <AlertCircle className="h-3.5 w-3.5 text-red-400" />
          ) : null}
        </div>
      </div>

      {showError && (
        <p className="mt-1 text-xs text-red-500">Selecione um local existente a partir das sugestões.</p>
      )}

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          {suggestions.map((s, i) => (
            <li key={s.display}>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); select(s); }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors",
                  i === activeIdx ? "bg-primary-50 text-primary-700" : "hover:bg-gray-50"
                )}
              >
                <span className="text-xl shrink-0 leading-none">{countryCodeToFlag(s.countryCode)}</span>
                <div className="min-w-0">
                  {mode === "address" ? (
                    <p className="text-sm text-gray-800 truncate">{s.display}</p>
                  ) : (
                    <>
                      <p className="font-semibold text-gray-900 truncate">{s.city || s.country}</p>
                      {s.city && (
                        <p className="text-xs text-gray-400 truncate">
                          {[s.state, s.country].filter(Boolean).join(", ")}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
