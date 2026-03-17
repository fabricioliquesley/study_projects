import "server-only";

import { notFound } from "next/navigation";
import {
  AnalysisCardBadge,
  AnalysisCardDescription,
  AnalysisCardRoot,
  AnalysisCardTitle,
} from "@/components/ui/analysis-card";
import type { BadgeVariants } from "@/components/ui/badge";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";
import { ScoreRing } from "@/components/ui/score-ring";
import { createContext } from "@/server/context";
import { appRouter } from "@/server/routers/_app";
import { createCallerFactory } from "@/server/trpc";

const createCaller = createCallerFactory(appRouter);

export default async function RoastResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const ctx = await createContext();
  const caller = createCaller(ctx);

  const result = await caller.submission.getById(id);

  if (!result || !result.submission) {
    notFound();
  }

  const { submission, analysis, issues, diffs } = result;

  const code = submission.code;
  const language = submission.language;
  const score = submission.score ?? 0;
  const roastSummary = analysis?.roastSummary ?? "No analysis available.";
  const roastIssues = issues.map((issue) => ({
    id: issue.id,
    type: issue.severity,
    title: issue.issueType,
    description: issue.description,
    line: issue.line,
    roastComment: issue.roastComment,
  }));

  const criticalCount = roastIssues.filter((i) => i.type === "critical").length;
  const warningCount = roastIssues.filter((i) => i.type === "warning").length;
  const goodCount = roastIssues.filter((i) => i.type === "good").length;

  const diffLines =
    diffs.length > 0
      ? diffs.flatMap((diff) => {
          const lines: Array<{
            type: "added" | "removed" | "unchanged";
            content: string;
          }> = [];
          const originalLines = diff.originalCode.split("\n");
          const fixedLines = diff.fixedCode.split("\n");

          originalLines.forEach((line) => {
            lines.push({ type: "removed", content: line });
          });
          fixedLines.forEach((line) => {
            lines.push({ type: "added", content: line });
          });

          return lines;
        })
      : [];

  return (
    <main className="mx-auto flex max-w-[1440px] flex-col gap-10 px-10 py-10">
      <section className="flex items-center gap-12">
        <ScoreRing score={score} total={10} />
        <div className="flex flex-1 flex-col gap-4">
          <h1 className="font-mono text-2xl font-bold text-text-primary">
            Roast Summary
          </h1>
          <p className="font-mono text-sm text-text-secondary flex-1">
            {roastSummary}
          </p>
          <div className="flex items-center gap-3">
            <Badge variant="critical">{criticalCount} Critical</Badge>
            <Badge variant="warning">{warningCount} Warning</Badge>
            <Badge variant="good">{goodCount} Good</Badge>
          </div>
        </div>
      </section>

      <div className="h-px w-full bg-border-primary" />

      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-accent-green">
            {"//"}
          </span>
          <span className="font-mono text-sm font-bold text-text-primary">
            submitted_code
          </span>
        </div>
        <div className="rounded border border-border-primary">
          <CodeBlock code={code} language={language} showHeader={false} />
        </div>
      </section>

      <div className="h-px w-full bg-border-primary" />

      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-accent-green">
            {"//"}
          </span>
          <span className="font-mono text-sm font-bold text-text-primary">
            issues_found
          </span>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {roastIssues.map((issue) => (
            <AnalysisCardRoot key={issue.id}>
              <div className="flex items-center justify-between">
                <AnalysisCardBadge
                  variant={issue.type as BadgeVariants["variant"]}
                >
                  {issue.type}
                </AnalysisCardBadge>
                <span className="font-mono text-xs text-text-tertiary">
                  line {issue.line}
                </span>
              </div>
              <AnalysisCardTitle>
                {issue.roastComment || issue.title}
              </AnalysisCardTitle>
              <AnalysisCardDescription>
                {issue.description}
              </AnalysisCardDescription>
            </AnalysisCardRoot>
          ))}
        </div>
      </section>

      {diffLines.length > 0 && (
        <>
          <div className="h-px w-full bg-border-primary" />

          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-accent-green">
                {"//"}
              </span>
              <span className="font-mono text-sm font-bold text-text-primary">
                suggested_fix
              </span>
            </div>
            <div className="rounded border border-border-primary">
              <CodeBlock
                diffLines={diffLines}
                language={language}
                showHeader={false}
                showLineNumbers={false}
              />
            </div>
          </section>
        </>
      )}
    </main>
  );
}
