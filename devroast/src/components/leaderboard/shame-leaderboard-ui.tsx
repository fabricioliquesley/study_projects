"use client";

import Link from "next/link";
import { useState } from "react";
import {
  type LeaderboardItem,
  ShameLeaderboardRow,
} from "./shame-leaderboard-row";

export type ShameLeaderboardUIProps = {
  leaderboard: LeaderboardItem[];
  totalRoasts: number;
};

export function ShameLeaderboardUI({
  leaderboard,
  totalRoasts,
}: ShameLeaderboardUIProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="flex w-[960px] flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-accent-green">
            {"//"}
          </span>
          <span className="font-mono text-sm font-bold text-text-primary">
            shame_leaderboard
          </span>
        </div>
        <Link
          href="/leaderboard"
          className="flex items-center gap-1 rounded border border-border-primary px-3 py-1.5 font-mono text-xs text-text-secondary hover:bg-bg-elevated transition-colors"
        >
          $ view_all &gt;&gt;
        </Link>
      </div>

      <p className="font-mono text-[13px] text-text-tertiary">
        {"//"} the worst code on the internet, ranked by shame
      </p>

      <section className="flex flex-col gap-5">
        {leaderboard.map((item, index) => (
          <ShameLeaderboardRow
            key={item.id}
            item={{ ...item, rank: index + 1 }}
            isExpanded={expandedId === item.id}
            onToggle={() =>
              setExpandedId(expandedId === item.id ? null : item.id)
            }
          />
        ))}
      </section>

      <p className="px-4 text-center font-mono text-xs text-text-tertiary">
        showing top 3 of {totalRoasts.toLocaleString()} · view full leaderboard
        &gt;&gt;
      </p>
    </div>
  );
}
