import "server-only";

import { codeToHtml } from "shiki";
import { LeaderboardUI } from "@/components/leaderboard/leaderboard-ui";
import { createContext } from "@/server/context";
import { appRouter } from "@/server/routers/_app";
import { createCallerFactory } from "@/server/trpc";

export const revalidate = 3600;

const createCaller = createCallerFactory(appRouter);

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "go",
  "rust",
  "c",
  "cpp",
  "csharp",
  "ruby",
  "php",
  "swift",
  "kotlin",
  "scala",
  "sql",
  "html",
  "css",
  "json",
  "yaml",
  "bash",
  "markdown",
] as const;

async function getCodeHtml(code: string, language: string) {
  const normalizedLanguage = LANGUAGES.includes(
    language as (typeof LANGUAGES)[number],
  )
    ? language
    : "javascript";

  return await codeToHtml(code.trim(), {
    lang: normalizedLanguage,
    theme: "vesper",
  });
}

async function getCodeHtmlCollapsed(code: string, language: string) {
  const lines = code.trim().split("\n");
  const collapsedCode = lines.slice(0, 3).join("\n");
  return await getCodeHtml(collapsedCode, language);
}

export default async function LeaderboardPage() {
  const ctx = await createContext();
  const caller = createCaller(ctx);
  const { leaderboard, totalRoasts, avgScore } =
    await caller.leaderboard.getLeaderboard();

  const leaderboardWithHtml = await Promise.all(
    leaderboard.map(async (item) => ({
      ...item,
      codeHtml: await getCodeHtml(item.code, item.language),
      codeHtmlCollapsed: await getCodeHtmlCollapsed(item.code, item.language),
    })),
  );

  return (
    <main className="w-full max-w-[1440px] mx-auto px-[80px] py-10 flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[32px] font-bold text-accent-green">
            &gt;
          </span>
          <h1 className="font-mono text-[28px] font-bold text-text-primary">
            shame_leaderboard
          </h1>
        </div>
        <p className="font-mono text-sm text-text-secondary">
          {`// the most roasted code on the internet`}
        </p>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-text-tertiary">
            {totalRoasts.toLocaleString()} submissions
          </span>
          <span className="text-text-tertiary">·</span>
          <span className="font-mono text-xs text-text-tertiary">
            avg score: {avgScore.toFixed(1)}/10
          </span>
        </div>
      </section>

      <LeaderboardUI
        leaderboard={leaderboardWithHtml}
        totalRoasts={totalRoasts}
        avgScore={avgScore}
      />
    </main>
  );
}
