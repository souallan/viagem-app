function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-white/5 ${className ?? ""}`} />;
}

export default function ItineraryLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-9 w-32 rounded-xl" />
      </div>

      {/* Day blocks */}
      {[...Array(3)].map((_, day) => (
        <div key={day} className="space-y-2">
          {/* Day header */}
          <div className="flex items-center gap-3 py-2">
            <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          {/* Activity cards */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-white/6 p-4 flex items-center gap-3"
              style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="w-1 h-12 rounded-full bg-white/10 shrink-0" />
              <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-5 w-14 rounded-lg shrink-0" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
