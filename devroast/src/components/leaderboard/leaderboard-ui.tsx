"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export type LeaderboardPageItem = {
  id: string;
  rank: number;
  score: number;
  language: string;
  code: string;
  codeHtml: string;
  codeHtmlCollapsed: string;
};

const COLLAPSED_HEIGHT = 90;

function CodePreview({
  codeHtml,
  totalLines,
  collapsed,
}: {
  codeHtml: string;
  totalLines: number;
  collapsed: boolean;
}) {
  const visibleLines = collapsed ? Math.min(totalLines, 3) : totalLines;

  return (
    <div
      className="flex flex-1 bg-bg-input min-h-0 overflow-x-hidden overflow-y-hidden"
      style={collapsed ? { height: `${COLLAPSED_HEIGHT}px` } : undefined}
    >
      <div className="flex w-10 flex-col border-r border-border-primary bg-bg-surface py-[10px] text-center self-stretch gap-1.5 overflow-hidden">
        {Array.from({ length: visibleLines }).map((_, i) => (
          <span
            key={`ln-${i}`}
            className="font-mono text-xs leading-6 text-text-tertiary pl-[10px]"
          >
            {i + 1}
          </span>
        ))}
      </div>
      <div
        className="flex-1 overflow-x-hidden overflow-y-auto py-[14px] px-4 font-mono text-[13px] leading-6 gap-1.5"
        // biome-ignore lint: shiki HTML is safe
        dangerouslySetInnerHTML={{ __html: codeHtml }}
      />
    </div>
  );
}

function LeaderboardEntry({
  item,
  isExpanded,
  onToggle,
}: {
  item: LeaderboardPageItem;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const codeLines = item.code.split("\n");
  const totalLines = codeLines.length;
  const hasMoreLines = totalLines > 3;

  return (
    <div className="flex flex-col border border-border-primary rounded-m overflow-hidden">
      <div className="flex h-12 items-center justify-between border-b border-border-primary px-5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[13px] text-text-tertiary">#</span>
            <span className="font-mono text-[13px] font-bold text-accent-amber">
              {item.rank}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs text-text-tertiary">score:</span>
            <span className="font-mono text-[13px] font-bold text-accent-red">
              {item.score}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-text-secondary">
            {item.language}
          </span>
          <span className="font-mono text-xs text-text-tertiary">
            {totalLines} lines
          </span>
        </div>
      </div>

      <CodePreview
        codeHtml={isExpanded ? item.codeHtml : item.codeHtmlCollapsed}
        totalLines={totalLines}
        collapsed={!isExpanded}
      />

      {hasMoreLines && !isExpanded && (
        <div className="flex justify-center border-t border-border-primary bg-bg-surface py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="font-mono text-xs text-text-secondary hover:text-text-primary"
          >
            Show more ({totalLines - 3} lines)
          </Button>
        </div>
      )}

      {isExpanded && hasMoreLines && (
        <div className="flex justify-center border-t border-border-primary bg-bg-surface py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="font-mono text-xs text-text-secondary hover:text-text-primary"
          >
            Show less
          </Button>
        </div>
      )}
    </div>
  );
}

export type LeaderboardUIProps = {
  leaderboard: LeaderboardPageItem[];
  totalRoasts: number;
  avgScore: number;
};

export function LeaderboardUI({
  leaderboard,
  totalRoasts,
  avgScore,
}: LeaderboardUIProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section className="flex flex-col gap-5">
      {leaderboard.map((item) => (
        <LeaderboardEntry
          key={item.id}
          item={item}
          isExpanded={expandedId === item.id}
          onToggle={() =>
            setExpandedId(expandedId === item.id ? null : item.id)
          }
        />
      ))}

      <p className="px-4 text-center font-mono text-xs text-text-tertiary">
        showing top {leaderboard.length} of {totalRoasts.toLocaleString()} · avg
        score: {avgScore.toFixed(1)}/10
      </p>
    </section>
  );
}
