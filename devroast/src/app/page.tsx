"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CodeEditorHighlight,
  detectLanguage,
  type Language,
} from "@/components/code-editor-highlight";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { MAX_CHARS } from "@/constants";

const LEADERBOARD_DATA = [
  { rank: 1, score: 1.2, code: "calculateTotal", language: "javascript" },
  { rank: 2, score: 2.8, code: "fetchUserData", language: "typescript" },
  { rank: 3, score: 3.1, code: "processPayment", language: "python" },
];

function CodeInputSection() {
  const [code, setCode] = useState("");
  const [roastMode, setRoastMode] = useState(true);
  const [language, setLanguage] = useState<Language>("javascript");

  const isEmpty = code.trim() === "";
  const isOverLimit = code.length > MAX_CHARS;

  useEffect(() => {
    if (code.trim()) {
      const detected = detectLanguage(code);
      setLanguage(detected);
    }
  }, [code]);

  return (
    <div className="flex w-[960px] flex-col gap-4">
      <CodeEditorHighlight
        value={code}
        onChange={setCode}
        language={language}
        onLanguageChange={setLanguage}
        showHeader
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <Toggle
              checked={roastMode}
              onCheckedChange={(checked) => setRoastMode(checked)}
            />
            <span className="font-mono text-[13px] text-accent-green">
              roast mode
            </span>
          </div>
          <span className="font-mono text-xs text-text-tertiary">
            {/* maximum sarcasm enabled */}
          </span>
        </div>
        <Button variant="primary" size="lg" disabled={isEmpty || isOverLimit}>
          <span className="text-[#0a0a0a]">$ roast_my_code</span>
        </Button>
      </div>
    </div>
  );
}

function LeaderboardPreview() {
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

        {LEADERBOARD_DATA.map((item) => (
          <div
            key={item.rank}
            className="flex items-center px-5 py-4 border-t border-border-primary"
          >
            <span className="w-12 font-mono text-xs text-text-primary">
              #{item.rank}
            </span>
            <span className="w-16 font-mono text-xs text-accent-red">
              {item.score}/10
            </span>
            <span className="flex-1 font-mono text-xs text-text-primary">
              {item.code}
            </span>
            <span className="w-24 font-mono text-xs text-text-secondary">
              {item.language}
            </span>
          </div>
        ))}
      </div>

      <p className="px-4 text-center font-mono text-xs text-text-tertiary">
        showing top 3 of 2,847 · view full leaderboard &gt;&gt;
      </p>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-[1440px] flex-col items-center gap-8 px-10 py-20">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="flex items-center gap-3 font-mono text-4xl font-bold">
          <span className="text-accent-green">$</span>
          <span className="text-text-primary">
            paste your code. get roasted.
          </span>
        </h1>
        <p className="font-mono text-sm text-text-secondary">
          {"//"} drop your code below and we&apos;ll rate it — brutally honest
          or full roast mode
        </p>
      </div>

      <CodeInputSection />

      <div className="flex justify-center gap-6">
        <span className="font-mono text-xs text-text-tertiary">
          2,847 codes roasted
        </span>
        <span className="font-mono text-xs text-text-tertiary">·</span>
        <span className="font-mono text-xs text-text-tertiary">
          avg score: 4.2/10
        </span>
      </div>

      <div className="h-[60px]" />

      <LeaderboardPreview />

      <div className="h-[60px]" />
    </main>
  );
}
