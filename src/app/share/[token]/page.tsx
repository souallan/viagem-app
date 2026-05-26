import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate, tripStatusLabel } from "@/lib/utils";
import { MapPin, Calendar, Plane, Hotel, Zap, Clock } from "lucide-react";

export default async function PublicSharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const trip = await prisma.trip.findFirst({
    where: { shareToken: token },
    include: {
      activities:     { orderBy: [{ date: "asc" }, { startTime: "asc" }] },
      accommodations: { orderBy: { checkIn: "asc" } },
      transports:     { orderBy: { departureTime: "asc" } },
    },
  });

  if (!trip) notFound();

  const destinations = trip.destination.split(" → ");

  // Group activities by date
  const actByDate: Record<string, typeof trip.activities> = {};
  trip.activities.forEach(a => {
    const d = a.date.toISOString().slice(0, 10);
    if (!actByDate[d]) actByDate[d] = [];
    actByDate[d].push(a);
  });
  const sortedDates = Object.keys(actByDate).sort();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-2xl mx-auto px-4 py-10 sm:py-14">
          <div className="flex items-center gap-2 mb-3">
            <Plane className="h-5 w-5 text-primary-300" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary-300">Roteiro de viagem</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mb-2">{trip.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-primary-200 text-sm">
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{trip.destination}</span>
            {(trip.startDate || trip.endDate) && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {trip.startDate ? formatDate(trip.startDate.toISOString()) : "—"}
                {trip.endDate ? ` → ${formatDate(trip.endDate.toISOString())}` : ""}
              </span>
            )}
            <span className="bg-white/15 border border-white/20 px-2.5 py-0.5 rounded-full text-xs font-semibold">
              {tripStatusLabel(trip.status)}
            </span>
          </div>
          {trip.description && (
            <p className="mt-4 text-primary-100 text-sm leading-relaxed border-t border-white/15 pt-4">{trip.description}</p>
          )}
          {destinations.length > 1 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {destinations.map(d => (
                <span key={d} className="bg-white/15 border border-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                  📍 {d}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Atividades", value: trip.activities.length, icon: Zap, color: "text-blue-600 bg-blue-50" },
            { label: "Hospedagens", value: trip.accommodations.length, icon: Hotel, color: "text-purple-600 bg-purple-50" },
            { label: "Transportes", value: trip.transports.length, icon: Plane, color: "text-emerald-600 bg-emerald-50" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
              <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mx-auto mb-2`}>
                <s.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Accommodations */}
        {trip.accommodations.length > 0 && (
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Hotel className="h-4.5 w-4.5 text-purple-500" /> Hospedagens
            </h2>
            <div className="space-y-2">
              {trip.accommodations.map(a => (
                <div key={a.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                    <Hotel className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{a.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDate(a.checkIn.toISOString())} → {formatDate(a.checkOut.toISOString())}
                    </p>
                    {a.address && <p className="text-xs text-gray-400">{a.address}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Transports */}
        {trip.transports.length > 0 && (
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Plane className="h-4.5 w-4.5 text-emerald-500" /> Transportes
            </h2>
            <div className="space-y-2">
              {trip.transports.map(t => (
                <div key={t.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                    <Plane className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.from} → {t.to}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {t.departureTime.toLocaleDateString("pt-BR")} {t.departureTime.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      {t.carrier ? ` · ${t.carrier}` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Activities by day */}
        {sortedDates.length > 0 && (
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="h-4.5 w-4.5 text-blue-500" /> Atividades por dia
            </h2>
            <div className="space-y-6">
              {sortedDates.map((dateStr, dayIdx) => {
                const acts = actByDate[dateStr];
                const date = new Date(dateStr + "T12:00:00");
                return (
                  <div key={dateStr}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex flex-col items-center justify-center text-white shrink-0 shadow-sm">
                        <span className="text-[8px] font-bold uppercase leading-none opacity-80">DIA</span>
                        <span className="text-xl font-black leading-tight">{dayIdx + 1}</span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm capitalize">
                          {date.toLocaleDateString("pt-BR", { weekday: "long" })}
                        </p>
                        <p className="text-xs text-gray-400">
                          {date.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 pl-2">
                      {acts.map(a => (
                        <div key={a.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3.5 flex gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                            <Zap className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm">{a.title}</p>
                            {(a.startTime || a.location) && (
                              <div className="flex flex-wrap gap-x-3 mt-0.5">
                                {a.startTime && (
                                  <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />{a.startTime}{a.endTime ? ` – ${a.endTime}` : ""}
                                  </span>
                                )}
                                {a.location && (
                                  <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />{a.location}
                                  </span>
                                )}
                              </div>
                            )}
                            {a.description && <p className="text-xs text-gray-500 mt-1">{a.description}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Footer */}
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            Roteiro compartilhado via{" "}
            <span className="font-semibold text-primary-600">RoteiroApp</span>
          </p>
        </div>
      </div>
    </div>
  );
}
