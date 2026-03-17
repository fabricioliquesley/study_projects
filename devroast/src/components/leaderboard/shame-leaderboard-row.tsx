"use client";

export type LeaderboardItem = {
  id: string;
  rank: number;
  score: number;
  language: string;
  code: string;
  codeHtml: string;
};

const INITIAL_LINES = 3;

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
  const hasMoreLines = codeLines.length > INITIAL_LINES;

  const previewCode = codeLines.slice(0, INITIAL_LINES).join("\n");
  const displayCode = hasMoreLines ? `${previewCode}...` : item.code;

  return (
    <div className="border-t border-border-primary">
      <button
        type="button"
        onClick={onToggle}
        className="flex h-10 w-full items-center px-5 hover:bg-bg-elevated transition-colors cursor-pointer"
      >
        <span className="w-12 font-mono text-xs text-text-primary text-left">
          #{item.rank}
        </span>
        <span className="w-16 font-mono text-xs text-accent-red text-left">
          {item.score}/10
        </span>
        <span className="flex-1 font-mono text-xs text-text-secondary whitespace-pre text-left">
          {displayCode}
        </span>
        <span className="w-24 font-mono text-xs text-text-tertiary text-left">
          {item.language}
        </span>
      </button>

      {isExpanded && (
        <div className="border-t border-border-primary bg-bg-input">
          <div
            className="py-3 px-4 font-mono text-[13px] leading-6"
            // biome-ignore lint: shiki HTML is safe
            dangerouslySetInnerHTML={{ __html: item.codeHtml }}
          />
        </div>
      )}
    </div>
  );
}
