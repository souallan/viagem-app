"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Plus, ArrowRight, Trash2, Pencil, Bus, TrainFront, Plane, Car,
  ChevronDown, ChevronUp, MapPin, Clock, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationInput } from "@/components/ui/location-input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";

// ── Types ────────────────────────────────────────────────────

interface Transport {
  id: string;
  type: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string | null;
  carrier: string | null;
  bookingRef: string | null;
  seat: string | null;
  cost: number | null;
  notes: string | null;
}

type ModeKey = "FLIGHT" | "BUS" | "TRAIN" | "CAR";

const MODE_STYLE: Record<ModeKey, {
  Icon: React.ElementType; emoji: string;
  color: string; bg: string; border: string; accentBar: string;
}> = {
  FLIGHT: { Icon: Plane,      emoji: "✈️", color: "text-sky-700",    bg: "bg-sky-50",    border: "border-sky-200",    accentBar: "bg-sky-400"    },
  TRAIN:  { Icon: TrainFront, emoji: "🚆", color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",   accentBar: "bg-blue-400"   },
  BUS:    { Icon: Bus,        emoji: "🚌", color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200",  accentBar: "bg-green-400"  },
  CAR:    { Icon: Car,        emoji: "🚗", color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", accentBar: "bg-orange-400" },
};

const MODE_KEYS: ModeKey[] = ["FLIGHT", "TRAIN", "BUS", "CAR"];

// ── Affiliate banner ──────────────────────────────────────────

function AffiliateTransportBanner({ destinations }: { destinations: string[] }) {
  const { t } = useLanguage();
  const origin = encodeURIComponent(destinations[0] ?? "");
  const dest   = encodeURIComponent(destinations[destinations.length - 1] ?? "");
  // Replace "YOUR_AID" with your Skyscanner affiliate ID after registration at partners.skyscanner.net
  const skyscannerUrl = `https://www.skyscanner.com.br/voos?associateId=YOUR_AID&origin=${origin}&destination=${dest}`;
  const decolUrl      = `https://www.decolar.com/flights?origin=${origin}&destination=${dest}`;
  const buserUrl      = "https://buser.com.br";

  return (
    <div className="rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50 to-indigo-50 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center shrink-0">
        <Plane className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-sky-900">{t.transport.affiliateTitle}</p>
        <p className="text-xs text-sky-600 mt-0.5">{t.transport.affiliateDesc}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        <a
          href={skyscannerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-600 text-white hover:bg-sky-700 transition-colors shadow-sm"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Skyscanner
        </a>
        <a
          href={decolUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Decolar
        </a>
        <a
          href={buserUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Buser
        </a>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────

function parseCost(s: string): number | null {
  const n = parseFloat(s.replace(",", "."));
  return isNaN(n) || n === 0 ? null : n;
}

function cityLabel(location: string) {
  return location.split(",")[0].trim();
}

function calcDuration(dep: string, arr: string | null): string {
  if (!arr) return "";
  const mins = Math.round((new Date(arr).getTime() - new Date(dep).getTime()) / 60000);
  if (mins <= 0) return "";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h${m > 0 ? `${m}min` : ""}` : `${m}min`;
}

// ── Transport card ────────────────────────────────────────────

function TransportCard({ item, onDelete, onEdit }: { item: Transport; onDelete: () => void; onEdit: () => void }) {
  const { t } = useLanguage();
  const c = MODE_STYLE[item.type as ModeKey] ?? MODE_STYLE.FLIGHT;
  const { Icon } = c;
  const tr = t.transport as Record<string, string>;
  const lp = item.type.toLowerCase();
  const modeLabel = tr[`${lp}Label`] ?? item.type;
  const duration = calcDuration(item.departureTime, item.arrivalTime);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className={cn("h-1", c.accentBar)} />
      <div className="p-4 sm:p-5">

        {/* Top row: mode badge + cost + delete */}
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border",
            c.bg, c.color, c.border
          )}>
            <Icon className="h-3.5 w-3.5" />
            {modeLabel}
          </div>
          <div className="flex items-center gap-2">
            {item.cost != null && (
              <span className="text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                R$ {item.cost.toFixed(2)}
              </span>
            )}
            <button
              onClick={onEdit}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-primary-500 hover:bg-primary-50 transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onDelete}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Route: De ──→ Para */}
        <div className="flex items-stretch gap-2 sm:gap-4">
          {/* Origem */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{t.transport.fromLabel}</p>
            <p className="text-lg sm:text-xl font-black text-gray-900 leading-tight truncate">
              {cityLabel(item.from)}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{item.from}</p>
            <div className="flex items-center gap-1 mt-2">
              <Clock className="h-3 w-3 text-primary-400 shrink-0" />
              <span className="text-sm font-bold text-primary-700">
                {format(parseISO(item.departureTime), "HH:mm")}
              </span>
              <span className="text-xs text-gray-400 ml-0.5">
                {format(parseISO(item.departureTime), "dd/MM/yy")}
              </span>
            </div>
          </div>

          {/* Connector */}
          <div className="flex flex-col items-center justify-center gap-1 shrink-0 px-1">
            {duration && (
              <span className="text-[10px] text-gray-400 font-semibold whitespace-nowrap">{duration}</span>
            )}
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full border-2 border-gray-300 bg-white" />
              <div className="w-8 sm:w-16 h-px bg-gradient-to-r from-gray-300 to-gray-400" />
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <div className="w-2 h-2 rounded-full bg-gray-400" />
            </div>
            <span className="text-[10px] text-gray-300 font-medium">{item.type}</span>
          </div>

          {/* Destino */}
          <div className="flex-1 min-w-0 text-right">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{t.transport.toLabel}</p>
            <p className="text-lg sm:text-xl font-black text-gray-900 leading-tight truncate">
              {cityLabel(item.to)}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{item.to}</p>
            {item.arrivalTime && (
              <div className="flex items-center gap-1 mt-2 justify-end">
                <Clock className="h-3 w-3 text-teal-400 shrink-0" />
                <span className="text-sm font-bold text-teal-700">
                  {format(parseISO(item.arrivalTime), "HH:mm")}
                </span>
                <span className="text-xs text-gray-400 ml-0.5">
                  {format(parseISO(item.arrivalTime), "dd/MM/yy")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Detail chips */}
        {(item.carrier || item.bookingRef || item.seat || item.notes) && (
          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
            {item.carrier && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full font-medium">
                {item.carrier}
              </span>
            )}
            {item.bookingRef && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full font-mono">
                # {item.bookingRef}
              </span>
            )}
            {item.seat && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">
                💺 {item.seat}
              </span>
            )}
            {item.notes && (
              <span className="text-xs text-gray-400 truncate max-w-[240px]">{item.notes}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────

export default function TransportPage() {
  const { t, lang } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const [items, setItems] = useState<Transport[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tripDestinations, setTripDestinations] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form
  const [mode, setMode] = useState<ModeKey | null>(null);
  const [from, setFrom] = useState("");
  const [fromValidated, setFromValidated] = useState(false);
  const [to, setTo] = useState("");
  const [toValidated, setToValidated] = useState(false);
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [carrier, setCarrier] = useState("");
  const [cost, setCost] = useState("");
  const [costCurrency, setCostCurrency] = useState("BRL");
  const [bookingRef, setBookingRef] = useState("");
  const [seat, setSeat] = useState("");
  const [notes, setNotes] = useState("");

  async function load() {
    const [tRes, tripRes] = await Promise.all([
      fetch(`/api/trips/${id}/transports`),
      fetch(`/api/trips/${id}`),
    ]);
    if (tRes.ok) setItems(await tRes.json());
    if (tripRes.ok) {
      const trip = await tripRes.json();
      if (trip.destination) {
        setTripDestinations(
          trip.destination.split(" → ").map((d: string) => d.trim()).filter(Boolean)
        );
      }
    }
  }

  useEffect(() => { load(); }, [id]);

  function openDialog() {
    setMode(null);
    setFrom(""); setFromValidated(false);
    setTo(""); setToValidated(false);
    setDepartureTime(""); setArrivalTime("");
    setCarrier(""); setCost(""); setBookingRef(""); setSeat(""); setNotes("");
    setShowDetails(false);
    setEditingId(null);
    setError("");
    setOpen(true);
  }

  function openEdit(item: Transport) {
    setMode((item.type as ModeKey) ?? "FLIGHT");
    setFrom(item.from); setFromValidated(true);
    setTo(item.to); setToValidated(true);
    setDepartureTime(item.departureTime.slice(0, 16));
    setArrivalTime(item.arrivalTime ? item.arrivalTime.slice(0, 16) : "");
    setCarrier(item.carrier ?? "");
    setCost(item.cost != null ? String(item.cost) : "");
    setBookingRef(item.bookingRef ?? "");
    setSeat(item.seat ?? "");
    setNotes(item.notes ?? "");
    setShowDetails(!!(item.bookingRef || item.seat || item.notes));
    setEditingId(item.id);
    setError("");
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!mode) { setError(t.transport.errorMode); return; }
    if (!from || !to) { setError(t.transport.errorLocations); return; }
    if (!fromValidated || !toValidated) { setError(t.transport.errorValidate); return; }
    const tr = t.transport as Record<string, string>;
    const lp = mode.toLowerCase();
    if (!departureTime) { setError(tr[`${lp}Departure`] ?? t.transport.departure); return; }
    if (arrivalTime && arrivalTime < departureTime) {
      setError(tr[`${lp}Arrival`] ?? t.transport.arrival);
      return;
    }
    setLoading(true); setError("");
    const body = {
      ...(editingId && { itemId: editingId }),
      type: mode, from, to,
      departureTime, arrivalTime: arrivalTime || null,
      carrier: carrier || null, bookingRef: bookingRef || null,
      seat: seat || null, cost: parseCost(cost),
      notes: notes || null,
    };
    const res = await fetch(`/api/trips/${id}/transports`, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false);
    if (res.ok) { setOpen(false); setEditingId(null); load(); }
    else setError(t.transport.errorSave);
  }

  async function handleDelete(itemId: string) {
    if (!confirm(t.transport.confirmDelete)) return;
    await fetch(`/api/trips/${id}/transports`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId }),
    });
    load();
  }

  // Sort by departure time and group by date
  const sorted = [...items].sort((a, b) =>
    new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime()
  );
  const groupedByDate: Record<string, Transport[]> = {};
  sorted.forEach((item) => {
    const day = item.departureTime.slice(0, 10);
    (groupedByDate[day] ??= []).push(item);
  });
  const sortedDays = Object.keys(groupedByDate).sort();

  const modeTranslations = mode
    ? (() => {
        const tr = t.transport as Record<string, string>;
        const lp = mode.toLowerCase();
        return {
          label: tr[`${lp}Label`] ?? mode,
          carrierLabel: tr[`${lp}Carrier`] ?? "",
          carrierPlaceholder: tr[`${lp}CarrierPh`] ?? "",
          bookingLabel: tr[`${lp}Booking`] ?? "",
          bookingPlaceholder: tr[`${lp}BookingPh`] ?? "",
          seatLabel: tr[`${lp}Seat`] ?? "",
          seatPlaceholder: tr[`${lp}SeatPh`] ?? "",
          departureLabel: tr[`${lp}Departure`] ?? t.transport.departure,
          arrivalLabel: tr[`${lp}Arrival`] ?? t.transport.arrival,
        };
      })()
    : null;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{t.transport.header}</h2>
          {items.length > 0 && (
            <p className="text-sm text-gray-400 mt-0.5">
              {items.length} {items.length === 1 ? t.transport.segment : t.transport.segmentPlural} · {t.transport.headerDesc}
            </p>
          )}
        </div>
        <Button onClick={openDialog} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> {t.transport.addSegment}
        </Button>
      </div>

      {/* ── Affiliate banner ── */}
      <AffiliateTransportBanner destinations={tripDestinations} />

      {/* Empty state */}
      {items.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <div className="text-5xl mb-3">🗺️</div>
          <p className="font-semibold text-gray-500">{t.transport.emptyTitle}</p>
          <p className="text-sm mt-1 text-gray-400">{t.transport.emptyDesc}</p>
          <Button onClick={openDialog} className="mt-5 gap-2" size="sm" variant="outline">
            <Plus className="h-4 w-4" /> {t.transport.addFirst}
          </Button>
        </div>
      ) : (
        /* Journey timeline */
        <div className="space-y-8">
          {sortedDays.map((day, dayIdx) => {
            const dayItems = groupedByDate[day];
            const dayDate = parseISO(day);
            return (
              <div key={day}>
                {/* Day header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-600 flex flex-col items-center justify-center text-white shrink-0 shadow-sm shadow-primary-200">
                    <span className="text-[9px] font-bold uppercase leading-none opacity-80">
                      {new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : lang === "es" ? "es-ES" : "en-US", { month: "short" }).format(dayDate)}
                    </span>
                    <span className="text-xl font-black leading-tight">{format(dayDate, "d")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 capitalize">
                      {new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : lang === "es" ? "es-ES" : "en-US", { weekday: "long" }).format(dayDate)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : lang === "es" ? "es-ES" : "en-US", { dateStyle: "long" }).format(dayDate)}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium shrink-0">
                    {dayItems.length} {dayItems.length === 1 ? t.transport.segment : t.transport.segmentPlural}
                  </span>
                </div>

                {/* Cards with connecting line */}
                <div className={cn(
                  "space-y-3",
                  dayIdx < sortedDays.length - 1 ? "pb-8 border-b border-gray-100" : ""
                )}>
                  {dayItems.map((item) => (
                    <TransportCard key={item.id} item={item} onDelete={() => handleDelete(item.id)} onEdit={() => openEdit(item)} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={open} onClose={() => { setOpen(false); setEditingId(null); }}>
        <DialogHeader>
          <DialogTitle>{editingId ? t.transport.dialogEdit : t.transport.dialogNew}</DialogTitle>
          <DialogClose onClose={() => { setOpen(false); setEditingId(null); }} />
        </DialogHeader>

        <DialogBody>
          <form id="transport-form" onSubmit={handleSubmit} className="space-y-5">

            {/* Mode selector */}
            <div className="space-y-2">
              <Label>{t.transport.formMode}</Label>
              <div className="grid grid-cols-4 gap-2">
                {MODE_KEYS.map((mk) => {
                  const c = MODE_STYLE[mk];
                  const { Icon } = c;
                  const mklabel = (t.transport as Record<string, string>)[`${mk.toLowerCase()}Label`] ?? mk;
                  return (
                    <button
                      key={mk}
                      type="button"
                      onClick={() => setMode(mk)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-xs font-semibold",
                        mode === mk
                          ? `${c.bg} ${c.border} ${c.color}`
                          : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {mklabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* From */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t.transport.formFrom}</Label>
              {tripDestinations.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {tripDestinations.map((dest) => (
                    <button
                      key={dest}
                      type="button"
                      onClick={() => { setFrom(dest); setFromValidated(true); }}
                      className={cn(
                        "inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition-all font-medium",
                        from === dest
                          ? "bg-primary-50 border-primary-300 text-primary-700"
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:border-primary-200 hover:text-primary-600"
                      )}
                    >
                      <MapPin className="h-2.5 w-2.5" />
                      {cityLabel(dest)}
                    </button>
                  ))}
                </div>
              )}
              <LocationInput
                value={from}
                onChange={(val, validated) => { setFrom(val); setFromValidated(validated); }}
                placeholder="Cidade ou aeroporto de origem"
                required
              />
            </div>

            {/* To */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t.transport.formTo}</Label>
              {tripDestinations.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {tripDestinations.map((dest) => (
                    <button
                      key={dest}
                      type="button"
                      onClick={() => { setTo(dest); setToValidated(true); }}
                      className={cn(
                        "inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition-all font-medium",
                        to === dest
                          ? "bg-primary-50 border-primary-300 text-primary-700"
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:border-primary-200 hover:text-primary-600"
                      )}
                    >
                      <MapPin className="h-2.5 w-2.5" />
                      {cityLabel(dest)}
                    </button>
                  ))}
                </div>
              )}
              <LocationInput
                value={to}
                onChange={(val, validated) => { setTo(val); setToValidated(validated); }}
                placeholder="Cidade ou aeroporto de destino"
                required
              />
            </div>

            {/* Date/time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">{modeTranslations?.departureLabel ?? t.transport.departure} *</Label>
                <Input
                  type="datetime-local"
                  value={departureTime}
                  min={new Date().toISOString().slice(0, 16)}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{modeTranslations?.arrivalLabel ?? t.transport.arrival}</Label>
                <Input
                  type="datetime-local"
                  value={arrivalTime}
                  min={departureTime || new Date().toISOString().slice(0, 16)}
                  onChange={(e) => setArrivalTime(e.target.value)}
                />
              </div>
            </div>

            {/* Carrier + cost */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">{modeTranslations?.carrierLabel ?? ""}</Label>
                <Input
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  placeholder={modeTranslations?.carrierPlaceholder ?? ""}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t.transport.formCost}</Label>
                <CurrencyInput value={cost} onChange={setCost} currency={costCurrency} onCurrencyChange={setCostCurrency} />
              </div>
            </div>

            {/* Optional details toggle */}
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              {showDetails ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              {showDetails ? t.transport.lessDetails : t.transport.moreDetails} — {t.transport.detailsDesc}
            </button>

            {showDetails && (
              <div className="space-y-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">{modeTranslations?.bookingLabel ?? ""}</Label>
                    <Input
                      value={bookingRef}
                      onChange={(e) => setBookingRef(e.target.value)}
                      placeholder={modeTranslations?.bookingPlaceholder ?? ""}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">{modeTranslations?.seatLabel ?? ""}</Label>
                    <Input
                      value={seat}
                      onChange={(e) => setSeat(e.target.value)}
                      placeholder={modeTranslations?.seatPlaceholder ?? ""}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">{t.transport.formNotes}</Label>
                  <Input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t.transport.formNotesPh}
                  />
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
            )}
          </form>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={() => { setOpen(false); setEditingId(null); }}>{t.common.cancel}</Button>
          <Button type="submit" form="transport-form" disabled={loading}>
            {loading ? t.common.saving : editingId ? t.common.saveChanges : t.transport.addSegment}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
