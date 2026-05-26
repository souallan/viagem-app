"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";
import {
  Plus, Clock, MapPin, Trash2, Pencil,
  Utensils, Bus, Building2, CalendarDays, FileText, Zap,
  Sunrise, Sun, Moon, LayoutList, Grid3x3, ExternalLink, Compass,
} from "lucide-react";
import HolidayAlerts from "@/components/trips/holiday-alerts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { CurrencyInput } from "@/components/ui/currency-input";
import { LocationInput } from "@/components/ui/location-input";
import { Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────

interface Activity {
  id: string;
  title: string;
  description: string | null;
  type: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  city: string | null;
  location: string | null;
  address: string | null;
  cost: number | null;
  notes: string | null;
}

// ── Activity type config ─────────────────────────────────────

const TYPE_STYLE: Record<string, {
  Icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  dot: string;
  bar: string;
}> = {
  ACTIVITY:      { Icon: Zap,          color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",   dot: "bg-blue-500",   bar: "bg-blue-400"   },
  MEAL:          { Icon: Utensils,     color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", dot: "bg-orange-500", bar: "bg-orange-400" },
  TRANSPORT:     { Icon: Bus,          color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200", dot: "bg-purple-500", bar: "bg-purple-400" },
  ACCOMMODATION: { Icon: Building2,    color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200",  dot: "bg-green-500",  bar: "bg-green-400"  },
  EVENT:         { Icon: CalendarDays, color: "text-pink-700",   bg: "bg-pink-50",   border: "border-pink-200",   dot: "bg-pink-500",   bar: "bg-pink-400"   },
  OTHER:         { Icon: FileText,     color: "text-gray-600",   bg: "bg-gray-50",   border: "border-gray-200",   dot: "bg-gray-400",   bar: "bg-gray-300"   },
};

const FALLBACK_STYLE = TYPE_STYLE.OTHER;

// ── Period helpers ────────────────────────────────────────────

type Period = "manha" | "tarde" | "noite" | "sem-horario";

const PERIOD_STYLE: Record<Period, { Icon: React.ElementType; gradient: string; textColor: string; bg: string; border: string; timeRange: string }> = {
  "manha":       { Icon: Sunrise, gradient: "from-amber-400 to-orange-400",  textColor: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200", timeRange: "06:00–11:59" },
  "tarde":       { Icon: Sun,     gradient: "from-blue-400 to-sky-500",      textColor: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",  timeRange: "12:00–17:59" },
  "noite":       { Icon: Moon,    gradient: "from-indigo-500 to-purple-600", textColor: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200",timeRange: "18:00–23:59" },
  "sem-horario": { Icon: Clock,   gradient: "from-gray-400 to-gray-500",     textColor: "text-gray-500",   bg: "bg-gray-50",   border: "border-gray-200",  timeRange: ""            },
};

function getPeriod(time: string | null): Period {
  if (!time) return "sem-horario";
  const [h] = time.split(":").map(Number);
  if (h >= 6 && h < 12) return "manha";
  if (h >= 12 && h < 18) return "tarde";
  if (h >= 18) return "noite";
  return "manha";
}

// ── Day header ────────────────────────────────────────────────

function DayHeader({ dayNumber, dateStr, activities }: { dayNumber: number; dateStr: string; activities: Activity[] }) {
  const { t, lang } = useLanguage();
  const date = new Date(dateStr + "T12:00:00");
  const totalCost = activities.reduce((sum, a) => sum + (a.cost ?? 0), 0);
  const dateLocale = lang === "pt" ? ptBR : lang === "es" ? ptBR : undefined;

  return (
    <div className="flex items-center gap-4 mb-5">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 flex flex-col items-center justify-center text-white shrink-0 shadow-sm shadow-primary-200">
        <span className="text-[9px] font-bold uppercase leading-none tracking-widest opacity-80">{t.overview.day.toUpperCase()}</span>
        <span className="text-2xl font-black leading-tight">{dayNumber}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-base font-bold text-gray-900 capitalize leading-tight">
          {format(date, "EEEE", { locale: dateLocale })}
        </p>
        <p className="text-sm text-gray-400">
          {format(date, lang === "en" ? "MMMM d, yyyy" : "d 'de' MMMM 'de' yyyy", { locale: dateLocale })}
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
          {activities.length} {activities.length === 1 ? t.itinerary.activityCount : t.itinerary.activityCountPlural}
        </span>
        {totalCost > 0 && (
          <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
            R$ {totalCost.toFixed(2)}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Activity card (timeline view) ────────────────────────────

function ActivityItem({
  activity, isLast, onDelete, onEdit,
}: {
  activity: Activity;
  isLast: boolean;
  onDelete: () => void;
  onEdit: () => void;
}) {
  const { t } = useLanguage();
  const cfg = TYPE_STYLE[activity.type] ?? FALLBACK_STYLE;
  const { Icon } = cfg;
  const typeLabel = (t.activityTypes as Record<string, string>)[activity.type] ?? activity.type;
  const cityLabel = activity.city ? activity.city.split(",")[0].trim() : null;

  return (
    <div className="flex gap-3 group">
      <div className="flex flex-col items-center w-14 shrink-0">
        <span className="text-xs font-bold text-gray-400 pt-3.5 leading-none text-right w-full pr-1">
          {activity.startTime ?? "–"}
        </span>
        <div className="flex flex-col items-center flex-1 mt-1">
          <div className={cn("w-3 h-3 rounded-full shrink-0 ring-2 ring-white shadow", cfg.dot)} />
          {!isLast && <div className="w-px flex-1 bg-gray-200 mt-1 min-h-[24px]" />}
        </div>
      </div>

      <div className="flex-1 rounded-2xl border bg-white shadow-sm mb-4 overflow-hidden hover:shadow-md transition-all duration-150 group-hover:border-gray-200">
        <div className={cn("h-1", cfg.bar)} />
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full border", cfg.bg, cfg.color, cfg.border)}>
                <Icon className="h-3 w-3" aria-hidden="true" />
                {typeLabel}
              </span>
              {cityLabel && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                  <MapPin className="h-2.5 w-2.5" />
                  {cityLabel}
                </span>
              )}
              {(activity.startTime || activity.endTime) && (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  {activity.startTime ?? ""}
                  {activity.endTime ? ` – ${activity.endTime}` : ""}
                </span>
              )}
              {activity.cost != null && (
                <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                  R$ {activity.cost.toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 shrink-0 mt-0.5">
              <button onClick={onEdit} className="text-gray-200 hover:text-primary-500 transition-colors" aria-label={t.common.edit}>
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button onClick={onDelete} className="text-gray-200 hover:text-red-500 transition-colors" aria-label={t.common.delete}>
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <h4 className="font-bold text-gray-900 leading-snug">{activity.title}</h4>
          {activity.location && (
            <p className="text-sm text-gray-600 mt-1.5 flex items-center gap-1.5 font-medium">
              <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
              {activity.location}
            </p>
          )}
          {activity.address && activity.address !== activity.location && (
            <p className="text-xs text-gray-400 mt-0.5 pl-5">{activity.address}</p>
          )}
          {activity.description && (
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">{activity.description}</p>
          )}
          {activity.notes && (
            <p className="text-xs text-gray-400 italic mt-2 pt-2 border-t border-gray-50">{activity.notes}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Gap between activities ────────────────────────────────────

function minutesBetween(endTime: string | null, startTime: string | null): number | null {
  if (!endTime || !startTime) return null;
  const [eh, em] = endTime.split(":").map(Number);
  const [sh, sm] = startTime.split(":").map(Number);
  const diff = (sh * 60 + sm) - (eh * 60 + em);
  return diff > 0 ? diff : null;
}

function GapIndicator({ minutes }: { minutes: number }) {
  const { t } = useLanguage();
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const free = t.itinerary.free;
  const label = h > 0 && m > 0 ? `${h}h${m.toString().padStart(2, "0")}min ${free}`
              : h > 0 ? `${h}h ${free}`
              : `${m}min ${free}`;
  return (
    <div className="flex gap-3 items-center -mt-3 mb-1">
      <div className="w-14 flex justify-center shrink-0">
        <div className="w-px h-5 bg-gray-200" />
      </div>
      <span className="text-[11px] font-medium text-gray-400 bg-gray-50 border border-dashed border-gray-200 px-2.5 py-0.5 rounded-full">
        ↕ {label}
      </span>
    </div>
  );
}

// ── Activity card (period view — compact) ────────────────────

function PeriodActivityCard({ activity, onDelete, onEdit }: { activity: Activity; onDelete: () => void; onEdit: () => void }) {
  const { t } = useLanguage();
  const cfg = TYPE_STYLE[activity.type] ?? FALLBACK_STYLE;
  const { Icon } = cfg;
  const cityLabel = activity.city ? activity.city.split(",")[0].trim() : null;

  return (
    <div className="group flex items-start gap-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all p-3.5 overflow-hidden relative">
      <div className={cn("absolute left-0 top-0 bottom-0 w-1", cfg.bar)} />

      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", cfg.bg, cfg.border, "border")}>
        <Icon className={cn("h-4 w-4", cfg.color)} />
      </div>

      <div className="flex-1 min-w-0 pl-0.5">
        <h4 className="font-semibold text-gray-900 text-sm leading-snug">{activity.title}</h4>
        <div className="flex items-center flex-wrap gap-x-3 gap-y-0.5 mt-1">
          {activity.startTime && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {activity.startTime}{activity.endTime ? ` – ${activity.endTime}` : ""}
            </span>
          )}
          {cityLabel && (
            <span className="text-xs text-sky-600 font-medium flex items-center gap-0.5">
              <MapPin className="h-3 w-3 shrink-0" />{cityLabel}
            </span>
          )}
          {activity.location && (
            <span className="text-xs text-gray-500 flex items-center gap-1 truncate">
              <span className="truncate">{activity.location}</span>
            </span>
          )}
          {activity.cost != null && (
            <span className="text-xs font-semibold text-green-700">R$ {activity.cost.toFixed(2)}</span>
          )}
        </div>
        {activity.description && (
          <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">{activity.description}</p>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 shrink-0">
        <button onClick={onEdit} className="text-gray-200 hover:text-primary-500 transition-colors" aria-label={t.common.edit}>
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button onClick={onDelete} className="text-gray-200 hover:text-red-500 transition-colors" aria-label={t.common.delete}>
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// ── Period column ─────────────────────────────────────────────

function PeriodColumn({
  period, activities, onDelete, onEdit,
}: {
  period: Period;
  activities: Activity[];
  onDelete: (id: string) => void;
  onEdit: (act: Activity) => void;
}) {
  const { t } = useLanguage();
  const cfg = PERIOD_STYLE[period];
  const { Icon } = cfg;
  const periodKey = period === "sem-horario" ? "semHorario" : period;
  const periodLabel = (t.periods as Record<string, string>)[periodKey] ?? period;

  if (activities.length === 0) {
    return (
      <div className="flex flex-col rounded-2xl border border-dashed border-gray-200 overflow-hidden">
        <div className="px-3 py-2.5 flex items-center gap-2 bg-gray-50/50">
          <Icon className={cn("h-4 w-4", cfg.textColor)} />
          <span className={cn("text-sm font-bold", cfg.textColor)}>{periodLabel}</span>
          {cfg.timeRange && <span className="text-xs text-gray-400 ml-auto">{cfg.timeRange}</span>}
        </div>
        <div className="flex-1 flex items-center justify-center py-6 px-3">
          <p className="text-xs text-gray-300 text-center">{t.periods.noActivities}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className={cn("px-3 py-2.5 flex items-center gap-2 bg-gradient-to-r text-white", `bg-gradient-to-r ${cfg.gradient}`)}>
        <Icon className="h-4 w-4" />
        <span className="text-sm font-bold">{periodLabel}</span>
        <span className="ml-auto text-xs opacity-75">{activities.length}</span>
        {cfg.timeRange && <span className="text-xs opacity-60">{cfg.timeRange}</span>}
      </div>

      <div className="p-2.5 space-y-2 bg-white">
        {activities.map((act) => (
          <PeriodActivityCard
            key={act.id}
            activity={act}
            onDelete={() => onDelete(act.id)}
            onEdit={() => onEdit(act)}
          />
        ))}
      </div>
    </div>
  );
}

// ── Affiliate banner ──────────────────────────────────────────

function AffiliateActivitiesBanner({ destinations }: { destinations: string[] }) {
  const { t } = useLanguage();
  const dest = encodeURIComponent(destinations[0] ?? "");
  // Replace "YOUR_PARTNER_ID" with your GetYourGuide partner ID after registration at partner.getyourguide.com
  const gygUrl    = `https://www.getyourguide.com/s/?q=${dest}&partner_id=YOUR_PARTNER_ID`;
  const viatorUrl = `https://www.viator.com/searchResults/all?text=${dest}`;

  return (
    <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0">
        <Compass className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-emerald-900">{t.itinerary.affiliateTitle}</p>
        <p className="text-xs text-emerald-700 mt-0.5">
          {t.itinerary.affiliateDesc} {destinations[0] ?? t.itinerary.yourDestination}.
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        <a
          href={gygUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          GetYourGuide
        </a>
        <a
          href={viatorUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-sm"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Viator
        </a>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────

const EMPTY_FORM = {
  title: "", type: "ACTIVITY", date: "", startTime: "", endTime: "",
  city: "", location: "", address: "", description: "", cost: "", currency: "BRL", notes: "",
};

export default function ItineraryPage() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [tripDestinations, setTripDestinations] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"timeline" | "periodo">("timeline");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function load() {
    const [actRes, tripRes] = await Promise.all([
      fetch(`/api/trips/${id}/activities`),
      fetch(`/api/trips/${id}`),
    ]);
    if (actRes.ok) setActivities(await actRes.json());
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function openEdit(activity: Activity) {
    setForm({
      title: activity.title,
      type: activity.type,
      date: activity.date.slice(0, 10),
      startTime: activity.startTime ?? "",
      endTime: activity.endTime ?? "",
      city: activity.city ?? "",
      location: activity.location ?? "",
      address: activity.address ?? "",
      description: activity.description ?? "",
      cost: activity.cost != null ? String(activity.cost) : "",
      currency: "BRL",
      notes: activity.notes ?? "",
    });
    setEditingId(activity.id);
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.startTime && form.endTime && form.endTime < form.startTime) {
      alert(t.itinerary.timeError);
      return;
    }
    setLoading(true);
    const body = editingId ? { ...form, activityId: editingId } : form;
    const res = await fetch(`/api/trips/${id}/activities`, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false);
    if (res.ok) {
      setOpen(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      load();
    }
  }

  async function handleDelete(activityId: string) {
    if (!confirm(t.common.delete + "?")) return;
    await fetch(`/api/trips/${id}/activities`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityId }),
    });
    load();
  }

  const grouped = activities.reduce<Record<string, Activity[]>>((acc, a) => {
    const key = a.date.slice(0, 10);
    if (!acc[key]) acc[key] = [];
    acc[key].push(a);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();
  const totalCost = activities.reduce((sum, a) => sum + (a.cost ?? 0), 0);
  const PERIODS: Period[] = ["manha", "tarde", "noite", "sem-horario"];

  return (
    <div className="space-y-6">

      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{t.itinerary.headerTitle}</h2>
          {activities.length > 0 && (
            <p className="text-sm text-gray-400 mt-0.5">
              {activities.length} {activities.length === 1 ? t.itinerary.activityCount : t.itinerary.activityCountPlural}
              {sortedDates.length > 1 ? ` · ${sortedDates.length} ${t.overview.days}` : ""}
              {totalCost > 0 ? ` · R$ ${totalCost.toFixed(2)} ${t.itinerary.estimated}` : ""}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {activities.length > 0 && (
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("timeline")}
                title={t.itinerary.timeline}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  viewMode === "timeline" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                <LayoutList className="h-3.5 w-3.5" />
                {t.itinerary.timeline}
              </button>
              <button
                onClick={() => setViewMode("periodo")}
                title={t.itinerary.byPeriod}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  viewMode === "periodo" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Grid3x3 className="h-3.5 w-3.5" />
                {t.itinerary.byPeriod}
              </button>
            </div>
          )}

          <Button onClick={() => setOpen(true)} className="gap-2" size="sm">
            <Plus className="h-4 w-4" />
            {t.itinerary.addActivity}
          </Button>
        </div>
      </div>

      {/* ── Affiliate banner ── */}
      {tripDestinations.length > 0 && (
        <AffiliateActivitiesBanner destinations={tripDestinations} />
      )}

      {/* Holiday alerts */}
      {sortedDates.length > 0 && (
        <HolidayAlerts destinations={tripDestinations} activityDates={sortedDates} />
      )}

      {/* Empty state */}
      {sortedDates.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">📅</div>
          <p className="font-semibold text-gray-500">{t.itinerary.noActivities}</p>
          <p className="text-sm mt-1">{t.itinerary.noActivitiesDesc}</p>
          <Button onClick={() => setOpen(true)} className="mt-6 gap-2" size="sm">
            <Plus className="h-4 w-4" /> {t.itinerary.addActivity}
          </Button>
        </div>
      )}

      {/* ── TIMELINE VIEW ── */}
      {viewMode === "timeline" && sortedDates.length > 0 && (
        <div className="space-y-10">
          {sortedDates.map((dateStr, dayIdx) => {
            const dayActivities = [...(grouped[dateStr] ?? [])].sort((a, b) =>
              (a.startTime ?? "").localeCompare(b.startTime ?? "")
            );
            return (
              <div key={dateStr}>
                <DayHeader dayNumber={dayIdx + 1} dateStr={dateStr} activities={dayActivities} />
                <div className="pl-1">
                  {dayActivities.map((activity, actIdx) => {
                    const next = dayActivities[actIdx + 1] ?? null;
                    const gap = next ? minutesBetween(activity.endTime, next.startTime) : null;
                    return (
                      <React.Fragment key={activity.id}>
                        <ActivityItem
                          activity={activity}
                          isLast={actIdx === dayActivities.length - 1}
                          onDelete={() => handleDelete(activity.id)}
                          onEdit={() => openEdit(activity)}
                        />
                        {gap !== null && <GapIndicator minutes={gap} />}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── PERIOD VIEW ── */}
      {viewMode === "periodo" && sortedDates.length > 0 && (
        <div className="space-y-10">
          {sortedDates.map((dateStr, dayIdx) => {
            const dayActivities = [...(grouped[dateStr] ?? [])].sort((a, b) =>
              (a.startTime ?? "").localeCompare(b.startTime ?? "")
            );

            const byPeriod: Record<Period, Activity[]> = {
              manha: [], tarde: [], noite: [], "sem-horario": [],
            };
            dayActivities.forEach((act) => {
              byPeriod[getPeriod(act.startTime)].push(act);
            });

            const activePeriods = PERIODS.filter((p) => byPeriod[p].length > 0);

            return (
              <div key={dateStr}>
                <DayHeader dayNumber={dayIdx + 1} dateStr={dateStr} activities={dayActivities} />

                <div className="flex items-center gap-2 flex-wrap mb-4">
                  {activePeriods.map((p) => {
                    const cfg = PERIOD_STYLE[p];
                    const { Icon } = cfg;
                    const pKey = p === "sem-horario" ? "semHorario" : p;
                    const pLabel = (t.periods as Record<string, string>)[pKey] ?? p;
                    return (
                      <span key={p} className={cn("inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full", cfg.bg, cfg.textColor, "border", cfg.border)}>
                        <Icon className="h-3 w-3" />
                        {pLabel} · {byPeriod[p].length}
                      </span>
                    );
                  })}
                </div>

                <div className={cn(
                  "grid gap-4",
                  activePeriods.length === 1 ? "grid-cols-1 max-w-lg" :
                  activePeriods.length === 2 ? "grid-cols-1 sm:grid-cols-2" :
                  "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                )}>
                  {activePeriods.map((period) => (
                    <PeriodColumn
                      key={period}
                      period={period}
                      activities={byPeriod[period]}
                      onDelete={handleDelete}
                      onEdit={openEdit}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={open} onClose={() => { setOpen(false); setEditingId(null); setForm(EMPTY_FORM); }}>
        <DialogHeader>
          <DialogTitle>{editingId ? t.itinerary.dialogEdit : t.itinerary.dialogNew}</DialogTitle>
          <DialogClose onClose={() => { setOpen(false); setEditingId(null); setForm(EMPTY_FORM); }} />
        </DialogHeader>
        <DialogBody>
          <form id="activity-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{t.itinerary.formTitle}</Label>
              <Input name="title" value={form.title} onChange={handleChange} required placeholder={t.itinerary.formTitlePh} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>{t.itinerary.formType}</Label>
                <Select name="type" value={form.type} onChange={handleChange}>
                  <option value="ACTIVITY">⚡ {t.activityTypes.ACTIVITY}</option>
                  <option value="MEAL">🍽️ {t.activityTypes.MEAL}</option>
                  <option value="EVENT">🎭 {t.activityTypes.EVENT}</option>
                  <option value="OTHER">📝 {t.activityTypes.OTHER}</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t.itinerary.formDate}</Label>
                <Input name="date" type="date" value={form.date} min={new Date().toISOString().slice(0, 10)} onChange={handleChange} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>{t.itinerary.formStartTime}</Label>
                <Input name="startTime" type="time" value={form.startTime} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>{t.itinerary.formEndTime}</Label>
                <Input name="endTime" type="time" value={form.endTime} onChange={handleChange} min={form.startTime || undefined} />
              </div>
            </div>

            {/* City */}
            {tripDestinations.length > 0 && (
              <div className="space-y-1.5">
                <Label className="text-xs">{t.itinerary.formCity}</Label>
                <div className="flex flex-wrap gap-1.5">
                  {tripDestinations.map((dest) => {
                    const city = dest.split(",")[0].trim();
                    const isSelected = form.city === dest;
                    return (
                      <button
                        key={dest}
                        type="button"
                        onClick={() => setForm((p) => ({
                          ...p,
                          city: isSelected ? "" : dest,
                        }))}
                        className={cn(
                          "inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium transition-all",
                          isSelected
                            ? "bg-sky-50 border-sky-300 text-sky-700"
                            : "bg-gray-50 border-gray-200 text-gray-600 hover:border-sky-200 hover:text-sky-600"
                        )}
                      >
                        <MapPin className="h-2.5 w-2.5" />
                        {city}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Venue + address */}
            <div className="space-y-2">
              <Label>{t.itinerary.formLocation}</Label>
              <LocationInput
                mode="address"
                value={form.location}
                searchContext={form.city || tripDestinations[0]}
                onChange={(val) => setForm((p) => ({ ...p, location: val, address: p.address }))}
                onSelect={(name, fullAddress) =>
                  setForm((p) => ({ ...p, location: name, address: fullAddress }))
                }
                placeholder={t.itinerary.formTitlePh}
              />
            </div>
            <div className="space-y-2">
              <Label>{t.itinerary.formAddress}</Label>
              <Input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder={t.itinerary.formAddressPh}
                className="text-sm text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label>{t.itinerary.formDescription}</Label>
              <Textarea name="description" value={form.description} onChange={handleChange} rows={2} placeholder={t.itinerary.formDescPh} />
            </div>
            <div className="space-y-2">
              <Label>{t.itinerary.formCost}</Label>
              <CurrencyInput
                value={form.cost}
                onChange={(raw) => setForm((p) => ({ ...p, cost: raw }))}
                currency={form.currency}
                onCurrencyChange={(c) => setForm((p) => ({ ...p, currency: c }))}
              />
            </div>
            <div className="space-y-2">
              <Label>{t.itinerary.formNotes}</Label>
              <Textarea name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder={t.itinerary.formNotesPh} />
            </div>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => { setOpen(false); setEditingId(null); setForm(EMPTY_FORM); }}>{t.common.cancel}</Button>
          <Button type="submit" form="activity-form" disabled={loading}>
            {loading ? t.common.saving : editingId ? t.itinerary.saveChanges : t.common.add}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
