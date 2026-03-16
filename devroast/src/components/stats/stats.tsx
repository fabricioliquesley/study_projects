"use client";

import NumberFlow from "@number-flow/react";
import { trpc } from "@/trpc/react";

export function Stats() {
  const { data } = trpc.stats.getMetrics.useQuery();

  const totalSubmissions = data?.totalSubmissions ?? 0;
  const avgScore = data?.avgScore ?? 0;

  return (
    <div className="flex justify-center gap-6">
      <div className="flex items-center gap-2">
        <NumberFlow
          value={totalSubmissions}
          className="font-mono text-xs text-text-primary"
        />
        <span className="font-mono text-xs text-text-tertiary">
          codes roasted
        </span>
      </div>
      <span className="font-mono text-xs text-text-tertiary">·</span>
      <div className="flex items-center gap-2">
        <NumberFlow
          value={avgScore}
          className="font-mono text-xs text-text-primary"
          format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
        />
        <span className="font-mono text-xs text-text-tertiary">avg score</span>
      </div>
    </div>
  );
}
