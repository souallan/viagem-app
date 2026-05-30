"use client";

import { useState, useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Announcement {
  id: string;
  text: string;
  linkLabel: string | null;
  linkUrl: string | null;
  type: string;
}

const TYPE_STYLES: Record<string, string> = {
  info:    "bg-blue-600/20 border-blue-500/30 text-blue-200",
  success: "bg-green-600/20 border-green-500/30 text-green-200",
  warning: "bg-amber-600/20 border-amber-500/30 text-amber-200",
  promo:   "bg-violet-600/20 border-violet-500/30 text-violet-200",
};

export function AnnouncementBanner() {
  const [data, setData] = useState<Announcement | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/announcement")
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (!d) return;
        const key = `dismissed-ann-${d.id}`;
        if (localStorage.getItem(key)) return;
        setData(d);
      });
  }, []);

  function dismiss() {
    if (data) localStorage.setItem(`dismissed-ann-${data.id}`, "1");
    setDismissed(true);
  }

  if (!data || dismissed) return null;

  const style = TYPE_STYLES[data.type] ?? TYPE_STYLES.info;

  return (
    <div className={`relative z-50 border-b px-4 py-2.5 flex items-center gap-3 text-sm ${style}`}>
      <p className="flex-1 text-center leading-snug">{data.text}</p>
      {data.linkLabel && data.linkUrl && (
        data.linkUrl.startsWith("http") ? (
          <a href={data.linkUrl} target="_blank" rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-1 font-semibold underline underline-offset-2 hover:opacity-80">
            {data.linkLabel} <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <Link href={data.linkUrl} className="shrink-0 font-semibold underline underline-offset-2 hover:opacity-80">
            {data.linkLabel}
          </Link>
        )
      )}
      <button onClick={dismiss} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity ml-2" aria-label="Fechar anúncio">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
