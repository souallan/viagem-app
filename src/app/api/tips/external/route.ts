import { NextResponse } from "next/server";
import Parser from "rss-parser";
import { RSS_FEEDS, type ExternalTip } from "@/lib/rss-feeds";

// Revalida cache a cada 1 hora
export const revalidate = 3600;

const parser = new Parser({
  timeout: 8000,
  headers: { "User-Agent": "RoteiroApp/1.0 RSS Reader" },
});

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function makeId(feedName: string, link: string): string {
  const raw = feedName + "|" + link;
  return "ext-" + Buffer.from(raw).toString("base64url").slice(0, 22);
}

export async function GET() {
  const results = await Promise.allSettled(
    RSS_FEEDS.map(async (feed) => {
      const parsed = await parser.parseURL(feed.url);
      return parsed.items.slice(0, 6).map((item): ExternalTip => ({
        id: makeId(feed.name, item.link ?? item.title ?? ""),
        title: (item.title ?? "").trim(),
        excerpt: stripHtml(item.contentSnippet ?? item.summary ?? item.description ?? "").slice(0, 240),
        url: item.link ?? "",
        sourceName: feed.name,
        lang: feed.lang,
        publishedAt: item.pubDate
          ? new Date(item.pubDate).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10),
        category: feed.category,
        categoryColor: feed.categoryColor,
      }));
    })
  );

  const tips: ExternalTip[] = results
    .filter((r): r is PromiseFulfilledResult<ExternalTip[]> => r.status === "fulfilled")
    .flatMap((r) => r.value)
    .filter((t) => t.title && t.url);

  const failed = results.filter((r) => r.status === "rejected").length;

  return NextResponse.json(
    { tips, meta: { total: tips.length, failed } },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" } }
  );
}
