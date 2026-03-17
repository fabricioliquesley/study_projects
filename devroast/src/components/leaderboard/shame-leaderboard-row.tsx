"use client";

import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";

export type LeaderboardItem = {
  id: string;
  rank: number;
  score: number;
  language: string;
  code: string;
  codeHtml: string;
};

const COLLAPSED_HEIGHT = 90;

export function ShameLeaderboardRow({
  item,
  isExpanded,
  onToggle,
}: {
  item: LeaderboardItem;
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

      <CodeBlock
        code={item.code}
        language={item.language}
        showHeader={false}
        height={isExpanded ? undefined : COLLAPSED_HEIGHT}
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
