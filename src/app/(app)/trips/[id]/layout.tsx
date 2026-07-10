import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MapPin } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TripTabs } from "@/components/trips/trip-tabs";

export default async function TripLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;
  const uid = session!.user!.id!;

  const trip = await prisma.trip.findFirst({
    where: { id, OR: [{ userId: uid }, { members: { some: { userId: uid } } }] },
  });

  if (!trip) notFound();

  const destinations = trip.destination
    ? trip.destination.split(" → ").map((d) => d.trim()).filter(Boolean)
    : [];

  const startStr = trip.startDate
    ? format(new Date(trip.startDate), "d MMM", { locale: ptBR })
    : null;
  const endStr = trip.endDate
    ? format(new Date(trip.endDate), "d MMM yyyy", { locale: ptBR })
    : null;

  return (
    <div className="space-y-0">
      {/* ── Trip Hero Header ── */}
      <div
        className="relative overflow-hidden rounded-2xl mb-6 min-h-[190px] sm:min-h-[230px] flex flex-col justify-end"
        style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #1a56cc 55%, #6d28d9 100%)" }}
      >
        {trip.coverImage ? (
          <>
            {/* Foto de capa como fundo do header */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={trip.coverImage} alt={trip.title} className="absolute inset-0 w-full h-full object-cover" />
            {/* Overlay escuro (mais forte embaixo) para o texto branco continuar legível */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />
          </>
        ) : (
          <>
            {/* Dot pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            {/* Blur orbs */}
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, #a78bfa, transparent)" }} />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full opacity-15"
              style={{ background: "radial-gradient(circle, #38bdf8, transparent)" }} />
          </>
        )}

        <div className="relative z-10 px-6 py-5 sm:px-8 sm:py-6">
          {/* Title row */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight drop-shadow">
              {trip.title}
            </h1>
            {startStr && (
              <div className="shrink-0 text-right">
                <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Período</p>
                <p className="text-xs font-bold text-white/80 mt-0.5 whitespace-nowrap">
                  {startStr}{endStr ? ` → ${endStr}` : ""}
                </p>
              </div>
            )}
          </div>

          {/* Destination pills */}
          {destinations.length > 0 && (
            <div className="flex items-center flex-wrap gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-white/50 shrink-0" />
              {destinations.map((dest, i) => {
                const city = dest.split(",")[0].trim();
                return (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/15 border border-white/25 text-white backdrop-blur-sm hover:bg-white/25 transition-colors">
                      {city}
                    </span>
                    {i < destinations.length - 1 && (
                      <svg className="h-3 w-3 text-white/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Tab navigation (sticky ao rolar) ── */}
      <div className="sticky top-14 md:top-0 z-20 bg-background/95 backdrop-blur-sm mb-6 py-1 print:hidden">
        <TripTabs tripId={id} />
        <div className="h-px bg-gray-200 mt-1" />
      </div>

      <div>{children}</div>
    </div>
  );
}
