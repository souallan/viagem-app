import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Plus, Globe, Plane, MapPin, TrendingUp, Route,
  Calendar, Clock, ArrowRight,
} from "lucide-react";
import { TripCard } from "@/components/trips/trip-card";
import { ROUTE_TEMPLATES } from "@/lib/route-templates";

export default async function DashboardPage() {
  const session = await auth();

  const trips = await prisma.trip.findMany({
    where: { userId: session!.user!.id! },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { activities: true, expenses: true } } },
  });

  const upcoming = trips.filter((t) => t.status === "PLANNING" || t.status === "CONFIRMED");
  const ongoing = trips.filter((t) => t.status === "IN_PROGRESS");
  const past = trips.filter((t) => t.status === "COMPLETED" || t.status === "CANCELLED");
  const featured = ROUTE_TEMPLATES.slice(0, 4);

  return (
    <div className="space-y-10 pb-10">

      {/* ── Hero Banner ── */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8 min-h-[180px] flex items-center">
        {/* decorative dots */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, #60a5fa 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl animate-[float_3s_ease-in-out_infinite]" aria-hidden="true">✈️</span>
            <p className="text-sky-400 text-sm font-semibold tracking-wide uppercase">Bem-vindo de volta</p>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Olá, {session?.user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-slate-300 text-sm">
            {trips.length === 0
              ? "Comece criando sua primeira viagem ou explore um roteiro pronto."
              : `${trips.length} viagem${trips.length > 1 ? "s" : ""} cadastrada${trips.length > 1 ? "s" : ""} · ${upcoming.length} planejada${upcoming.length !== 1 ? "s" : ""} · ${ongoing.length} em andamento`}
          </p>
        </div>

        {/* Quick stats */}
        <div className="relative z-10 hidden md:flex gap-4">
          {[
            { icon: Globe, label: "Total", value: trips.length },
            { icon: TrendingUp, label: "Em andamento", value: ongoing.length },
            { icon: Calendar, label: "Planejadas", value: upcoming.length },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="travel-glass rounded-xl px-5 py-4 text-center min-w-[90px]">
              <Icon className="h-4 w-4 text-sky-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        <Link
          href="/trips/new"
          className="relative z-10 ml-6 hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-900/40 transition-colors"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> Nova viagem
        </Link>
      </div>

      {/* ── Roteiros Populares ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Route className="h-5 w-5 text-sky-500" />
            <h2 className="text-lg font-bold text-gray-900">Roteiros populares</h2>
          </div>
          <Link href="/routes" className="text-sm text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1">
            Ver todos <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((tmpl) => (
            <Link
              key={tmpl.id}
              href={`/trips/new?template=${tmpl.id}`}
              className="group travel-card-hover block rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-white"
            >
              {/* Cover image */}
              <div className="relative h-32 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tmpl.coverImage}
                  alt={tmpl.destination}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-2 left-2 text-xl" aria-hidden="true">{tmpl.flag}</span>
                <span className="absolute top-2 right-2 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  <span>{tmpl.duration} dias</span>
                </span>
              </div>
              <div className="p-3">
                <p className="font-semibold text-gray-900 text-sm truncate">{tmpl.title}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3" /> {tmpl.destination}
                </p>
                <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-sky-600 group-hover:gap-2 transition-all">
                  Usar roteiro <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Viagens em andamento ── */}
      {ongoing.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Plane className="h-5 w-5 text-emerald-500" />
            <h2 className="text-lg font-bold text-gray-900">Em andamento</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ongoing.map((trip) => <TripCard key={trip.id} trip={trip} />)}
          </div>
        </section>
      )}

      {/* ── Próximas viagens ── */}
      {upcoming.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-sky-500" />
            <h2 className="text-lg font-bold text-gray-900">Próximas viagens</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map((trip) => <TripCard key={trip.id} trip={trip} />)}
          </div>
        </section>
      )}

      {/* ── Passadas ── */}
      {past.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Viagens passadas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {past.map((trip) => <TripCard key={trip.id} trip={trip} />)}
          </div>
        </section>
      )}

      {/* ── Empty state ── */}
      {trips.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4" aria-hidden="true">🌍</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Sua aventura começa aqui</h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Crie sua primeira viagem do zero ou escolha um roteiro pronto para um dos destinos mais populares do mundo.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/trips/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-base font-semibold bg-sky-600 hover:bg-sky-700 text-white transition-colors"
            >
              <Plus className="h-5 w-5" aria-hidden="true" /> Nova viagem
            </Link>
            <Link
              href="/routes"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-base font-semibold border border-gray-300 bg-white text-gray-700 hover:border-sky-400 hover:text-sky-600 transition-colors"
            >
              <Route className="h-5 w-5" aria-hidden="true" /> Explorar roteiros
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
