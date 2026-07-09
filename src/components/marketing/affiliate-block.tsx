"use client";

import { affiliates, type AffiliatePartner } from "@/lib/affiliates";
import { trackEvent } from "@/lib/analytics";

type GroupKey = keyof typeof affiliates;

function AffiliateCard({ p, destination }: { p: AffiliatePartner; destination?: string }) {
  const url = destination && p.buildUrl ? p.buildUrl(destination) : p.url;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={() => trackEvent("affiliate_click", { partner: p.id, destination: destination ?? "" })}
      className={`flex items-center gap-3 p-3.5 rounded-xl border bg-white hover:shadow-md hover:-translate-y-0.5 transition-all ${p.borderColor}`}
    >
      <span className="text-2xl shrink-0">{p.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="text-sm font-bold text-gray-900">{p.name}</span>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${p.badgeColor}`}>{p.badge}</span>
        </div>
        <p className="text-xs text-gray-500 truncate">{p.tagline}</p>
      </div>
      <span className="text-xs font-bold text-gray-400 shrink-0">↗</span>
    </a>
  );
}

/**
 * Bloco de parceiros (afiliados) para conteúdo orgânico (blog, /roteiro, /tips).
 * rel="sponsored" + disclosure. Se `destination` for passado, usa links contextuais.
 */
export function AffiliateBlock({
  groups,
  destination,
  title = "Organize sua viagem com nossos parceiros",
}: {
  groups: GroupKey[];
  destination?: string;
  title?: string;
}) {
  const partners = groups.flatMap((g) => affiliates[g]);
  if (partners.length === 0) return null;

  return (
    <section className="not-prose my-8 rounded-2xl border border-gray-100 bg-gray-50/60 p-4 sm:p-5">
      <p className="text-sm font-bold text-gray-900 mb-3">{title}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {partners.map((p) => (
          <AffiliateCard key={p.id} p={p} destination={destination} />
        ))}
      </div>
      <p className="text-[10px] text-gray-400 mt-3">
        Links de parceiros — ao reservar por eles, podemos receber uma comissão sem custo extra para você.
      </p>
    </section>
  );
}
