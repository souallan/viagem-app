import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "", label: "Visão geral" },
  { href: "/itinerary", label: "Itinerário" },
  { href: "/accommodation", label: "Hospedagem" },
  { href: "/transport", label: "Transporte" },
  { href: "/budget", label: "Orçamento" },
  { href: "/documents", label: "Documentos" },
  { href: "/packing", label: "Malas" },
  { href: "/map", label: "🗺️ Mapa" },
  { href: "/compare", label: "💰 Cotação" },
  { href: "/currency", label: "💱 Divisas" },
];

export default async function TripLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  const trip = await prisma.trip.findFirst({
    where: { id, userId: session!.user!.id! },
  });

  if (!trip) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{trip.title}</h1>
        <p className="text-gray-500">{trip.destination}</p>
      </div>

      <nav className="flex gap-1 border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => {
          const href = `/trips/${id}${tab.href}`;
          return (
            <Link
              key={tab.href}
              href={href}
              className={cn(
                "px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <div>{children}</div>
    </div>
  );
}
