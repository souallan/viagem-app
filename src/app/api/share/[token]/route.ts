import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const trip = await prisma.trip.findFirst({
    where: { shareToken: token },
    include: {
      activities:     { orderBy: [{ date: "asc" }, { startTime: "asc" }] },
      accommodations: { orderBy: { checkIn: "asc" } },
      transports:     { orderBy: { departureTime: "asc" } },
    },
  });

  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Expõe SOMENTE campos de exibição. Dados sensíveis (códigos de reserva,
  // confirmação, telefones, custos, anotações, IDs internos) nunca saem no link público.
  const publicTrip = {
    title: trip.title,
    destination: trip.destination,
    description: trip.description,
    status: trip.status,
    startDate: trip.startDate,
    endDate: trip.endDate,
    coverImage: trip.coverImage,
    currency: trip.currency,
    activities: trip.activities.map((a) => ({
      title: a.title,
      description: a.description,
      type: a.type,
      date: a.date,
      startTime: a.startTime,
      endTime: a.endTime,
      city: a.city,
      location: a.location,
    })),
    accommodations: trip.accommodations.map((h) => ({
      name: h.name,
      type: h.type,
      address: h.address,
      checkIn: h.checkIn,
      checkOut: h.checkOut,
      website: h.website,
    })),
    transports: trip.transports.map((t) => ({
      type: t.type,
      from: t.from,
      to: t.to,
      departureTime: t.departureTime,
      arrivalTime: t.arrivalTime,
      carrier: t.carrier,
    })),
  };
  return NextResponse.json(publicTrip);
}
