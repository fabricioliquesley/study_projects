import { sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import {
  analysisQueries,
  diffQueries,
  issueQueries,
  submissionQueries,
} from "@/db/queries";
import { analyses, submissions } from "@/db/schema";
import { analyzeCode, type RoastResult } from "@/lib/gemini";
import { publicProcedure, router } from "../trpc";

const LANGUAGE_MAP: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  java: "Java",
  go: "Go",
  rust: "Rust",
  c: "C",
  cpp: "C++",
  csharp: "C#",
  ruby: "Ruby",
  php: "PHP",
  swift: "Swift",
  kotlin: "Kotlin",
  scala: "Scala",
  sql: "SQL",
  html: "HTML",
  css: "CSS",
  json: "JSON",
  yaml: "YAML",
  bash: "Bash",
  markdown: "Markdown",
};

const VALID_ISSUE_TYPES = [
  "naming",
  "performance",
  "security",
  "best_practice",
  "syntax",
  "style",
  "error_handling",
  "architecture",
  "documentation",
  "logic",
] as const;

function normalizeLanguage(lang: string): string {
  return LANGUAGE_MAP[lang.toLowerCase()] || lang;
}

function normalizeIssueType(
  issueType: string,
): (typeof VALID_ISSUE_TYPES)[number] {
  const normalized = issueType.toLowerCase().replace(/\s+/g, "_");

  if (
    VALID_ISSUE_TYPES.includes(normalized as (typeof VALID_ISSUE_TYPES)[number])
  ) {
    return normalized as (typeof VALID_ISSUE_TYPES)[number];
  }

  if (
    normalized.includes("naming") ||
    normalized.includes("variable") ||
    normalized.includes("const") ||
    normalized.includes("function_name")
  ) {
    return "naming";
  }
  if (
    normalized.includes("performance") ||
    normalized.includes("optimization") ||
    normalized.includes("complexity") ||
    normalized.includes("loop")
  ) {
    return "performance";
  }
  if (
    normalized.includes("security") ||
    normalized.includes("vulnerability") ||
    normalized.includes("injection") ||
    normalized.includes("xss")
  ) {
    return "security";
  }
  if (
    normalized.includes("best_practice") ||
    normalized.includes("best practice") ||
    normalized.includes("convention") ||
    normalized.includes("idiomatic")
  ) {
    return "best_practice";
  }
  if (
    normalized.includes("syntax") ||
    normalized.includes("parse") ||
    normalized.includes("error")
  ) {
    return "syntax";
  }
  if (
    normalized.includes("style") ||
    normalized.includes("format") ||
    normalized.includes("whitespace") ||
    normalized.includes("indentation")
  ) {
    return "style";
  }
  if (
    normalized.includes("error_handling") ||
    normalized.includes("error handling") ||
    normalized.includes("exception") ||
    normalized.includes("try_catch") ||
    normalized.includes("null") ||
    normalized.includes("undefined")
  ) {
    return "error_handling";
  }
  if (
    normalized.includes("architecture") ||
    normalized.includes("design") ||
    normalized.includes("pattern") ||
    normalized.includes("coupling")
  ) {
    return "architecture";
  }
  if (
    normalized.includes("documentation") ||
    normalized.includes("comment") ||
    normalized.includes("readme") ||
    normalized.includes("jsdoc")
  ) {
    return "documentation";
  }

  return "logic";
}

export const submissionRouter = router({
  create: publicProcedure
    .input(
      z.object({
        code: z.string().max(2000),
        language: z.string(),
        roastMode: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      const submissionId = uuidv4();
      await submissionQueries.create({
        id: submissionId,
        code: input.code,
        language: input.language as unknown as Parameters<
          typeof submissionQueries.create
        >[0]["language"],
        roastMode: input.roastMode,
        score: null,
      });

      const normalizedLang = normalizeLanguage(input.language);
      let result: RoastResult;

      try {
        result = await analyzeCode(input.code, normalizedLang, input.roastMode);
      } catch (error) {
        console.error("Gemini API error:", error);
        result = {
          roastSummary: "Failed to analyze code. Please try again.",
          score: 5,
          issues: [],
        };
      }

      const analysisId = uuidv4();
      await analysisQueries.create({
        id: analysisId,
        submissionId,
        roastSummary: result.roastSummary,
      });

      for (const issue of result.issues) {
        const issueId = uuidv4();
        await issueQueries.create({
          id: issueId,
          analysisId,
          severity: issue.severity,
          issueType: normalizeIssueType(issue.issueType),
          line: issue.line,
          column: null,
          description: issue.description,
          roastComment: issue.roastComment,
        });

        if (issue.diff) {
          await diffQueries.create({
            id: uuidv4(),
            issueId,
            originalCode: issue.diff.originalCode,
            fixedCode: issue.diff.fixedCode,
            explanation: issue.diff.explanation,
          });
        }
      }

      await submissionQueries.updateScore(submissionId, result.score);

      return { id: submissionId };
    }),

  getById: publicProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      const submission = await ctx.db
        .select()
        .from(submissions)
        .where(sql`${submissions.id} = ${input}`)
        .limit(1);

      if (!submission[0]) {
        return null;
      }

      const analysis = await ctx.db
        .select()
        .from(analyses)
        .where(sql`${analyses.submissionId} = ${input}`)
        .limit(1);

      if (!analysis[0]) {
        return {
          submission: submission[0],
          analysis: null,
          issues: [],
          diffs: [],
        };
      }

      const issuesList = await issueQueries.findByAnalysisId(analysis[0].id);

      const diffsList = await Promise.all(
        issuesList.map((issue) => diffQueries.findByIssueId(issue.id)),
      );

      return {
        submission: submission[0],
        analysis: analysis[0],
        issues: issuesList,
        diffs: diffsList.flat(),
      };
    }),
});
