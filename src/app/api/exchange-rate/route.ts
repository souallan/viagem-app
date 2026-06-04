import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export const revalidate = 3600;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") ?? "USD";
  const to = searchParams.get("to") ?? "BRL";

  if (from === to) {
    return NextResponse.json({ rates: { [to]: 1 }, date: new Date().toISOString().slice(0, 10) });
  }

  try {
    const res = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}`, {
      headers: { "Accept": "application/json" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`Frankfurter status ${res.status}`);

    const data = await res.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" },
    });
  } catch (err) {
    logger.error("Exchange rate fetch failed", { err: String(err) });
    return NextResponse.json({ error: "Não foi possível obter a cotação." }, { status: 502 });
  }
}
