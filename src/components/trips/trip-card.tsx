"use client";
import { confirmDialog } from "@/lib/confirm";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Pencil, Trash2, Timer } from "lucide-react";
import { formatDate, tripStatusLabel, tripStatusColor } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import { useState } from "react";

function daysUntil(date: string | Date | null): number | null {
  if (!date) return null;
  const d = new Date(date);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - now.getTime()) / 86400000);
}

interface Trip {
  id: string;
  title: string;
  destination: string;
  status: string;
  startDate: string | Date | null;
  endDate: string | Date | null;
  coverImage: string | null;
  _count?: { activities: number; expenses: number };
}

export function TripCard({ trip }: { trip: Trip }) {
  const router = useRouter();
  const { t } = useLanguage();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!(await confirmDialog(t.tripCard.deleteConfirm.replace("{title}", trip.title)))) return;
    setDeleting(true);
    await fetch(`/api/trips/${trip.id}`, { method: "DELETE" });
    router.refresh();
  }

  function handleEdit(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/trips/${trip.id}/edit`);
  }

  const destinations = trip.destination.split(" → ");
  const primaryDest = destinations[0];
  const isMulti = destinations.length > 1;
  const countdown = (trip.status === "PLANNING" || trip.status === "CONFIRMED") ? daysUntil(trip.startDate) : null;

  return (
    <Link href={`/trips/${trip.id}`} className="block group">
      <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-white">
        {/* Cover image */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-sky-400 to-indigo-600">
          {trip.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={trip.coverImage}
              alt={primaryDest}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MapPin className="h-14 w-14 text-white/40" aria-hidden="true" />
            </div>
          )}

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Status badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tripStatusColor(trip.status)}`}>
              {tripStatusLabel(trip.status, t.status as Record<string, string>)}
            </span>
            {countdown !== null && countdown >= 0 && (
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm ${
                countdown === 0
                  ? "bg-green-500 text-white animate-pulse"
                  : countdown <= 7
                  ? "bg-orange-500 text-white"
                  : "bg-white/90 text-primary-700"
              }`}>
                <Timer className="h-3 w-3" />
                {countdown === 0 ? t.tripCard.today : `${countdown}d`}
              </span>
            )}
          </div>

          {/* Action buttons — visible on hover */}
          <div className="absolute top-3 right-3 flex gap-1.5 opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleEdit}
              className="w-8 h-8 rounded-lg bg-white/90 hover:bg-white flex items-center justify-center shadow transition-colors"
              title={t.tripCard.editTitle}
            >
              <Pencil className="h-3.5 w-3.5 text-gray-700" aria-hidden="true" />
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-8 h-8 rounded-lg bg-white/90 hover:bg-red-500 flex items-center justify-center shadow transition-colors group/del"
              title={t.tripCard.deleteTitle}
            >
              <Trash2 className="h-3.5 w-3.5 text-gray-700 group-hover/del:text-white" aria-hidden="true" />
            </button>
          </div>

          {/* Title + destination overlaid on image */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-bold text-white text-base leading-tight line-clamp-1">{trip.title}</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3 text-white/70 shrink-0" aria-hidden="true" />
              <span className="text-xs text-white/80 truncate">{primaryDest}</span>
              {isMulti && (
                <span className="text-xs text-sky-300 font-medium shrink-0">
                  {destinations.length - 1 > 1
                    ? t.tripCard.moreDestinationsPlural.replace("{n}", String(destinations.length - 1))
                    : t.tripCard.moreDestinations.replace("{n}", String(destinations.length - 1))}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card footer */}
        <div className="px-4 py-3 space-y-2">
          <div className="flex items-center justify-between gap-3">
            {(trip.startDate || trip.endDate) ? (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>
                  {trip.startDate ? formatDate(trip.startDate) : "—"}
                  {trip.endDate ? ` → ${formatDate(trip.endDate)}` : ""}
                </span>
              </div>
            ) : (
              <span className="text-xs text-gray-400">{t.tripCard.noDates}</span>
            )}
            {trip._count && (
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-gray-400">{trip._count.activities} {t.tripCard.activitiesUnit}</span>
              </div>
            )}
          </div>
          {countdown !== null && countdown >= 0 && (
            <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl ${
              countdown === 0
                ? "bg-green-50 text-green-700 border border-green-200"
                : countdown <= 7
                ? "bg-orange-50 text-orange-700 border border-orange-200"
                : "bg-primary-50 text-primary-700 border border-primary-100"
            }`}>
              <Timer className="h-3.5 w-3.5 shrink-0" />
              {countdown === 0
                ? t.tripCard.countdownToday
                : countdown === 1
                ? t.tripCard.countdownSingular
                : t.tripCard.countdownPlural.replace("{n}", String(countdown))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
