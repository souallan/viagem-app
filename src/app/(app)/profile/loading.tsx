function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-white/5 ${className ?? ""}`} />;
}

export default function ProfileLoading() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Avatar + name */}
      <div className="rounded-2xl border border-white/6 p-6 flex items-center gap-5"
        style={{ background: "rgba(255,255,255,0.03)" }}>
        <Skeleton className="w-20 h-20 rounded-2xl shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-3 w-32 mt-1" />
        </div>
      </div>

      {/* Form fields */}
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-2xl border border-white/6 p-5 space-y-3"
          style={{ background: "rgba(255,255,255,0.03)" }}>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      ))}

      <Skeleton className="h-11 w-full rounded-xl" />
    </div>
  );
}
