"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  Plus, ExternalLink, Trash2, Calendar, Shield, AlertTriangle,
  CheckCircle2, Clock, Lock, FileWarning, ArrowRight,
} from "lucide-react";
import { affiliates, type AffiliatePartner } from "@/lib/affiliates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";

interface Document {
  id: string;
  title: string;
  type: string;
  url: string | null;
  expiresAt: string | null;
  notes: string | null;
}

interface Trip {
  startDate: string | null;
}

const TYPE_STYLE: Record<string, { icon: string; color: string; bg: string; border: string }> = {
  PASSPORT:  { icon: "🛂", color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200"   },
  VISA:      { icon: "📋", color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200" },
  INSURANCE: { icon: "🛡️", color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200"  },
  TICKET:    { icon: "🎫", color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
  VOUCHER:   { icon: "📄", color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200" },
  OTHER:     { icon: "📎", color: "text-gray-700",   bg: "bg-gray-50",   border: "border-gray-200"   },
};

const DOC_TYPE_KEYS = ["PASSPORT", "VISA", "INSURANCE", "TICKET", "VOUCHER", "OTHER"] as const;

function daysUntilExpiry(expiresAt: string, referenceDate: Date): number {
  const exp = new Date(expiresAt + "T12:00:00Z");
  return Math.round((exp.getTime() - referenceDate.getTime()) / 86400000);
}

type ExpiryStatus = "expired" | "critical" | "warning" | "ok" | null;

function getExpiryStatus(expiresAt: string | null, tripStartDate: Date | null): ExpiryStatus {
  if (!expiresAt) return null;
  const ref = tripStartDate ?? new Date();
  const days = daysUntilExpiry(expiresAt, ref);
  if (days < 0) return "expired";
  if (days < 90) return "critical";
  if (days < 180) return "warning";
  return "ok";
}

function ExpiryBadge({ expiresAt, tripStartDate }: { expiresAt: string; tripStartDate: Date | null }) {
  const { t, lang } = useLanguage();
  const locale = lang === "pt" ? "pt-BR" : lang === "es" ? "es-ES" : "en-US";
  const ref = tripStartDate ?? new Date();
  const days = daysUntilExpiry(expiresAt, ref);
  const status = getExpiryStatus(expiresAt, tripStartDate);

  const exp = new Date(expiresAt + "T12:00:00Z");
  const formatted = exp.toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" });

  if (status === "expired") {
    return (
      <div className="flex items-center gap-1.5 text-xs text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg font-semibold">
        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
        {t.documents.expiredOn} {formatted}
      </div>
    );
  }
  if (status === "critical") {
    return (
      <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-lg font-semibold">
        <FileWarning className="h-3.5 w-3.5 shrink-0" />
        {t.documents.expiresIn} {days}d — {formatted}
      </div>
    );
  }
  if (status === "warning") {
    return (
      <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg font-medium">
        <Clock className="h-3.5 w-3.5 shrink-0" />
        {t.documents.expiresIn} {days}d — {formatted}
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-500 px-2.5 py-1 rounded-lg">
      <Calendar className="h-3.5 w-3.5 shrink-0" />
      {t.documents.validUntil} {formatted}
    </div>
  );
}

function InsurancePartnerCard({ p }: { p: AffiliatePartner }) {
  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`flex items-center gap-3 p-3.5 rounded-xl border bg-white hover:shadow-md hover:-translate-y-0.5 transition-all group ${p.borderColor}`}
    >
      <span className="text-2xl shrink-0">{p.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="text-sm font-bold text-gray-900">{p.name}</span>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${p.badgeColor}`}>{p.badge}</span>
        </div>
        <p className="text-xs text-gray-500 truncate">{p.tagline}</p>
      </div>
      <ExternalLink className="h-3.5 w-3.5 text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" />
    </a>
  );
}

function InsuranceSection({ hasInsurance }: { hasInsurance: boolean }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(!hasInsurance);

  if (hasInsurance && !open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-xs text-green-700 hover:text-green-800 font-medium transition-colors"
      >
        <Shield className="h-3.5 w-3.5" />
        {t.documents.insuranceSeeOptions}
        <ArrowRight className="h-3 w-3" />
      </button>
    );
  }

  return (
    <div className={cn(
      "rounded-2xl border overflow-hidden",
      hasInsurance ? "border-green-100 bg-gradient-to-br from-green-50 to-white" : "border-amber-100 bg-gradient-to-br from-amber-50 to-white"
    )}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/60 transition-colors"
      >
        <span className="text-lg">{hasInsurance ? "✅" : "⚠️"}</span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800">
            {hasInsurance ? t.documents.insuranceRegistered : t.documents.insuranceNone}
          </p>
          <p className={`text-xs ${hasInsurance ? "text-green-700" : "text-amber-700"}`}>
            {hasInsurance ? t.documents.insuranceCompare : t.documents.insuranceRisk}
          </p>
        </div>
        <ArrowRight className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-90" : ""} ${hasInsurance ? "text-green-400" : "text-amber-400"}`} />
      </button>

      {open && (
        <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {affiliates.insurance.map((p) => <InsurancePartnerCard key={p.id} p={p} />)}
          <p className="col-span-full text-[10px] text-gray-400 text-right">
            {t.documents.partnerDisclosure}
          </p>
        </div>
      )}
    </div>
  );
}

export default function DocumentsPage() {
  const { t, lang } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const [docs, setDocs] = useState<Document[]>([]);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", type: "PASSPORT", url: "", expiresAt: "", notes: "" });

  const locale = lang === "pt" ? "pt-BR" : lang === "es" ? "es-ES" : "en-US";
  const docTypes = t.documents.docTypes as Record<string, string>;

  async function load() {
    const [docsRes, tripRes] = await Promise.all([
      fetch(`/api/trips/${id}/documents`),
      fetch(`/api/trips/${id}`),
    ]);
    if (docsRes.ok) setDocs(await docsRes.json());
    if (tripRes.ok) setTrip(await tripRes.json());
  }

  useEffect(() => { load(); }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/trips/${id}/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      setOpen(false);
      setForm({ title: "", type: "PASSPORT", url: "", expiresAt: "", notes: "" });
      load();
    }
  }

  async function handleDelete(docId: string) {
    if (!confirm(t.documents.confirmDelete)) return;
    await fetch(`/api/trips/${id}/documents`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ docId }),
    });
    load();
  }

  const tripStartDate = useMemo(() => {
    if (!trip?.startDate) return null;
    return new Date(trip.startDate);
  }, [trip]);

  const grouped = useMemo(() => {
    const order = ["PASSPORT", "VISA", "INSURANCE", "TICKET", "VOUCHER", "OTHER"];
    const map: Record<string, Document[]> = {};
    docs.forEach((doc) => {
      if (!map[doc.type]) map[doc.type] = [];
      map[doc.type].push(doc);
    });
    return order.filter((t) => map[t]?.length > 0).map((t) => ({ type: t, docs: map[t] }));
  }, [docs]);

  const alerts = useMemo(() => {
    return docs
      .filter((doc) => {
        const status = getExpiryStatus(doc.expiresAt, tripStartDate);
        return status === "expired" || status === "critical" || status === "warning";
      })
      .sort((a, b) => {
        const statusOrder = { expired: 0, critical: 1, warning: 2, ok: 3, null: 4 };
        return (statusOrder[getExpiryStatus(a.expiresAt, tripStartDate) ?? "null"] ?? 4) -
               (statusOrder[getExpiryStatus(b.expiresAt, tripStartDate) ?? "null"] ?? 4);
      });
  }, [docs, tripStartDate]);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <Lock className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{t.documents.vaultTitle}</h2>
            <p className="text-xs text-gray-500">
              {docs.length} {docs.length !== 1 ? t.documents.vaultStoredPlural : t.documents.vaultStored}
            </p>
          </div>
        </div>
        <Button onClick={() => setOpen(true)} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> {t.common.add}
        </Button>
      </div>

      {/* Trip date info */}
      {tripStartDate && (
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
          <Calendar className="h-3.5 w-3.5 text-primary-500 shrink-0" />
          <span>{t.documents.alertsFrom}{" "}
            <span className="font-semibold text-gray-700">
              {tripStartDate.toLocaleDateString(locale, { day: "2-digit", month: "long", year: "numeric" })}
            </span>
          </span>
        </div>
      )}

      {/* Alerts banner */}
      {alerts.length > 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
            <p className="font-semibold text-red-800 text-sm">
              {alerts.length} {alerts.length !== 1 ? t.documents.needsAttentionPlural : t.documents.needsAttention}
            </p>
          </div>
          <div className="space-y-2">
            {alerts.map((doc) => {
              const style = TYPE_STYLE[doc.type];
              const status = getExpiryStatus(doc.expiresAt, tripStartDate);
              return (
                <div key={doc.id} className="flex items-center gap-3 bg-white rounded-xl px-3 py-2.5 border border-red-100">
                  <span className="text-lg shrink-0">{style.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                  </div>
                  <div className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded-full shrink-0",
                    status === "expired" ? "bg-red-100 text-red-700" :
                    status === "critical" ? "bg-red-50 text-red-600" :
                    "bg-amber-50 text-amber-700"
                  )}>
                    {status === "expired" ? t.documents.statusExpired :
                     status === "critical" ? t.documents.statusCritical : t.documents.statusWarning}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {docs.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="w-20 h-20 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-5">
            <Shield className="h-9 w-9 text-blue-300" />
          </div>
          <p className="font-semibold text-gray-600 mb-1">{t.documents.emptyTitle}</p>
          <p className="text-sm max-w-xs mx-auto">{t.documents.emptyDesc}</p>
          <Button onClick={() => setOpen(true)} size="sm" className="gap-2 mt-5">
            <Plus className="h-4 w-4" /> {t.documents.addFirst}
          </Button>
        </div>
      )}

      {/* Grouped documents */}
      {grouped.map(({ type, docs: typeDocs }) => {
        const style = TYPE_STYLE[type];
        const label = docTypes[type] ?? type;
        return (
          <div key={type}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{style.icon}</span>
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">{label}</h3>
              <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{typeDocs.length}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {typeDocs.map((doc) => {
                const status = getExpiryStatus(doc.expiresAt, tripStartDate);
                return (
                  <div
                    key={doc.id}
                    className={cn(
                      "rounded-2xl border p-4 transition-shadow hover:shadow-md",
                      status === "expired" ? "border-red-300 bg-red-50" :
                      status === "critical" ? "border-red-200 bg-white" :
                      status === "warning" ? "border-amber-200 bg-white" :
                      "border-gray-100 bg-white"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-lg border", style.color, style.bg, style.border)}>
                            {label}
                          </span>
                          {status === "ok" && doc.expiresAt && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                          )}
                          {(status === "critical" || status === "expired") && (
                            <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                          )}
                          {status === "warning" && (
                            <Clock className="h-3.5 w-3.5 text-amber-500" />
                          )}
                        </div>

                        <h4 className="font-semibold text-gray-900 mb-1.5 leading-snug">{doc.title}</h4>

                        {doc.expiresAt && (
                          <div className="mb-2">
                            <ExpiryBadge expiresAt={doc.expiresAt} tripStartDate={tripStartDate} />
                          </div>
                        )}

                        {doc.notes && (
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{doc.notes}</p>
                        )}

                        {doc.url && (
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {t.documents.openDocument}
                          </a>
                        )}
                      </div>

                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors shrink-0 mt-0.5"
                        aria-label={t.common.delete}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Insurance partners */}
      <InsuranceSection hasInsurance={docs.some((d) => d.type === "INSURANCE")} />

      {/* Passport validity notice */}
      {docs.length > 0 && !docs.some((d) => d.type === "PASSPORT") && (
        <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm">
          <Shield className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-blue-800">{t.documents.passportTip}</p>
            <p className="text-blue-600 text-xs mt-0.5">{t.documents.passportTipDesc}</p>
          </div>
        </div>
      )}

      {/* Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogHeader>
          <DialogTitle>{t.documents.dialogNew}</DialogTitle>
          <DialogClose onClose={() => setOpen(false)} />
        </DialogHeader>
        <DialogBody>
          <form id="doc-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{t.documents.formType}</Label>
              <Select name="type" value={form.type} onChange={handleChange}>
                {DOC_TYPE_KEYS.map((v) => (
                  <option key={v} value={v}>{TYPE_STYLE[v].icon} {docTypes[v] ?? v}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t.documents.formName}</Label>
              <Input name="title" value={form.title} onChange={handleChange} required placeholder={t.documents.formNamePh} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>{t.documents.formExpiry}</Label>
                <Input name="expiresAt" type="date" value={form.expiresAt} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>{t.documents.formUrl}</Label>
                <Input name="url" type="url" value={form.url} onChange={handleChange} placeholder="https://..." />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t.documents.formNotes}</Label>
              <Textarea name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder={t.documents.formNotesPh} />
            </div>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>{t.common.cancel}</Button>
          <Button type="submit" form="doc-form" disabled={loading}>{loading ? t.common.saving : t.common.add}</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
