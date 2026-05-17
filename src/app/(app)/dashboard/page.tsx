import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TripCard } from "@/components/trips/trip-card";

export default async function DashboardPage() {
  const session = await auth();

  const trips = await prisma.trip.findMany({
    where: { userId: session!.user!.id! },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { activities: true, expenses: true },
      },
    },
  });

  const upcoming = trips.filter(
    (t) => t.status === "PLANNING" || t.status === "CONFIRMED"
  );
  const ongoing = trips.filter((t) => t.status === "IN_PROGRESS");
  const past = trips.filter(
    (t) => t.status === "COMPLETED" || t.status === "CANCELLED"
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Olá, {session?.user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-500 mt-1">
            {trips.length === 0
              ? "Crie sua primeira viagem para começar"
              : `Você tem ${trips.length} viagem${trips.length > 1 ? "s" : ""} cadastrada${trips.length > 1 ? "s" : ""}`}
          </p>
        </div>
        <Link href="/trips/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nova viagem
          </Button>
        </Link>
      </div>

      {ongoing.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Em andamento
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ongoing.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Próximas viagens
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Viagens passadas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {past.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </section>
      )}

      {trips.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">✈️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhuma viagem ainda
          </h3>
          <p className="text-gray-500 mb-6">
            Comece criando sua primeira viagem e organize tudo em um só lugar.
          </p>
          <Link href="/trips/new">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Criar primeira viagem
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
