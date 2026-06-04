function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-white/5 ${className ?? ""}`} />;
}

export default function TripLoading() {
  return (
    <div className="space-y-5">
      {/* Trip header */}
      <div className="rounded-2xl border border-white/6 p-5 space-y-3" style={{ background: "rgba(255,255,255,0.03)" }}>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-7 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 pt-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[...Array(7)].map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 shrink-0 rounded-lg" />
        ))}
      </div>

      {/* Content area */}
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-white/6 p-4" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
              <Skeleton className="h-4 w-1/3" />
            </div>
            <Skeleton className="h-3 w-full mb-2" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
