"use client";
import { confirmDialog } from "@/lib/confirm";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Plus, Trash2, Bus, TrainFront, Plane, Car, ChevronDown, ChevronUp, TrendingDown, ArrowLeftRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";
import { CURRENCIES } from "@/components/ui/currency-input";

// ── Types ──────────────────────────────────────────────────

type Mode = "bus" | "train" | "plane" | "car";

interface Quote {
  price: string;
  duration: string;
  company: string;
  notes: string;
}

interface Segment {
  id: string;
  from: string;
  to: string;
  date: string;
  quotes: Record<Mode, Quote>;
}

const EMPTY_QUOTE: Quote = { price: "", duration: "", company: "", notes: "" };

function emptySegment(id: string): Segment {
  return {
    id, from: "", to: "", date: "",
    quotes: {
      bus: { ...EMPTY_QUOTE }, train: { ...EMPTY_QUOTE },
      plane: { ...EMPTY_QUOTE }, car: { ...EMPTY_QUOTE },
    },
  };
}

// ── Mode config ────────────────────────────────────────────

const MODES: { key: Mode; label: Record<string, string>; icon: React.ElementType; color: string; bg: string; border: string }[] = [
  { key: "bus",   label: { pt: "Ônibus", es: "Autobús", en: "Bus" },   icon: Bus,        color: "text-green-700", bg: "bg-green-50", border: "border-green-200" },
  { key: "train", label: { pt: "Trem",   es: "Tren",    en: "Train" }, icon: TrainFront, color: "text-blue-700",  bg: "bg-blue-50",  border: "border-blue-200" },
  { key: "plane", label: { pt: "Avião",  es: "Avión",   en: "Plane" }, icon: Plane,      color: "text-sky-700",   bg: "bg-sky-50",   border: "border-sky-200" },
  { key: "car",   label: { pt: "Carro",  es: "Auto",    en: "Car" },   icon: Car,        color: "text-orange-700",bg: "bg-orange-50",border: "border-orange-200" },
];

// ── Helpers ────────────────────────────────────────────────

function parsePriceNum(val: string): number | null {
  const n = parseFloat(val.replace(",", ".").replace(/[^\d.]/g, ""));
  return isNaN(n) ? null : n;
}

function fmtNum(n: number, symbol: string): string {
  return `${symbol} ${n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getCurrencySymbol(code: string) {
  return CURRENCIES.find(c => c.code === code)?.symbol ?? code;
}

// ── SegmentCard ────────────────────────────────────────────

function SegmentCard({
  segment, index, currency, brlRate, onChange, onRemove,
}: {
  segment: Segment;
  index: number;
  currency: string;
  brlRate: number | null;
  onChange: (seg: Segment) => void;
  onRemove: () => void;
}) {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(true);
  const symbol = getCurrencySymbol(currency);
  const showConversion = brlRate !== null && currency !== "BRL";

  function setHeader(field: "from" | "to" | "date", value: string) {
    onChange({ ...segment, [field]: value });
  }

  function setQuote(mode: Mode, field: keyof Quote, value: string) {
    onChange({ ...segment, quotes: { ...segment.quotes, [mode]: { ...segment.quotes[mode], [field]: value } } });
  }

  const prices = MODES.map(m => ({ key: m.key, val: parsePriceNum(segment.quotes[m.key].price) }))
    .filter(x => x.val !== null) as { key: Mode; val: number }[];
  const cheapest = prices.length > 0 ? prices.reduce((a, b) => a.val < b.val ? a : b) : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
        <span className="w-6 h-6 rounded-full bg-primary-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
          {index + 1}
        </span>
        <div className="flex-1 flex items-center gap-2 flex-wrap min-w-0">
          <input value={segment.from} onChange={e => setHeader("from", e.target.value)} placeholder="Origem"
            className="h-8 w-36 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400/20" />
          <span className="text-gray-400 font-bold">→</span>
          <input value={segment.to} onChange={e => setHeader("to", e.target.value)} placeholder="Destino"
            className="h-8 w-36 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400/20" />
          <input type="date" value={segment.date} onChange={e => setHeader("date", e.target.value)}
            className="h-8 w-38 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400/20" />
          {cheapest && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200 ml-1">
              <TrendingDown className="h-3 w-3" />
              Menor: {fmtNum(cheapest.val, symbol)} ({MODES.find(m => m.key === cheapest.key)?.label[lang] ?? cheapest.key})
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => setOpen(v => !v)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <button onClick={onRemove} className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      {open && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide w-28">Meio</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide w-48">
                  Valor ({symbol})
                  {showConversion && <span className="ml-1 text-[10px] text-gray-400 font-normal">+ conversão BRL</span>}
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide w-32">Duração</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide w-40">Empresa / Cia</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Observações</th>
              </tr>
            </thead>
            <tbody>
              {MODES.map((mode, i) => {
                const q = segment.quotes[mode.key];
                const Icon = mode.icon;
                const isCheapest = cheapest?.key === mode.key;
                const priceNum = parsePriceNum(q.price);
                const brlEquiv = showConversion && priceNum !== null && brlRate !== null ? priceNum * brlRate : null;
                return (
                  <tr key={mode.key} className={cn("border-b last:border-0 transition-colors", isCheapest ? "bg-green-50/60" : i % 2 === 0 ? "bg-white" : "bg-gray-50/30")}>
                    <td className="px-4 py-2.5">
                      <div className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold", mode.bg, mode.color, "border", mode.border)}>
                        <Icon className="h-3.5 w-3.5" />
                        {mode.label[lang] ?? mode.label.pt}
                        {isCheapest && <TrendingDown className="h-3 w-3 text-green-600" />}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div>
                        <div className="flex items-center h-8 w-36 rounded-lg border border-gray-200 bg-white focus-within:border-primary-400 focus-within:ring-1 focus-within:ring-primary-400/20 overflow-hidden">
                          <span className="px-2 text-xs font-bold text-gray-500 shrink-0 border-r border-gray-200 bg-gray-50 h-full flex items-center">{symbol}</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={q.price}
                            onChange={e => setQuote(mode.key, "price", e.target.value)}
                            placeholder="0,00"
                            className="flex-1 h-full px-2 text-sm font-medium focus:outline-none bg-transparent"
                          />
                        </div>
                        {brlEquiv !== null && (
                          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                            <ArrowLeftRight className="h-2.5 w-2.5" />
                            R$ {brlEquiv.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <input value={q.duration} onChange={e => setQuote(mode.key, "duration", e.target.value)} placeholder="Ex: 2h30"
                        className="h-8 w-28 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400/20" />
                    </td>
                    <td className="px-4 py-2">
                      <input value={q.company} onChange={e => setQuote(mode.key, "company", e.target.value)} placeholder="Ex: LATAM, Cometa..."
                        className="h-8 w-36 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400/20" />
                    </td>
                    <td className="px-4 py-2">
                      <input value={q.notes} onChange={e => setQuote(mode.key, "notes", e.target.value)} placeholder="Observações..."
                        className="h-8 w-full min-w-[120px] rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400/20" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Summary Table ──────────────────────────────────────────

function SummaryTable({ segments, currency, brlRate }: { segments: Segment[]; currency: string; brlRate: number | null }) {
  const { lang } = useLanguage();
  const symbol = getCurrencySymbol(currency);
  const showConversion = brlRate !== null && currency !== "BRL";

  const modeTotals = MODES.map(mode => {
    const prices = segments.map(s => parsePriceNum(s.quotes[mode.key].price));
    const allFilled = prices.every(p => p !== null);
    const total = allFilled ? prices.reduce((a, b) => a! + b!, 0)! : null;
    return { mode, total, allFilled };
  });

  const validTotals = modeTotals.filter(m => m.total !== null) as { mode: (typeof MODES)[number]; total: number }[];
  if (validTotals.length === 0) return null;

  const cheapestTotal = validTotals.reduce((a, b) => a.total < b.total ? a : b);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-white">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-green-600" />
          Resumo Comparativo — Todos os Trechos
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Calculado para {segments.length} trecho{segments.length !== 1 ? "s" : ""}
          {showConversion && <span className="ml-1 text-emerald-600">· com conversão para BRL</span>}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/40">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Meio</th>
              {segments.map((s, i) => (
                <th key={s.id} className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Trecho {i + 1}{s.from && s.to ? `: ${s.from} → ${s.to}` : ""}
                </th>
              ))}
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide">Total ({symbol})</th>
              {showConversion && <th className="text-right px-5 py-3 text-xs font-semibold text-emerald-700 uppercase tracking-wide">Total (BRL)</th>}
            </tr>
          </thead>
          <tbody>
            {MODES.map(mode => {
              const Icon = mode.icon;
              const prices = segments.map(s => parsePriceNum(s.quotes[mode.key].price));
              const total = prices.every(p => p !== null) ? prices.reduce((a, b) => a! + b!, 0) : null;
              const isCheapest = total !== null && cheapestTotal.mode.key === mode.key;
              const brlTotal = showConversion && total !== null && brlRate !== null ? total * brlRate : null;

              return (
                <tr key={mode.key} className={cn("border-b last:border-0", isCheapest ? "bg-green-50/60" : "")}>
                  <td className="px-5 py-3">
                    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold", mode.bg, mode.color, "border", mode.border)}>
                      <Icon className="h-3.5 w-3.5" />
                      {mode.label[lang] ?? mode.label.pt}
                      {isCheapest && <span className="ml-1 text-green-600 font-bold">✓ Menor</span>}
                    </div>
                  </td>
                  {segments.map(s => {
                    const p = parsePriceNum(s.quotes[mode.key].price);
                    return (
                      <td key={s.id} className="text-right px-4 py-3 font-medium text-gray-700">
                        {p !== null ? fmtNum(p, symbol) : <span className="text-gray-300">—</span>}
                      </td>
                    );
                  })}
                  <td className={cn("text-right px-5 py-3 font-bold", isCheapest ? "text-green-700" : "text-gray-900")}>
                    {total !== null ? fmtNum(total, symbol) : <span className="text-gray-300">—</span>}
                  </td>
                  {showConversion && (
                    <td className={cn("text-right px-5 py-3 font-bold", isCheapest ? "text-emerald-700" : "text-emerald-600")}>
                      {brlTotal !== null ? `R$ ${brlTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : <span className="text-gray-300">—</span>}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {cheapestTotal && (
        <div className="px-5 py-3 bg-green-50 border-t border-green-100 space-y-0.5">
          <p className="text-sm text-green-700 font-semibold flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Opção mais econômica: <span className="font-bold">{cheapestTotal.mode.label[lang] ?? cheapestTotal.mode.label.pt}</span>
            {" — "}{fmtNum(cheapestTotal.total, symbol)} no total
          </p>
          {showConversion && brlRate !== null && (
            <p className="text-xs text-emerald-600 font-medium pl-6">
              ≈ R$ {(cheapestTotal.total * brlRate).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} em reais (cotação do dia)
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────

export default function ComparePage() {
  const { id } = useParams<{ id: string }>();
  const storageKey = `compare-${id}`;

  const [segments, setSegments] = useState<Segment[]>(() => {
    if (typeof window !== "undefined") {
      try { const stored = localStorage.getItem(`compare-${id}`); if (stored) return JSON.parse(stored); } catch {}
    }
    return [emptySegment(crypto.randomUUID())];
  });

  const [currency, setCurrency] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(`compare-currency-${id}`) ?? "BRL";
    }
    return "BRL";
  });
  const [brlRate, setBrlRate] = useState<number | null>(null);
  const [rateLoading, setRateLoading] = useState(false);
  const [rateError, setRateError] = useState("");
  const [rateDate, setRateDate] = useState("");

  // Persist segments
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(storageKey, JSON.stringify(segments));
  }, [segments, storageKey]);

  // Persist currency
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(`compare-currency-${id}`, currency);
  }, [currency, id]);

  // Fetch live rate whenever currency changes
  const fetchRate = useCallback(async (cur: string) => {
    if (cur === "BRL") { setBrlRate(null); setRateError(""); setRateDate(""); return; }
    setRateLoading(true);
    setRateError("");
    try {
      const res = await fetch(`/api/exchange-rate?from=${cur}&to=BRL`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBrlRate(data.rates?.BRL ?? null);
      setRateDate(data.date ?? "");
    } catch {
      setRateError("Não foi possível obter a cotação. Verifique sua conexão.");
      setBrlRate(null);
    } finally {
      setRateLoading(false);
    }
  }, []);

  useEffect(() => { fetchRate(currency); }, [currency, fetchRate]);

  const updateSegment = useCallback((updated: Segment) => {
    setSegments(prev => prev.map(s => s.id === updated.id ? updated : s));
  }, []);

  function addSegment() { setSegments(prev => [...prev, emptySegment(crypto.randomUUID())]); }
  function removeSegment(segId: string) { setSegments(prev => prev.filter(s => s.id !== segId)); }
  async function clearAll() { if (!(await confirmDialog("Limpar todas as cotações?"))) return; setSegments([emptySegment(crypto.randomUUID())]); }

  return (
    <div className="space-y-6 pb-10">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Cotação de Transportes</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Compare preços entre meios de transporte. A tabela é gerada automaticamente.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={clearAll} className="text-xs text-gray-400 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg border border-gray-200 hover:border-red-200">
            Limpar tudo
          </button>
          <Button onClick={addSegment} size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> Adicionar Trecho
          </Button>
        </div>
      </div>

      {/* Currency selector + live rate banner */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4 text-primary-500 shrink-0" />
            <span className="text-sm font-semibold text-gray-700">Moeda dos valores:</span>
          </div>
          <select
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            className="h-9 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/15"
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </select>

          {currency !== "BRL" && (
            <div className="flex items-center gap-2 ml-auto">
              {rateLoading && (
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <RefreshCw className="h-3 w-3 animate-spin" /> Obtendo cotação...
                </span>
              )}
              {!rateLoading && brlRate !== null && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5">
                  <span className="text-xs font-bold text-emerald-700">
                    1 {currency} = R$ {brlRate.toLocaleString("pt-BR", { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                  </span>
                  {rateDate && <span className="text-[10px] text-emerald-500">· {rateDate}</span>}
                  <button onClick={() => fetchRate(currency)} title="Atualizar cotação" className="text-emerald-400 hover:text-emerald-600">
                    <RefreshCw className="h-3 w-3" />
                  </button>
                </div>
              )}
              {!rateLoading && rateError && (
                <span className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-1.5">{rateError}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {MODES.map(mode => {
          const Icon = mode.icon;
          return (
            <div key={mode.key} className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border", mode.bg, mode.color, mode.border)}>
              <Icon className="h-3.5 w-3.5" />
              {mode.label.pt}
            </div>
          );
        })}
        <span className="text-xs text-gray-400 self-center ml-1">— clique nos campos para editar</span>
      </div>

      {/* Segments */}
      <div className="space-y-4">
        {segments.map((segment, i) => (
          <SegmentCard
            key={segment.id}
            segment={segment}
            index={i}
            currency={currency}
            brlRate={brlRate}
            onChange={updateSegment}
            onRemove={() => removeSegment(segment.id)}
          />
        ))}
      </div>

      <button onClick={addSegment} className="w-full py-3 rounded-2xl border-2 border-dashed border-gray-200 text-sm text-gray-400 hover:border-primary-300 hover:text-primary-500 transition-colors flex items-center justify-center gap-2">
        <Plus className="h-4 w-4" /> Adicionar outro trecho
      </button>

      {segments.length > 0 && <SummaryTable segments={segments} currency={currency} brlRate={brlRate} />}

      <p className="text-xs text-gray-400 text-center">
        Dados salvos no navegador · Cotações via{" "}
        <a href="https://www.frankfurter.app" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Frankfurter</a>
        {" "}(European Central Bank)
      </p>
    </div>
  );
}
