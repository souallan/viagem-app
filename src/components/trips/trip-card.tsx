import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, tripStatusLabel, tripStatusColor } from "@/lib/utils";

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
  return (
    <Link href={`/trips/${trip.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden group">
        <div className="h-40 bg-gradient-to-br from-blue-400 to-indigo-600 relative overflow-hidden">
          {trip.coverImage ? (
            <img
              src={trip.coverImage}
              alt={trip.destination}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MapPin className="h-12 w-12 text-white/60" />
            </div>
          )}
          <div className="absolute top-3 right-3">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tripStatusColor(trip.status)}`}
            >
              {tripStatusLabel(trip.status)}
            </span>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 truncate">{trip.title}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{trip.destination}</span>
          </div>
          {(trip.startDate || trip.endDate) && (
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {trip.startDate ? formatDate(trip.startDate) : "—"}
                {trip.endDate ? ` → ${formatDate(trip.endDate)}` : ""}
              </span>
            </div>
          )}
          {trip._count && (
            <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                {trip._count.activities} atividades
              </span>
              <span className="text-xs text-gray-500">
                {trip._count.expenses} despesas
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
