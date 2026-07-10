function Skeleton({ className }: { className?: string }) {
  return <div className={`skeleton rounded-xl ${className ?? ""}`} />;
}

export default function BudgetLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>

      {/* Summary card */}
      <div className="rounded-2xl border border-slate-200 p-5 space-y-4" style={{ background: "#ffffff" }}>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-9 w-40" />
          </div>
          <div className="space-y-2 text-right">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-28" />
          </div>
        </div>
        <Skeleton className="h-3 w-full rounded-full" />
        {/* Category bars */}
        <div className="space-y-2.5 pt-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-1.5 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Expense list */}
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-200 p-3.5 flex items-center gap-3"
            style={{ background: "#ffffff" }}>
            <Skeleton className="w-1 h-8 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-1/2" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-5 w-16 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
