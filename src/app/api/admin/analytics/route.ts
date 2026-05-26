import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const session = await auth();
  return (session?.user as { role?: string } | undefined)?.role === "ADMIN";
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function last6Months() {
  const months: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(monthKey(d));
  }
  return months;
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const since6m = new Date();
  since6m.setMonth(since6m.getMonth() - 6);

  const [
    // User cohorts: how many trips each user has
    allUsers,
    allTrips,
    allActivities,
    allTransports,
    allExpenses,
    allDocuments,
    allPackingItems,
    recentUsers,
    recentTrips,
    recentExperiences,
    topDestinations,
    activityTypes,
    transportTypes,
    expenseCategories,
    continents,
    tripStatuses,
    tripsWithBudget,
    experienceTags,
    experienceRatings,
    experienceMoods,
  ] = await Promise.all([
    // Totals
    prisma.user.count(),
    prisma.trip.count(),
    prisma.activity.count(),
    prisma.transport.count(),
    prisma.expense.count(),
    prisma.document.count(),
    prisma.packingItem.count(),

    // Last 6 months: users & trips for growth chart
    prisma.user.findMany({
      where: { createdAt: { gte: since6m } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.trip.findMany({
      where: { createdAt: { gte: since6m } },
      select: { createdAt: true, destination: true, budget: true, currency: true, startDate: true, endDate: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.experience.findMany({
      where: { createdAt: { gte: since6m } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),

    // Top destinations from all trips
    prisma.trip.groupBy({
      by: ["destination"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),

    // Activity type distribution
    prisma.activity.groupBy({
      by: ["type"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),

    // Transport type distribution
    prisma.transport.groupBy({
      by: ["type"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),

    // Expense category distribution (with sum)
    prisma.expense.groupBy({
      by: ["category"],
      _count: { id: true },
      _sum: { amount: true },
      orderBy: { _count: { id: "desc" } },
    }),

    // Community route continents
    prisma.communityRoute.groupBy({
      by: ["continent"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),

    // Trip status distribution
    prisma.trip.groupBy({
      by: ["status"],
      _count: { id: true },
    }),

    // Trips with budget set
    prisma.trip.findMany({
      where: { budget: { not: null } },
      select: { budget: true, currency: true, destination: true, startDate: true, endDate: true },
    }),

    // Experience tags (raw for parsing)
    prisma.experience.findMany({
      where: { tags: { not: null } },
      select: { tags: true },
    }),

    // Experience ratings
    prisma.experience.groupBy({
      by: ["rating"],
      _count: { id: true },
      where: { rating: { not: null } },
      orderBy: { rating: "asc" },
    }),

    // Experience moods
    prisma.experience.groupBy({
      by: ["mood"],
      _count: { id: true },
      where: { mood: { not: null } },
      orderBy: { _count: { id: "desc" } },
    }),
  ]);

  // --- Monthly growth ---
  const months = last6Months();
  const usersByMonth: Record<string, number> = {};
  const tripsByMonth: Record<string, number> = {};
  const expByMonth: Record<string, number> = {};
  months.forEach(m => { usersByMonth[m] = 0; tripsByMonth[m] = 0; expByMonth[m] = 0; });
  recentUsers.forEach(u => { const k = monthKey(new Date(u.createdAt)); if (usersByMonth[k] !== undefined) usersByMonth[k]++; });
  recentTrips.forEach(t => { const k = monthKey(new Date(t.createdAt)); if (tripsByMonth[k] !== undefined) tripsByMonth[k]++; });
  recentExperiences.forEach(e => { const k = monthKey(new Date(e.createdAt)); if (expByMonth[k] !== undefined) expByMonth[k]++; });

  const growthChart = months.map(m => ({
    month: m,
    users: usersByMonth[m],
    trips: tripsByMonth[m],
    experiences: expByMonth[m],
  }));

  // --- User cohorts: trips per user ---
  const tripCountsByUser = await prisma.trip.groupBy({
    by: ["userId"],
    _count: { id: true },
  });
  const cohorts = { zero: 0, one: 0, two_to_five: 0, six_plus: 0 };
  const activeUserIds = new Set(tripCountsByUser.map(t => t.userId));
  cohorts.zero = allUsers - activeUserIds.size;
  tripCountsByUser.forEach(({ _count }) => {
    const n = _count.id;
    if (n === 1) cohorts.one++;
    else if (n >= 2 && n <= 5) cohorts.two_to_five++;
    else cohorts.six_plus++;
  });

  // --- Trip duration buckets ---
  const durationBuckets = { weekend: 0, week: 0, two_weeks: 0, month_plus: 0, unknown: 0 };
  recentTrips.forEach(t => {
    if (!t.startDate || !t.endDate) { durationBuckets.unknown++; return; }
    const days = Math.ceil((new Date(t.endDate).getTime() - new Date(t.startDate).getTime()) / 86400000);
    if (days <= 3) durationBuckets.weekend++;
    else if (days <= 7) durationBuckets.week++;
    else if (days <= 14) durationBuckets.two_weeks++;
    else durationBuckets.month_plus++;
  });

  // --- Budget buckets (BRL equivalent) ---
  const budgetBuckets = { low: 0, mid: 0, high: 0, premium: 0 };
  tripsWithBudget.forEach(({ budget }) => {
    if (!budget) return;
    if (budget < 2000) budgetBuckets.low++;
    else if (budget < 6000) budgetBuckets.mid++;
    else if (budget < 15000) budgetBuckets.high++;
    else budgetBuckets.premium++;
  });

  // --- Tags frequency ---
  const tagFreq: Record<string, number> = {};
  experienceTags.forEach(({ tags }) => {
    if (!tags) return;
    tags.split(",").forEach(t => {
      const tag = t.trim().toLowerCase();
      if (tag) tagFreq[tag] = (tagFreq[tag] ?? 0) + 1;
    });
  });
  const topTags = Object.entries(tagFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([tag, count]) => ({ tag, count }));

  // --- Feature adoption ---
  const featureAdoption = [
    { feature: "Roteiro (Atividades)", count: allActivities, icon: "🗓️" },
    { feature: "Hospedagem", count: await prisma.accommodation.count(), icon: "🏨" },
    { feature: "Transporte", count: allTransports, icon: "✈️" },
    { feature: "Orçamento", count: allExpenses, icon: "💰" },
    { feature: "Documentos", count: allDocuments, icon: "📄" },
    { feature: "Lista de malas", count: allPackingItems, icon: "🧳" },
    { feature: "Diário", count: await prisma.journalEntry.count(), icon: "📔" },
    { feature: "Preparativos", count: await prisma.tripPrepItem.count(), icon: "✅" },
    { feature: "Relatos publicados", count: await prisma.experience.count(), icon: "📖" },
    { feature: "Roteiros comunidade", count: await prisma.communityRoute.count(), icon: "🗺️" },
  ].sort((a, b) => b.count - a.count);

  return NextResponse.json({
    totals: {
      users: allUsers,
      trips: allTrips,
      activities: allActivities,
      transports: allTransports,
      expenses: allExpenses,
      documents: allDocuments,
      packingItems: allPackingItems,
    },
    growthChart,
    userCohorts: cohorts,
    topDestinations: topDestinations.map(d => ({ destination: d.destination, count: d._count.id })),
    activityTypes: activityTypes.map(a => ({ type: a.type, count: a._count.id })),
    transportTypes: transportTypes.map(t => ({ type: t.type, count: t._count.id })),
    expenseCategories: expenseCategories.map(e => ({ category: e.category, count: e._count.id, total: e._sum.amount ?? 0 })),
    continents: continents.map(c => ({ continent: c.continent, count: c._count.id })),
    tripStatuses: tripStatuses.map(s => ({ status: s.status, count: s._count.id })),
    durationBuckets,
    budgetBuckets,
    topTags,
    experienceRatings: experienceRatings.map(r => ({ rating: r.rating, count: r._count.id })),
    experienceMoods: experienceMoods.map(m => ({ mood: m.mood, count: m._count.id })),
    featureAdoption,
  });
}
