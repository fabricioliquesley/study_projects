"use client";

import { useState } from "react";

export type LeaderboardItem = {
  id: string;
  rank: number;
  score: number;
  language: string;
  code: string;
};

const INITIAL_LINES = 3;

export function ShameLeaderboardRow({ item }: { item: LeaderboardItem }) {
  const [open, setOpen] = useState(false);
  const codeLines = item.code.split("\n");
  const hasMoreLines = codeLines.length > INITIAL_LINES;

  const previewCode = codeLines.slice(0, INITIAL_LINES).join("\n");
  const displayCode = open
    ? item.code
    : hasMoreLines
      ? `${previewCode}...`
      : item.code;

  return (
    <div className="flex flex-col border-t border-border-primary">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center px-5 py-3 hover:bg-bg-elevated transition-colors cursor-pointer"
      >
        <span className="w-12 font-mono text-xs text-text-primary">
          #{item.rank}
        </span>
        <span className="w-16 font-mono text-xs text-accent-red">
          {item.score}/10
        </span>
        <span className="flex-1 font-mono text-xs text-text-secondary whitespace-pre">
          {displayCode}
        </span>
        <span className="w-24 font-mono text-xs text-text-tertiary">
          {item.language}
        </span>
      </button>

      {open && (
        <div className="border-t border-border-primary bg-bg-input p-4">
          <pre className="font-mono text-xs text-text-primary whitespace-pre overflow-x-auto">
            {item.code}
          </pre>
        </div>
      )}
    </div>
  );
}
