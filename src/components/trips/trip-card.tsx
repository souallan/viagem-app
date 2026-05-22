"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Pencil, Trash2 } from "lucide-react";
import { formatDate, tripStatusLabel, tripStatusColor } from "@/lib/utils";
import { useState } from "react";

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
  const [deleting, setDeleting] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Excluir "${trip.title}"? Esta ação não pode ser desfeita.`)) return;
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
          <div className="absolute top-3 left-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tripStatusColor(trip.status)}`}>
              {tripStatusLabel(trip.status)}
            </span>
          </div>

          {/* Action buttons — visible on hover */}
          <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleEdit}
              className="w-8 h-8 rounded-lg bg-white/90 hover:bg-white flex items-center justify-center shadow transition-colors"
              title="Editar viagem"
            >
              <Pencil className="h-3.5 w-3.5 text-gray-700" aria-hidden="true" />
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-8 h-8 rounded-lg bg-white/90 hover:bg-red-500 flex items-center justify-center shadow transition-colors group/del"
              title="Excluir viagem"
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
                  +{destinations.length - 1} destino{destinations.length - 1 > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card footer */}
        <div className="px-4 py-3">
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
              <span className="text-xs text-gray-400">Sem datas definidas</span>
            )}

            {trip._count && (
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-gray-400">{trip._count.activities} atividades</span>
                <span className="text-xs text-gray-400">{trip._count.expenses} despesas</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
