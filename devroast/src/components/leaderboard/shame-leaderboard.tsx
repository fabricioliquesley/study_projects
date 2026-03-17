import "server-only";

import { codeToHtml } from "shiki";
import { createContext } from "@/server/context";
import { appRouter } from "@/server/routers/_app";
import { createCallerFactory } from "@/server/trpc";
import { ShameLeaderboardUI } from "./shame-leaderboard-ui";

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

export async function ShameLeaderboard() {
  const ctx = await createContext();
  const caller = createCaller(ctx);
  const { leaderboard, totalRoasts } =
    await caller.leaderboard.getShameLeaderboard();

  const leaderboardWithHtml = await Promise.all(
    leaderboard.map(async (item) => ({
      ...item,
      codeHtml: await getCodeHtml(item.code, item.language),
      codeHtmlCollapsed: await getCodeHtmlCollapsed(item.code, item.language),
    })),
  );

  return (
    <ShameLeaderboardUI
      leaderboard={leaderboardWithHtml}
      totalRoasts={totalRoasts}
    />
  );
}
