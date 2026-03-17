export function ShameLeaderboardSkeleton() {
  return (
    <div className="flex w-[960px] flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-4 w-8 animate-pulse rounded bg-bg-elevated" />
          <div className="h-4 w-36 animate-pulse rounded bg-bg-elevated" />
        </div>
        <div className="h-6 w-20 animate-pulse rounded border border-border-primary" />
      </div>

      <div className="h-4 w-72 animate-pulse rounded bg-bg-elevated" />

      <div className="flex flex-col rounded border border-border-primary">
        <div className="flex h-10 items-center bg-bg-surface px-5">
          <span className="w-12 font-mono text-xs text-text-tertiary">
            rank
          </span>
          <span className="w-16 font-mono text-xs text-text-tertiary">
            score
          </span>
          <span className="flex-1 font-mono text-xs text-text-tertiary">
            code
          </span>
          <span className="w-24 font-mono text-xs text-text-tertiary">
            lang
          </span>
        </div>

        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-5 py-4 border-t border-border-primary"
          >
            <div className="h-3 w-8 animate-pulse rounded bg-bg-elevated" />
            <div className="h-3 w-10 animate-pulse rounded bg-bg-elevated" />
            <div className="flex-1 h-3 animate-pulse rounded bg-bg-elevated" />
            <div className="h-3 w-16 animate-pulse rounded bg-bg-elevated" />
          </div>
        ))}
      </div>

      <div className="h-3 w-48 animate-pulse rounded bg-bg-elevated mx-auto" />
    </div>
  );
}
