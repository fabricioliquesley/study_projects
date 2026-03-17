import Link from "next/link";

export type LeaderboardItem = {
  id: string;
  rank: number;
  score: number;
  language: string;
  code: string;
};

export type ShameLeaderboardUIProps = {
  leaderboard: LeaderboardItem[];
  totalRoasts: number;
};

function formatCode(code: string): string {
  const truncated = code.slice(0, 20);
  return code.length > 20 ? `${truncated}...` : truncated;
}

export function ShameLeaderboardUI({
  leaderboard,
  totalRoasts,
}: ShameLeaderboardUIProps) {
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

        {leaderboard.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center px-5 py-4 border-t border-border-primary"
          >
            <span className="w-12 font-mono text-xs text-text-primary">
              #{index + 1}
            </span>
            <span className="w-16 font-mono text-xs text-accent-red">
              {item.score}/10
            </span>
            <span className="flex-1 font-mono text-xs text-text-primary">
              {formatCode(item.code)}
            </span>
            <span className="w-24 font-mono text-xs text-text-secondary">
              {item.language}
            </span>
          </div>
        ))}
      </div>

      <p className="px-4 text-center font-mono text-xs text-text-tertiary">
        showing top 3 of {totalRoasts.toLocaleString()} · view full leaderboard
        &gt;&gt;
      </p>
    </div>
  );
}
