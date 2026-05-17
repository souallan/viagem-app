import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatCurrency, tripStatusLabel, tripStatusColor } from "@/lib/utils";
import { Calendar, MapPin, DollarSign, FileText, Luggage, Activity } from "lucide-react";

export default async function TripOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  const trip = await prisma.trip.findFirst({
    where: { id, userId: session!.user!.id! },
    include: {
      _count: {
        select: {
          activities: true,
          accommodations: true,
          transports: true,
          expenses: true,
          documents: true,
        },
      },
      expenses: { select: { amount: true } },
      packingList: {
        include: {
          _count: { select: { items: true } },
          items: { where: { isPacked: true }, select: { id: true } },
        },
      },
    },
  });

  if (!trip) notFound();

  const totalSpent = trip.expenses.reduce((sum, e) => sum + e.amount, 0);
  const packedCount = trip.packingList?.items.length ?? 0;
  const totalItems = trip.packingList?._count.items ?? 0;

  return (
    <div className="space-y-6">
      {/* Status + Datas */}
      <div className="flex flex-wrap gap-4 items-center">
        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${tripStatusColor(trip.status)}`}>
          {tripStatusLabel(trip.status)}
        </span>
        {(trip.startDate || trip.endDate) && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              {trip.startDate ? formatDate(trip.startDate.toISOString()) : "—"}
              {trip.endDate ? ` → ${formatDate(trip.endDate.toISOString())}` : ""}
            </span>
          </div>
        )}
      </div>

      {trip.description && (
        <p className="text-gray-600">{trip.description}</p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard
          icon={Activity}
          label="Atividades"
          value={trip._count.activities}
          href={`/trips/${id}/itinerary`}
        />
        <StatCard
          icon={MapPin}
          label="Hospedagens"
          value={trip._count.accommodations}
          href={`/trips/${id}/accommodation`}
        />
        <StatCard
          icon={Calendar}
          label="Transportes"
          value={trip._count.transports}
          href={`/trips/${id}/transport`}
        />
        <StatCard
          icon={DollarSign}
          label="Gastos"
          value={`${formatCurrency(totalSpent, trip.currency)}${trip.budget ? ` / ${formatCurrency(trip.budget, trip.currency)}` : ""}`}
          href={`/trips/${id}/budget`}
        />
        <StatCard
          icon={FileText}
          label="Documentos"
          value={trip._count.documents}
          href={`/trips/${id}/documents`}
        />
        <StatCard
          icon={Luggage}
          label="Malas"
          value={`${packedCount}/${totalItems} itens`}
          href={`/trips/${id}/packing`}
        />
      </div>

      {/* Editar */}
      <div className="flex gap-3 pt-2">
        <Link
          href={`/trips/${id}/edit`}
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          Editar informações da viagem
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <Icon className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-sm font-semibold text-gray-900">{value}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
