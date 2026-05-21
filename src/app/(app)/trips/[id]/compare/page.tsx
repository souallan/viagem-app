"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, Search, ArrowRight } from "lucide-react";

interface Trip {
  destination: string;
  startDate: string | null;
}

interface SearchForm {
  from: string;
  to: string;
  date: string;
  returnDate: string;
  passengers: string;
}

interface Provider {
  name: string;
  logo: string;
  description: string;
  modes: string[];
  color: string;
  buildUrl: (form: SearchForm) => string;
}

function isoDate(d: string) {
  return d.split("T")[0];
}

const PROVIDERS: Provider[] = [
  {
    name: "Omio",
    logo: "🚄",
    description: "Trens, ônibus e voos em toda a Europa e além",
    modes: ["✈️ Voo", "🚆 Trem", "🚌 Ônibus"],
    color: "border-blue-200 bg-blue-50",
    buildUrl: ({ from, to, date, passengers }) =>
      `https://www.omio.com/app/search-results#` +
      `origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}` +
      `&outboundDate=${date}&pax=${passengers}`,
  },
  {
    name: "FlixBus",
    logo: "🟩",
    description: "Ônibus entre cidades — tarifas low-cost",
    modes: ["🚌 Ônibus"],
    color: "border-green-200 bg-green-50",
    buildUrl: ({ from, to, date, passengers }) =>
      `https://shop.flixbus.com/search?` +
      `departureCity=${encodeURIComponent(from)}&arrivalCity=${encodeURIComponent(to)}` +
      `&departureDate=${date}&adult=${passengers}`,
  },
  {
    name: "Google Flights",
    logo: "✈️",
    description: "Compare preços de voos de todas as companhias",
    modes: ["✈️ Voo"],
    color: "border-sky-200 bg-sky-50",
    buildUrl: ({ from, to, date, returnDate, passengers }) => {
      const base = `https://www.google.com/travel/flights/search?`;
      const q = `q=Voos+de+${encodeURIComponent(from)}+para+${encodeURIComponent(to)}+em+${date}`;
      const extra = returnDate ? `&return_date=${returnDate}` : "";
      return base + q + extra + `&hl=pt-BR`;
    },
  },
  {
    name: "Rome2Rio",
    logo: "🗺️",
    description: "Compara todos os meios de transporte entre cidades",
    modes: ["✈️ Voo", "🚆 Trem", "🚌 Ônibus", "🚢 Balsa", "🚗 Carro"],
    color: "border-orange-200 bg-orange-50",
    buildUrl: ({ from, to }) =>
      `https://www.rome2rio.com/map/${encodeURIComponent(from)}/${encodeURIComponent(to)}`,
  },
  {
    name: "Kayak",
    logo: "🔍",
    description: "Comparador de voos, hotéis e aluguel de carros",
    modes: ["✈️ Voo", "🚗 Carro"],
    color: "border-yellow-200 bg-yellow-50",
    buildUrl: ({ from, to, date, returnDate }) => {
      const ret = returnDate || date;
      return `https://www.kayak.com.br/flights/${encodeURIComponent(from)}-${encodeURIComponent(to)}/${date}/${ret}`;
    },
  },
  {
    name: "Skyscanner",
    logo: "🌐",
    description: "Voos baratos — alertas de preço disponíveis",
    modes: ["✈️ Voo", "🏨 Hotel", "🚗 Carro"],
    color: "border-teal-200 bg-teal-50",
    buildUrl: ({ from, to, date }) =>
      `https://www.skyscanner.com.br/transporte/voos/${encodeURIComponent(from.substring(0, 3).toUpperCase())}/${encodeURIComponent(to.substring(0, 3).toUpperCase())}/${date.replace(/-/g, "")}/`,
  },
];

export default function ComparePage() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [form, setForm] = useState<SearchForm>({
    from: "",
    to: "",
    date: "",
    returnDate: "",
    passengers: "1",
  });
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    fetch(`/api/trips/${id}`)
      .then((r) => r.json())
      .then((t: Trip) => {
        setTrip(t);
        setForm((f) => ({
          ...f,
          to: t.destination,
          date: t.startDate ? isoDate(t.startDate) : "",
        }));
      });
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearched(true);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Cotação de preços</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Compare voos, trens e ônibus entre os melhores sites de busca
        </p>
      </div>

      {/* Search form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="h-4 w-4" /> Busca de transporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Origem *</Label>
                <Input
                  name="from"
                  value={form.from}
                  onChange={handleChange}
                  placeholder="Ex: São Paulo"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Destino *</Label>
                <Input
                  name="to"
                  value={form.to}
                  onChange={handleChange}
                  placeholder="Ex: Rio de Janeiro"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Data de ida *</Label>
                <Input
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Data de volta</Label>
                <Input
                  name="returnDate"
                  type="date"
                  value={form.returnDate}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Passageiros</Label>
                <Input
                  name="passengers"
                  type="number"
                  min="1"
                  max="9"
                  value={form.passengers}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <span className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                {form.from || "Origem"}
                <ArrowRight className="h-4 w-4 text-gray-400" />
                {form.to || "Destino"}
              </span>
              <Button type="submit" className="ml-auto gap-2">
                <Search className="h-4 w-4" /> Buscar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {searched && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">
            Resultados para{" "}
            <span className="font-bold text-gray-900">
              {form.from} → {form.to}
            </span>{" "}
            em{" "}
            <span className="font-bold text-gray-900">
              {form.date ? new Date(form.date + "T12:00").toLocaleDateString("pt-BR") : "—"}
            </span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PROVIDERS.map((p) => (
              <Card
                key={p.name}
                className={`border-2 transition-shadow hover:shadow-md ${p.color}`}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{p.logo}</span>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {p.modes.map((m) => (
                      <span
                        key={m}
                        className="text-xs bg-white/80 rounded-full px-2 py-0.5 border border-white"
                      >
                        {m}
                      </span>
                    ))}
                  </div>

                  <a
                    href={p.buildUrl(form)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button size="sm" className="w-full gap-2">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Buscar no {p.name}
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-xs text-gray-400 text-center pt-2">
            Os links abrem os sites parceiros com sua busca pré-preenchida. Preços e disponibilidade podem variar.
          </p>
        </div>
      )}

      {!searched && trip && (
        <div className="text-center py-10 text-gray-400">
          <div className="text-5xl mb-3">💰</div>
          <p className="font-medium">Preencha a busca acima</p>
          <p className="text-sm mt-1">
            Destino pré-preenchido com <strong>{trip.destination}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
