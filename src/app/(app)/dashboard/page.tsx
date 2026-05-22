import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Plus, Globe, Plane, Calendar, TrendingUp, MapPin,
} from "lucide-react";
import { TripCard } from "@/components/trips/trip-card";

export default async function DashboardPage() {
  const session = await auth();

  const trips = await prisma.trip.findMany({
    where: { userId: session!.user!.id! },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { activities: true, expenses: true } } },
  });

  const ongoing  = trips.filter((t) => t.status === "IN_PROGRESS");
  const upcoming = trips.filter((t) => t.status === "PLANNING" || t.status === "CONFIRMED");
  const past     = trips.filter((t) => t.status === "COMPLETED" || t.status === "CANCELLED");

  const hasTrips = trips.length > 0;

  return (
    <div className="space-y-10 pb-10">

      {/* ── Hero Banner ── */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8 min-h-[180px] flex items-center gap-6">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, #60a5fa 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />

        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl" aria-hidden="true">✈️</span>
            <p className="text-sky-400 text-sm font-semibold tracking-wide uppercase">Bem-vindo de volta</p>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">
            Olá, {session?.user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-slate-300 text-sm">
            {!hasTrips
              ? "Comece criando sua primeira viagem."
              : `${trips.length} viagem${trips.length > 1 ? "s" : ""} · ${ongoing.length} em andamento · ${upcoming.length} planejada${upcoming.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 hidden md:flex gap-3">
          {[
            { icon: Globe,      label: "Total",         value: trips.length   },
            { icon: TrendingUp, label: "Em andamento",  value: ongoing.length  },
            { icon: Calendar,   label: "Planejadas",    value: upcoming.length },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="travel-glass rounded-xl px-5 py-4 text-center min-w-[88px]">
              <Icon className="h-4 w-4 text-sky-400 mx-auto mb-1" aria-hidden="true" />
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        <Link
          href="/trips/new"
          className="relative z-10 hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-900/40 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> Nova viagem
        </Link>
      </div>

      {/* ── Empty state ── */}
      {!hasTrips && (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center mx-auto mb-5">
            <MapPin className="h-9 w-9 text-sky-400" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Sua aventura começa aqui</h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Crie sua primeira viagem, organize destinos, atividades e orçamento em um só lugar.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/trips/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-base font-semibold bg-sky-600 hover:bg-sky-700 text-white transition-colors shadow-sm"
            >
              <Plus className="h-5 w-5" aria-hidden="true" /> Nova viagem
            </Link>
            <Link
              href="/routes"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-base font-semibold border border-gray-200 bg-white text-gray-700 hover:border-sky-400 hover:text-sky-600 transition-colors"
            >
              Explorar roteiros prontos
            </Link>
          </div>
        </div>
      )}

      {/* ── Em andamento ── */}
      {ongoing.length > 0 && (
        <TripSection
          icon={<Plane className="h-5 w-5 text-emerald-500" aria-hidden="true" />}
          title="Em andamento"
          accent="border-emerald-200 bg-emerald-50 text-emerald-700"
          trips={ongoing}
        />
      )}

      {/* ── Próximas viagens ── */}
      {upcoming.length > 0 && (
        <TripSection
          icon={<Calendar className="h-5 w-5 text-sky-500" aria-hidden="true" />}
          title="Próximas viagens"
          accent="border-sky-200 bg-sky-50 text-sky-700"
          trips={upcoming}
        />
      )}

      {/* ── Passadas ── */}
      {past.length > 0 && (
        <TripSection
          icon={<Globe className="h-5 w-5 text-slate-400" aria-hidden="true" />}
          title="Viagens passadas"
          accent="border-gray-200 bg-gray-50 text-gray-500"
          trips={past}
          muted
        />
      )}

      {/* Mobile new trip FAB */}
      {hasTrips && (
        <div className="fixed bottom-6 right-6 sm:hidden z-50">
          <Link
            href="/trips/new"
            className="w-14 h-14 rounded-full bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center shadow-xl transition-colors"
            aria-label="Nova viagem"
          >
            <Plus className="h-6 w-6" aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  );
}

function TripSection({
  icon, title, accent, trips, muted = false,
}: {
  icon: React.ReactNode;
  title: string;
  accent: string;
  trips: Parameters<typeof TripCard>[0]["trip"][];
  muted?: boolean;
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          {icon}
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${accent}`}>
            {trips.length}
          </span>
        </div>
        <Link
          href="/trips/new"
          className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 hover:text-sky-700"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Nova
        </Link>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 ${muted ? "opacity-75" : ""}`}>
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </section>
  );
}
