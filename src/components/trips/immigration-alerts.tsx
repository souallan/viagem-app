"use client";

import { AlertTriangle, CheckCircle, ExternalLink, Shield, FileText, Heart } from "lucide-react";

const SCHENGEN_KEYWORDS = [
  "alemanha", "germany", "berlin", "berlim", "munique", "munich", "frankfurt",
  "austria", "áustria", "viena", "vienna",
  "bélgica", "belgium", "bruxelas", "brussels",
  "república tcheca", "czech", "praga", "prague",
  "dinamarca", "denmark", "copenhague", "copenhagen",
  "estônia", "estonia", "tallin",
  "finlândia", "finland", "helsinque", "helsinki",
  "França", "france", "paris", "nice", "lyon", "bordeaux", "marseille",
  "grécia", "greece", "atenas", "athens", "santorini", "mykonos", "creta", "crete",
  "hungria", "hungary", "budapeste", "budapest",
  "islândia", "iceland", "reykjavik",
  "itália", "italy", "roma", "rome", "veneza", "venice", "florença", "florence", "milão", "milan", "napoles", "naples",
  "letônia", "latvia", "riga",
  "liechtenstein",
  "lituânia", "lithuania", "vilnius",
  "luxemburgo", "luxembourg",
  "malta",
  "holanda", "netherlands", "amsterdam",
  "noruega", "norway", "oslo",
  "polônia", "poland", "varsóvia", "warsaw", "cracóvia", "krakow",
  "portugal", "lisboa", "lisbon", "porto",
  "eslováquia", "slovakia", "bratislava",
  "eslovênia", "slovenia", "ljubljana",
  "espanha", "spain", "barcelona", "madri", "madrid", "sevilha", "seville",
  "suécia", "sweden", "estocolmo", "stockholm",
  "suíça", "switzerland", "zurique", "zurich", "genebra", "geneva", "berna", "bern",
];

const YELLOW_FEVER_KEYWORDS = [
  "africa", "ghana", "nigeria", "kenya", "quênia", "tanzânia", "tanzania",
  "uganda", "ethiopia", "etiópia", "angola", "camarões", "cameroon",
  "amazônia", "amazonia", "manaus", "belém", "santarém",
  "peru", "lima", "colômbia", "colombia", "bogotá", "bogota",
  "equador", "ecuador", "venezuela", "bolivia", "bolívia",
];

const JAPAN_KEYWORDS = ["japão", "japan", "tokyo", "tóquio", "osaka", "kyoto", "quioto", "hiroshima"];

const USA_KEYWORDS = ["estados unidos", "usa", "united states", "nova york", "new york", "miami", "orlando", "los angeles", "chicago", "san francisco"];

interface Alert {
  type: "warning" | "info" | "success";
  icon: React.ElementType;
  title: string;
  body: string;
  link?: { label: string; url: string };
}

function matchesAny(destination: string, keywords: string[]): boolean {
  const lower = destination.toLowerCase();
  return keywords.some((k) => lower.includes(k.toLowerCase()));
}

export default function ImmigrationAlerts({ destination }: { destination: string }) {
  const isSchengen = matchesAny(destination, SCHENGEN_KEYWORDS);
  const isYellowFeverRisk = matchesAny(destination, YELLOW_FEVER_KEYWORDS);
  const isJapan = matchesAny(destination, JAPAN_KEYWORDS);
  const isUSA = matchesAny(destination, USA_KEYWORDS);

  const alerts: Alert[] = [];

  alerts.push({
    type: "info",
    icon: FileText,
    title: "Validade do passaporte",
    body: "Passaporte deve ser válido por ao menos 6 meses após a data de retorno. Confira antes de viajar.",
  });

  if (isSchengen) {
    alerts.push({
      type: "warning",
      icon: Shield,
      title: "ETIAS obrigatório (Área Schengen)",
      body: "Brasileiros precisam do ETIAS a partir de 2025. Custa €7, válido por 3 anos. Solicite com antecedência no site oficial.",
      link: { label: "Solicitar ETIAS", url: "https://travel-europe.europa.eu/etias_en" },
    });
    alerts.push({
      type: "warning",
      icon: Heart,
      title: "Seguro viagem obrigatório (Schengen)",
      body: "Cobertura mínima de €30.000 para despesas médicas é exigida. Sem comprovante, seu visto pode ser negado.",
    });
  }

  if (isUSA) {
    alerts.push({
      type: "warning",
      icon: Shield,
      title: "ESTA obrigatório (Estados Unidos)",
      body: "Brasileiros precisam do ESTA para entrar nos EUA sem visto. Solicite com antecedência em esta.cbp.dhs.gov. Custa US$21.",
      link: { label: "Solicitar ESTA", url: "https://esta.cbp.dhs.gov" },
    });
  }

  if (isYellowFeverRisk) {
    alerts.push({
      type: "warning",
      icon: Heart,
      title: "Vacina Febre Amarela recomendada",
      body: "Vacinação recomendada ou obrigatória para esta região. Tome pelo menos 10 dias antes de viajar. Carregue o Certificado Internacional de Vacinação.",
    });
  }

  if (isJapan) {
    alerts.push({
      type: "success",
      icon: CheckCircle,
      title: "Japão — Visto dispensado para brasileiros",
      body: "Brasileiros entram no Japão sem visto por até 90 dias. Tenha passagem de retorno e comprovante de fundos suficientes.",
    });
  }

  const colors = {
    warning: "border-amber-200 bg-amber-50",
    info: "border-blue-200 bg-blue-50",
    success: "border-emerald-200 bg-emerald-50",
  };
  const iconColors = { warning: "text-amber-600", info: "text-blue-600", success: "text-emerald-600" };
  const titleColors = { warning: "text-amber-900", info: "text-blue-900", success: "text-emerald-900" };

  return (
    <div className="space-y-2.5">
      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-500" aria-hidden="true" />
        Documentação e alertas para {destination}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {alerts.map((alert, i) => (
          <div key={i} className={`rounded-xl border p-3.5 ${colors[alert.type]}`}>
            <div className="flex items-start gap-2.5">
              <alert.icon className={`h-4 w-4 mt-0.5 shrink-0 ${iconColors[alert.type]}`} aria-hidden="true" />
              <div>
                <p className={`text-xs font-semibold mb-0.5 ${titleColors[alert.type]}`}>{alert.title}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{alert.body}</p>
                {alert.link && (
                  <a
                    href={alert.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-teal-700 hover:text-teal-900"
                  >
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    {alert.link.label}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
