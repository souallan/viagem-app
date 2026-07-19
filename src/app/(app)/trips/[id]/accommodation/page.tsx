"use client";
import { confirmDialog } from "@/lib/confirm";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  Plus, Calendar, Phone, MapPin, Trash2, BedDouble,
  ChevronLeft, ChevronRight, Globe, Pencil, ExternalLink, Search,
} from "lucide-react";
import { CURRENCIES } from "@/components/ui/currency-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationInput } from "@/components/ui/location-input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { PhotoUpload } from "@/components/ui/photo-upload";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { affiliates } from "@/lib/affiliates";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";

// ── Types ────────────────────────────────────────────────────

interface Accommodation {
  id: string;
  name: string;
  type: string;
  address: string | null;
  checkIn: string;
  checkOut: string;
  confirmationNumber: string | null;
  phone: string | null;
  website: string | null;
  cost: number | null;
  currency: string;
  notes: string | null;
  attachmentUrl: string | null;
}

function getCurrencySymbol(code: string): string {
  return CURRENCIES.find(c => c.code === code)?.symbol ?? code;
}

// ── Constants ────────────────────────────────────────────────

const ACCOM_TYPE_KEYS = ["HOTEL", "HOSTEL", "AIRBNB", "RESORT", "POUSADA", "OTHER"] as const;

const TYPE_STYLE: Record<string, { bg: string; text: string; bar: string }> = {
  HOTEL:   { bg: "bg-primary-50",   text: "text-primary-700",   bar: "bg-primary-400"   },
  HOSTEL:  { bg: "bg-teal-50",  text: "text-teal-700",  bar: "bg-teal-400"  },
  AIRBNB:  { bg: "bg-rose-50",  text: "text-rose-700",  bar: "bg-rose-400"  },
  RESORT:  { bg: "bg-amber-50", text: "text-amber-700", bar: "bg-amber-400" },
  POUSADA: { bg: "bg-green-50", text: "text-green-700", bar: "bg-green-400" },
  OTHER:   { bg: "bg-gray-50",  text: "text-gray-600",  bar: "bg-gray-300"  },
};

// Hex + gradient pairs for calendar bars (Tailwind purges dynamic classes)
const TYPE_HEX: Record<string, string> = {
  HOTEL:   "#38bdf8",
  HOSTEL:  "#2dd4bf",
  AIRBNB:  "#fb7185",
  RESORT:  "#fbbf24",
  POUSADA: "#4ade80",
  OTHER:   "#9ca3af",
};

const TYPE_GRADIENT: Record<string, [string, string]> = {
  HOTEL:   ["#38bdf8", "#0ea5e9"],
  HOSTEL:  ["#2dd4bf", "#0d9488"],
  AIRBNB:  ["#fb7185", "#f43f5e"],
  RESORT:  ["#fbbf24", "#f59e0b"],
  POUSADA: ["#4ade80", "#16a34a"],
  OTHER:   ["#9ca3af", "#6b7280"],
};

const TYPE_EMOJI: Record<string, string> = {
  HOTEL: "🏨", HOSTEL: "🛏️", AIRBNB: "🏠", RESORT: "🌴", POUSADA: "🏡", OTHER: "📍",
};

// ── Helpers ──────────────────────────────────────────────────

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function nightsCount(checkIn: string, checkOut: string): number {
  return Math.max(0, Math.round(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000
  ));
}

function accomStatus(item: Accommodation): "upcoming" | "active" | "past" {
  const now = Date.now();
  const cin  = new Date(item.checkIn).getTime();
  const cout = new Date(item.checkOut).getTime();
  if (now < cin) return "upcoming";
  if (now <= cout) return "active";
  return "past";
}

// ── Calendar component ────────────────────────────────────────

function AccommodationCalendar({
  items,
  onSelect,
}: {
  items: Accommodation[];
  onSelect: (a: Accommodation) => void;
}) {
  const { t, lang } = useLanguage();
  const locale = lang === "pt" ? "pt-BR" : lang === "es" ? "es-ES" : "en-US";
  const todayKey = toDateKey(new Date());

  const initialMonth = useMemo(() => {
    if (items.length === 0) return new Date();
    const earliest = [...items].sort((a, b) => a.checkIn.localeCompare(b.checkIn))[0];
    const d = new Date(earliest.checkIn);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }, [items]);

  const [month, setMonth] = useState(initialMonth);

  useEffect(() => { setMonth(initialMonth); }, [initialMonth]);

  const year     = month.getFullYear();
  const monthIdx = month.getMonth();

  const weeks = useMemo(() => {
    const firstDow  = new Date(year, monthIdx, 1).getDay();
    const daysInMon = new Date(year, monthIdx + 1, 0).getDate();
    const cells: Array<Date | null> = [];
    for (let i = 0; i < firstDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMon; d++) cells.push(new Date(year, monthIdx, d));
    while (cells.length % 7 !== 0) cells.push(null);
    const rows: Array<Array<Date | null>> = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
    return rows;
  }, [year, monthIdx]);

  const sorted = useMemo(() =>
    [...items].sort((a, b) => a.checkIn.localeCompare(b.checkIn)),
  [items]);

  function getAccomsForDay(dateKey: string): Accommodation[] {
    return sorted.filter(
      (a) => a.checkIn.slice(0, 10) <= dateKey && a.checkOut.slice(0, 10) >= dateKey
    );
  }

  function prevMonth() { setMonth(new Date(year, monthIdx - 1, 1)); }
  function nextMonth() { setMonth(new Date(year, monthIdx + 1, 1)); }

  const totalNights = items.reduce((s, a) => s + nightsCount(a.checkIn, a.checkOut), 0);

  return (
    <div className="rounded-3xl overflow-hidden shadow-lg border border-white/60" style={{
      background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #fdf4ff 100%)",
    }}>
      {/* ── Gradient header ── */}
      <div
        className="relative px-4 py-3 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #1a56cc 60%, #6d28d9 100%)" }}
      >
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }} />

        <div className="relative z-10 flex items-center justify-between">
          <button onClick={prevMonth} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-all">
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="text-center">
            <p className="text-white font-black text-base tracking-tight leading-none capitalize">
              {new Intl.DateTimeFormat(locale, { month: "long" }).format(new Date(year, monthIdx, 1))}
            </p>
            <p className="text-white/60 text-[10px] font-semibold tracking-widest mt-0.5">{year}</p>
          </div>

          <button onClick={nextMonth} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-all">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {items.length > 0 && (
          <div className="relative z-10 flex items-center justify-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-white/80 bg-white/10 border border-white/20 px-2.5 py-0.5 rounded-full">
              <BedDouble className="h-2.5 w-2.5" />
              {items.length} {items.length === 1 ? t.accommodation.accommodationSingular : t.accommodation.accommodationPlural}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-white/80 bg-white/10 border border-white/20 px-2.5 py-0.5 rounded-full">
              <Calendar className="h-2.5 w-2.5" />
              {totalNights} {totalNights === 1 ? t.accommodation.nightSingular : t.accommodation.nightPlural}
            </span>
          </div>
        )}
      </div>

      {/* ── Day-of-week headers ── */}
      <div className="overflow-x-auto">
      <div className="min-w-[560px]">
      <div className="grid grid-cols-7 border-b border-primary-100/80 bg-white/50">
        {Array.from({ length: 7 }, (_, i) =>
          new Intl.DateTimeFormat(locale, { weekday: "short" }).format(new Date(2024, 0, 7 + i))
        ).map((d, i) => (
          <div key={i} className={cn(
            "text-center text-[10px] font-black py-1.5 uppercase tracking-wider",
            i === 0 || i === 6 ? "text-rose-400" : "text-slate-400"
          )}>
            {d.replace(".", "").substring(0, 2)}
          </div>
        ))}
      </div>

      {/* ── Week rows ── */}
      <div className="bg-white/40">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 border-b border-primary-100/50 last:border-b-0">
            {week.map((date, di) => {
              if (!date) {
                return (
                  <div
                    key={di}
                    className={cn(
                      "h-16 sm:h-20 border-r border-primary-100/50 last:border-r-0",
                      di === 0 || di === 6 ? "bg-rose-50/30" : "bg-white/20"
                    )}
                  />
                );
              }

              const dateKey   = toDateKey(date);
              const isToday   = dateKey === todayKey;
              const accoms    = getAccomsForDay(dateKey);
              const isWeekend = di === 0 || di === 6;

              return (
                <div
                  key={di}
                  className={cn(
                    "h-16 sm:h-20 border-r border-primary-100/50 last:border-r-0 flex flex-col min-w-0",
                    isWeekend ? "bg-rose-50/20" : "bg-white/30",
                    accoms.length > 0 && "bg-primary-50/40"
                  )}
                >
                  {/* Date number */}
                  <div className="flex justify-end px-1 pt-1 pb-0.5 shrink-0">
                    <span className={cn(
                      "w-6 h-6 text-[11px] font-bold flex items-center justify-center rounded-full transition-all",
                      isToday
                        ? "bg-gradient-to-br from-primary-500 to-violet-600 text-white shadow-sm"
                        : isWeekend ? "text-rose-400/70" : "text-gray-500"
                    )}>
                      {date.getDate()}
                    </span>
                  </div>

                  {/* Accommodation bars */}
                  <div className="flex-1 flex flex-col gap-[2px] overflow-hidden pb-1">
                    {accoms.slice(0, 2).map((accom, idx) => {
                      const isStart = accom.checkIn.slice(0, 10) === dateKey || di === 0;
                      const isEnd   = accom.checkOut.slice(0, 10) === dateKey || di === 6;
                      const [c1, c2] = TYPE_GRADIENT[accom.type] ?? ["#9ca3af", "#6b7280"];
                      return (
                        <button
                          key={accom.id + idx}
                          onClick={() => onSelect(accom)}
                          title={accom.name}
                          className="h-[18px] sm:h-[20px] flex items-center text-white text-[10px] font-bold overflow-hidden transition-all hover:brightness-110 active:opacity-70 shadow-sm"
                          style={{
                            background: `linear-gradient(90deg, ${c1}, ${c2})`,
                            marginLeft:  isStart ? "4px" : "0",
                            marginRight: isEnd   ? "4px" : "0",
                            borderRadius: `${isStart ? "99px" : "0"} ${isEnd ? "99px" : "0"} ${isEnd ? "99px" : "0"} ${isStart ? "99px" : "0"}`,
                          }}
                        >
                          <span className="truncate px-1.5 leading-none drop-shadow-sm">
                            {isStart ? `${TYPE_EMOJI[accom.type]} ${accom.name}` : ""}
                          </span>
                        </button>
                      );
                    })}
                    {accoms.length > 2 && (
                      <span className="text-[10px] text-primary-500 font-bold px-1 leading-none">
                        +{accoms.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      </div>
      </div>

      {/* ── Legend ── */}
      {items.length > 0 && (
        <div className="px-3 py-3 border-t border-primary-100/60 bg-white/60">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{t.accommodation.legend}</p>
          <div className="flex flex-wrap gap-1.5">
            {sorted.map((item) => {
              const [c1, c2] = TYPE_GRADIENT[item.type] ?? ["#9ca3af", "#6b7280"];
              const nights   = nightsCount(item.checkIn, item.checkOut);
              return (
                <button
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/80 bg-white/70 hover:bg-white hover:shadow-sm transition-all text-left"
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }} />
                  <span className="text-[10px] font-bold text-gray-800">{item.name}</span>
                  <span className="text-[9px] text-gray-400">
                    {item.checkIn.slice(5, 10).replace("-", "/")} → {item.checkOut.slice(5, 10).replace("-", "/")}
                  </span>
                  <span className="text-[9px] font-bold px-1 py-0.5 rounded-full text-white leading-none" style={{ background: `linear-gradient(90deg, ${c1}, ${c2})` }}>
                    {nights}n
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Detail dialog ─────────────────────────────────────────────

function AccommodationDetail({
  item,
  onClose,
  onEdit,
  onDelete,
}: {
  item: Accommodation;
  onClose: () => void;
  onEdit: (item: Accommodation) => void;
  onDelete: (id: string) => void;
}) {
  const { t } = useLanguage();
  const style  = TYPE_STYLE[item.type] ?? TYPE_STYLE.OTHER;
  const status = accomStatus(item);
  const nights = nightsCount(item.checkIn, item.checkOut);
  const hex    = TYPE_HEX[item.type] ?? "#9ca3af";

  return (
    <Dialog open onClose={onClose}>
      <DialogHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: hex + "22" }}>
            <BedDouble className="h-5 w-5" style={{ color: hex }} />
          </div>
          <div className="min-w-0">
            <DialogTitle>{item.name}</DialogTitle>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", style.bg, style.text)}>
                {(t.accommodationTypes as Record<string, string>)[item.type] ?? item.type}
              </span>
              {status === "active" && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                  {t.accommodation.activeNow}
                </span>
              )}
              {status === "upcoming" && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                  {t.accommodation.upcomingBadge}
                </span>
              )}
            </div>
          </div>
        </div>
        <DialogClose onClose={onClose} />
      </DialogHeader>

      <DialogBody className="space-y-4">
        {/* Date range */}
        <div className="flex items-center gap-3 rounded-xl p-4" style={{ backgroundColor: hex + "12" }}>
          <div className="flex-1 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: hex }}>Check-in</p>
            <p className="text-sm font-bold text-gray-800 mt-0.5">{formatDate(item.checkIn)}</p>
            {(() => { const t = new Date(item.checkIn); const h = t.getHours(), m = t.getMinutes(); return (h || m) ? <p className="text-xs text-gray-500 mt-0.5">{String(h).padStart(2,"0")}:{String(m).padStart(2,"0")}</p> : null; })()}
          </div>
          <div className="flex flex-col items-center gap-0.5 shrink-0">
            <div className="flex items-center gap-1">
              <div className="w-6 h-px" style={{ backgroundColor: hex + "60" }} />
              <Calendar className="h-3.5 w-3.5" style={{ color: hex }} />
              <div className="w-6 h-px" style={{ backgroundColor: hex + "60" }} />
            </div>
            <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">
              {nights} {nights === 1 ? t.accommodation.nightSingular : t.accommodation.nightPlural}
            </span>
          </div>
          <div className="flex-1 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: hex }}>Check-out</p>
            <p className="text-sm font-bold text-gray-800 mt-0.5">{formatDate(item.checkOut)}</p>
            {(() => { const t = new Date(item.checkOut); const h = t.getHours(), m = t.getMinutes(); return (h || m) ? <p className="text-xs text-gray-500 mt-0.5">{String(h).padStart(2,"0")}:{String(m).padStart(2,"0")}</p> : null; })()}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2.5">
          {item.address && (
            <div className="flex items-start gap-2.5 text-sm text-gray-700">
              <MapPin className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
              <span>{item.address}</span>
            </div>
          )}
          {item.phone && (
            <div className="flex items-center gap-2.5 text-sm text-gray-700">
              <Phone className="h-4 w-4 text-gray-400 shrink-0" />
              <span>{item.phone}</span>
            </div>
          )}
          {item.website && (
            <div className="flex items-center gap-2.5 text-sm">
              <Globe className="h-4 w-4 text-gray-400 shrink-0" />
              <a href={item.website} target="_blank" rel="noopener noreferrer"
                className="text-primary-600 hover:underline truncate">
                {item.website}
              </a>
            </div>
          )}
          {item.confirmationNumber && (
            <div className="flex items-center gap-2 text-sm text-gray-700 font-mono bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
              <span className="text-gray-400 font-sans text-xs font-medium">{t.accommodation.confirmation}</span>
              <span className="font-bold">{item.confirmationNumber}</span>
            </div>
          )}
          {item.cost != null && (
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
              {getCurrencySymbol(item.currency)} {item.cost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          )}
          {item.notes && (
            <p className="text-sm text-gray-500 italic bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
              {item.notes}
            </p>
          )}
        </div>
      </DialogBody>

      <DialogFooter>
        <button
          onClick={() => { onDelete(item.id); onClose(); }}
          className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          {t.accommodation.delete}
        </button>
        <div className="flex-1" />
        <Button variant="outline" onClick={onClose}>{t.accommodation.close}</Button>
        <Button onClick={() => { onClose(); onEdit(item); }} className="gap-1.5">
          <Pencil className="h-3.5 w-3.5" />
          {t.common.edit}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

// ── Page ─────────────────────────────────────────────────────

const EMPTY_FORM = {
  name: "", type: "HOTEL", address: "", checkIn: "", checkInTime: "", checkOut: "", checkOutTime: "",
  confirmationNumber: "", phone: "", website: "", cost: "", currency: "BRL", notes: "", attachmentUrl: "",
};

// ── Affiliate banner ──────────────────────────────────────────

function AffiliateBanner({ destination }: { destination: string }) {
  const { t } = useLanguage();
  const partners = affiliates.accommodation;

  return (
    <div className="rounded-2xl border border-primary-100 bg-gradient-to-r from-primary-50 to-primary-100/60 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
        <Search className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-blue-900">{t.accommodation.affiliateTitle}</p>
        <p className="text-xs text-blue-600 mt-0.5">
          {t.accommodation.affiliateDesc} {destination || t.accommodation.yourDestination}.
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        {partners.map((p) => {
          const url = destination && p.buildUrl ? p.buildUrl(destination) : p.url;
          return (
            <a
              key={p.id}
              href={url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {p.name}
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default function AccommodationPage() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const [items, setItems] = useState<Accommodation[]>([]);
  const [tripDestination, setTripDestination] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Accommodation | null>(null);

  async function load() {
    const [accomRes, tripRes] = await Promise.all([
      fetch(`/api/trips/${id}/accommodations`),
      fetch(`/api/trips/${id}`),
    ]);
    if (accomRes.ok) setItems(await accomRes.json());
    if (tripRes.ok) {
      const trip = await tripRes.json();
      setTripDestination(trip.destination?.split(" → ")[0]?.trim() ?? "");
    }
  }

  useEffect(() => { load(); }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function openEdit(item: Accommodation) {
    const ciDate = item.checkIn.slice(0, 10);
    const ciTime = (() => { const d = new Date(item.checkIn); const h = d.getHours(), m = d.getMinutes(); return (h || m) ? `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}` : ""; })();
    const coDate = item.checkOut.slice(0, 10);
    const coTime = (() => { const d = new Date(item.checkOut); const h = d.getHours(), m = d.getMinutes(); return (h || m) ? `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}` : ""; })();
    setForm({
      name: item.name, type: item.type, address: item.address ?? "",
      checkIn: ciDate, checkInTime: ciTime, checkOut: coDate, checkOutTime: coTime,
      confirmationNumber: item.confirmationNumber ?? "", phone: item.phone ?? "",
      website: item.website ?? "", cost: item.cost != null ? String(item.cost) : "",
      currency: item.currency ?? "BRL", notes: item.notes ?? "", attachmentUrl: item.attachmentUrl ?? "",
    });
    setEditingId(item.id);
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!form.name.trim()) { setFormError(t.accommodation.errorName); return; }
    if (!form.checkIn)     { setFormError(t.accommodation.errorCheckIn); return; }
    if (!form.checkOut)    { setFormError(t.accommodation.errorCheckOut); return; }
    if (form.checkOut < form.checkIn) { setFormError(t.accommodation.errorDates); return; }
    setLoading(true);
    try {
      const payload = {
        ...form,
        checkIn:  form.checkIn  + (form.checkInTime  ? `T${form.checkInTime}`  : "T15:00"),
        checkOut: form.checkOut + (form.checkOutTime ? `T${form.checkOutTime}` : "T12:00"),
        ...(editingId && { itemId: editingId }),
      };
      const res = await fetch(`/api/trips/${id}/accommodations`, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setOpen(false);
        setEditingId(null);
        setForm(EMPTY_FORM);
        load();
      } else {
        const data = await res.json().catch(() => ({}));
        setFormError(data.error ?? t.accommodation.errorSave);
      }
    } catch {
      setFormError(t.accommodation.errorNetwork);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(itemId: string) {
    if (!(await confirmDialog(t.accommodation.confirmDelete))) return;
    await fetch(`/api/trips/${id}/accommodations`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId }),
    });
    load();
  }

  const sorted = useMemo(() =>
    [...items].sort((a, b) => a.checkIn.localeCompare(b.checkIn)),
  [items]);

  return (
    <div className="space-y-6">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{
            background: "linear-gradient(135deg, #1a56cc, #6d28d9)",
          }}>
            <BedDouble className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{t.accommodation.headerTitle}</h2>
            {items.length > 0 && (
              <p className="text-sm text-gray-400 mt-0.5">
                {items.length} {items.length === 1 ? t.accommodation.accommodationSingular : t.accommodation.accommodationPlural} · {sorted.reduce((s, a) => s + nightsCount(a.checkIn, a.checkOut), 0)} {t.accommodation.nightPlural}
              </p>
            )}
          </div>
        </div>
        <Button onClick={() => { setOpen(true); setFormError(""); }} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> {t.accommodation.add}
        </Button>
      </div>

      {/* ── Affiliate banner ── */}
      <AffiliateBanner destination={tripDestination} />

      {/* ── Empty state ── */}
      {items.length === 0 && (
        <div className="text-center py-16 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <div className="text-5xl mb-3">🏨</div>
          <p className="font-semibold text-gray-500">{t.accommodation.emptyTitle}</p>
          <p className="text-sm mt-1">{t.accommodation.emptyDesc}</p>
          <Button onClick={() => { setOpen(true); setFormError(""); }} className="mt-5 gap-2" size="sm" variant="outline">
            <Plus className="h-4 w-4" /> {t.accommodation.addFirst}
          </Button>
        </div>
      )}

      {/* ── Calendar ── */}
      {items.length > 0 && (
        <AccommodationCalendar items={items} onSelect={setSelected} />
      )}

      {/* ── Accommodation list ── */}
      {sorted.length > 0 && (
        <div className="space-y-3">
          {sorted.map((item) => {
            const status   = accomStatus(item);
            const nights   = nightsCount(item.checkIn, item.checkOut);
            const [c1, c2] = TYPE_GRADIENT[item.type] ?? ["#9ca3af", "#6b7280"];
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden cursor-pointer group"
                onClick={() => setSelected(item)}
              >
                {/* Gradient top bar */}
                <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${c1}, ${c2})` }} />

                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-xl" style={{ background: `linear-gradient(135deg, ${c1}22, ${c2}33)`, border: `1.5px solid ${c1}44` }}>
                        {TYPE_EMOJI[item.type]}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 leading-tight">{item.name}</h4>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: `linear-gradient(90deg, ${c1}, ${c2})` }}>
                            {TYPE_EMOJI[item.type]} {(t.accommodationTypes as Record<string, string>)[item.type] ?? item.type}
                          </span>
                          {status === "active" && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200 animate-pulse">
                              {t.accommodation.activeNow}
                            </span>
                          )}
                          {status === "upcoming" && (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                              {t.accommodation.upcomingBadge}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100">
                      <button
                        onClick={(e) => { e.stopPropagation(); openEdit(item); }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-primary-500 hover:bg-primary-50 transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-200 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Date row */}
                  <div className="flex items-center gap-3 rounded-2xl p-3 mb-3" style={{ background: `linear-gradient(90deg, ${c1}14, ${c2}14)`, border: `1px solid ${c1}25` }}>
                    <div className="flex-1 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest mb-0.5" style={{ color: c1 }}>Check-in</p>
                      <p className="text-sm font-bold text-gray-800">{formatDate(item.checkIn)}</p>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 shrink-0 px-2">
                      <div className="flex items-center gap-1">
                        <div className="w-5 h-px" style={{ backgroundColor: c1 + "60" }} />
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-black" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
                          {nights}
                        </div>
                        <div className="w-5 h-px" style={{ backgroundColor: c2 + "60" }} />
                      </div>
                      <span className="text-[9px] font-semibold whitespace-nowrap" style={{ color: c1 }}>
                        {nights === 1 ? t.accommodation.nightSingular : t.accommodation.nightPlural}
                      </span>
                    </div>
                    <div className="flex-1 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest mb-0.5" style={{ color: c2 }}>Check-out</p>
                      <p className="text-sm font-bold text-gray-800">{formatDate(item.checkOut)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {item.address && (
                      <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">
                        <MapPin className="h-3 w-3 text-gray-400 shrink-0" />
                        <span className="truncate max-w-[200px]">{item.address}</span>
                      </span>
                    )}
                    {item.confirmationNumber && (
                      <span className="text-xs text-gray-600 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg font-mono">
                        # {item.confirmationNumber}
                      </span>
                    )}
                    {item.attachmentUrl && (
                      <a href={item.attachmentUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-semibold text-primary-600 bg-primary-50 border border-primary-100 px-2.5 py-1 rounded-lg hover:bg-primary-100 transition-colors">
                        📷 Comprovante
                      </a>
                    )}
                    {item.phone && (
                      <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">
                        <Phone className="h-3 w-3" /> {item.phone}
                      </span>
                    )}
                    {item.cost != null && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">
                        {getCurrencySymbol(item.currency)} {item.cost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    )}
                  </div>

                  {item.notes && (
                    <p className="text-xs text-gray-400 italic mt-3 pt-3 border-t border-gray-100">{item.notes}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add/Edit dialog ── */}
      <Dialog open={open} onClose={() => { setOpen(false); setEditingId(null); setForm(EMPTY_FORM); }}>
        <DialogHeader>
          <DialogTitle>{editingId ? t.accommodation.dialogEdit : t.accommodation.dialogNew}</DialogTitle>
          <DialogClose onClose={() => { setOpen(false); setEditingId(null); setForm(EMPTY_FORM); }} />
        </DialogHeader>
        <DialogBody>
          <form id="accom-form" onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2 col-span-2">
                <Label>{t.accommodation.formName}</Label>
                <Input name="name" value={form.name} onChange={handleChange} required placeholder={t.accommodation.formNamePh} />
              </div>
              <div className="space-y-2">
                <Label>{t.accommodation.formType}</Label>
                <Select name="type" value={form.type} onChange={handleChange}>
                  {ACCOM_TYPE_KEYS.map((v) => (
                    <option key={v} value={v}>{(t.accommodationTypes as Record<string, string>)[v]}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t.accommodation.formCost}</Label>
                <CurrencyInput
                  value={form.cost}
                  onChange={(raw) => setForm((p) => ({ ...p, cost: raw }))}
                  currency={form.currency}
                  onCurrencyChange={(c) => setForm((p) => ({ ...p, currency: c }))}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.accommodation.formCheckIn}</Label>
                <Input name="checkIn" type="date" value={form.checkIn} onChange={handleChange} required />
                <Input name="checkInTime" type="time" value={form.checkInTime} onChange={handleChange} className="mt-1" />
              </div>
              <div className="space-y-2">
                <Label>{t.accommodation.formCheckOut}</Label>
                <Input name="checkOut" type="date" value={form.checkOut} min={form.checkIn || undefined} onChange={handleChange} required />
                <Input name="checkOutTime" type="time" value={form.checkOutTime} onChange={handleChange} className="mt-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t.accommodation.formAddress}</Label>
              <LocationInput
                mode="address"
                value={form.address}
                onChange={(val) => setForm((p) => ({ ...p, address: val }))}
                placeholder={t.accommodation.formAddressPh}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>{t.accommodation.formConfirmation}</Label>
                <Input name="confirmationNumber" value={form.confirmationNumber} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>{t.accommodation.formPhone}</Label>
                <Input name="phone" value={form.phone} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t.accommodation.formWebsite}</Label>
              <Input name="website" type="url" value={form.website} onChange={handleChange} placeholder="https://" />
            </div>
            <div className="space-y-2">
              <Label>{t.accommodation.formNotes}</Label>
              <Textarea name="notes" value={form.notes} onChange={handleChange} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Comprovante (foto)</Label>
              <PhotoUpload onUploaded={(url) => setForm((p) => ({ ...p, attachmentUrl: url }))} label="Foto da reserva" />
              {form.attachmentUrl && (
                <a href={form.attachmentUrl} target="_blank" rel="noreferrer" className="inline-block text-xs font-semibold text-primary-600 hover:underline">
                  Ver comprovante anexado ↗
                </a>
              )}
            </div>
          </form>
        </DialogBody>
        <DialogFooter>
          {formError && (
          <p className="text-sm text-red-600 font-medium px-1">{formError}</p>
        )}
        <Button variant="outline" onClick={() => { setOpen(false); setEditingId(null); setForm(EMPTY_FORM); setFormError(""); }}>{t.common.cancel}</Button>
          <Button type="submit" form="accom-form" disabled={loading}>
            {loading ? t.common.saving : editingId ? t.accommodation.saveChanges : t.accommodation.add}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* ── Detail dialog (calendar click) ── */}
      {selected && (
        <AccommodationDetail
          item={selected}
          onClose={() => setSelected(null)}
          onEdit={(item) => { setSelected(null); openEdit(item); }}
          onDelete={(itemId) => { handleDelete(itemId); setSelected(null); }}
        />
      )}
    </div>
  );
}
