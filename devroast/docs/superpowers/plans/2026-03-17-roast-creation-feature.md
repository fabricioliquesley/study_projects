# Roast Creation Feature Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow users to submit code for AI analysis with configurable roast mode, store results in DB, and display on a dedicated results page.

**Architecture:** Create a tRPC submission router with create/get mutations, integrate Google Gemini API for AI analysis, connect CodeInputSection to mutation, and update the roast result page to fetch dynamic data.

**Tech Stack:** Next.js 16, tRPC v11, Drizzle ORM, Google Gemini API, shiki for syntax highlighting

---

## File Structure

```
src/
├── lib/
│   └── gemini.ts                 # Google Gemini API integration
├── server/
│   └── routers/
│       ├── _app.ts               # Add submissionRouter
│       └── submission.ts         # NEW: submission router with mutations
├── components/
│   └── code-input-section.tsx    # Connect button to mutation
├── app/
│   └── roast/
│       └── [id]/
│           └── page.tsx          # Fetch dynamic data
├── db/
│   ├── schema.ts                 # Check existing queries
│   └── queries.ts                # Use existing query helpers
└── .env                         # Add GOOGLE_API_KEY
```

---

## Chunk 1: Setup and Google Gemini Integration

**Files:**
- Create: `src/lib/gemini.ts`
- Modify: `.env` (add GOOGLE_API_KEY)
- Check: `src/db/queries.ts` for existing helpers

- [ ] **Step 1: Check existing queries in src/db/queries.ts**

Read the file to understand available helpers for creating submissions, analyses, issues, and diffs.

- [ ] **Step 2: Create src/lib/gemini.ts with Gemini API integration**

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY ?? "");

export type RoastIssue = {
  severity: "critical" | "warning" | "good";
  issueType: string;
  line: number;
  description: string;
  roastComment: string;
  diff: {
    originalCode: string;
    fixedCode: string;
    explanation: string;
  } | null;
};

export type RoastResult = {
  roastSummary: string;
  score: number;
  issues: RoastIssue[];
};

const BRUTALLY_HONEST_PROMPT = `You are a technical code reviewer. Analyze the following code and provide a constructive, objective critique.

For each issue found, provide:
- severity: "critical" | "warning" | "good"
- issueType: specific technical issue category
- line: line number where issue occurs
- description: technical explanation of the problem
- roastComment: a brief honest comment about the issue

Return your response as a JSON object with this structure:
{
  "roastSummary": "Brief summary of the code quality (1-2 sentences)",
  "score": 1-10 rating,
  "issues": [
    {
      "severity": "critical" | "warning" | "good",
      "issueType": "string",
      "line": number,
      "description": "string",
      "roastComment": "string",
      "diff": {
        "originalCode": "string",
        "fixedCode": "string",
        "explanation": "string"
      } | null
    }
  ]
}

Code to analyze:
{language}
---
{code}`;

const FULL_ROAST_PROMPT = `You are a sarcastic, humorous code reviewer who roasts bad code. Be critical but funny. Use expressions like "POG em estado puro" (Programação Orientada a Gambiarras), "isso vai dar problema", "quem escreveu isso precisa de ajuda".

For each issue found, provide:
- severity: "critical" | "warning" | "good"
- issueType: specific technical issue category
- line: line number where issue occurs
- description: technical explanation of the problem
- roastComment: a sarcastic, humorous roast comment

Return your response as a JSON object with this structure:
{
  "roastSummary": "Brief sarcastic summary of the code quality",
  "score": 1-10 rating (1 = worst, most roasted code),
  "issues": [
    {
      "severity": "critical" | "warning" | "good",
      "issueType": "string",
      "line": number,
      "description": "string",
      "roastComment": "sarcastic humorous comment",
      "diff": {
        "originalCode": "string",
        "fixedCode": "string",
        "explanation": "string"
      } | null
    }
  ]
}

Code to analyze:
{language}
---
{code}`;

export async function analyzeCode(
  code: string,
  language: string,
  roastMode: boolean,
): Promise<RoastResult> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  const prompt = roastMode ? FULL_ROAST_PROMPT : BRUTALLY_HONEST_PROMPT;
  const finalPrompt = prompt
    .replace("{language}", language)
    .replace("{code}", code);

  const result = await model.generateContent(finalPrompt);
  const response = result.response.text();
  
  // Extract JSON from response (handle potential markdown code blocks)
  const jsonMatch = response.match(/```json\n?([\s\S]*?)\n?```/) 
    || response.match(/```\n?([\s\S]*?)\n?```/)
    || [null, response];
  
  const jsonStr = jsonMatch[1] || response;
  const parsed = JSON.parse(jsonStr.trim());
  
  return {
    roastSummary: parsed.roastSummary,
    score: parsed.score,
    issues: parsed.issues || [],
  };
}
```

- [ ] **Step 3: Add GOOGLE_API_KEY to .env**

Add to `.env`:
```
GOOGLE_API_KEY=your_google_gemini_api_key_here
```

- [ ] **Step 4: Install Google Gemini package**

```bash
pnpm add @google/generative-ai
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/gemini.ts .env.example
git commit -m "feat: add Google Gemini API integration for code analysis"
```

---

## Chunk 2: Create Submission Router

**Files:**
- Create: `src/server/routers/submission.ts`
- Modify: `src/server/routers/_app.ts` (add submissionRouter)

- [ ] **Step 1: Check existing database schema and queries**

Read `src/db/schema.ts` to understand table structures, and `src/db/queries.ts` for query helpers.

- [ ] **Step 2: Create src/server/routers/submission.ts**

```typescript
import { z } from "zod";
import { asc, sql, desc } from "drizzle-orm";
import { analyses, submissions } from "@/db/schema";
import { publicProcedure, router } from "../trpc";
import { analyzeCode, type RoastResult } from "@/lib/gemini";
import { submissionQueries, analysisQueries, issueQueries, diffQueries } from "@/db/queries";
import { v4 as uuidv4 } from "uuid";

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

function normalizeLanguage(lang: string): string {
  return LANGUAGE_MAP[lang.toLowerCase()] || lang;
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
      // 1. Create submission
      const submissionId = uuidv4();
      await submissionQueries.create({
        id: submissionId,
        code: input.code,
        language: input.language,
        roastMode: input.roastMode,
        score: null, // Will be updated after analysis
      });

      // 2. Call Gemini API
      const normalizedLang = normalizeLanguage(input.language);
      let result: RoastResult;
      
      try {
        result = await analyzeCode(input.code, normalizedLang, input.roastMode);
      } catch (error) {
        console.error("Gemini API error:", error);
        // Create a fallback result if API fails
        result = {
          roastSummary: "Failed to analyze code. Please try again.",
          score: 5,
          issues: [],
        };
      }

      // 3. Save analysis
      const analysisId = uuidv4();
      await analysisQueries.create({
        id: analysisId,
        submissionId,
        roastSummary: result.roastSummary,
      });

      // 4. Save issues and diffs
      for (const issue of result.issues) {
        const issueId = uuidv4();
        await issueQueries.create({
          id: issueId,
          analysisId,
          severity: issue.severity,
          issueType: issue.issueType,
          line: issue.line,
          column: null,
          description: issue.description,
          roastComment: issue.roastComment,
        });

        // Save diff if present
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

      // 5. Update submission with score
      await submissionQueries.updateScore(submissionId, result.score);

      return { id: submissionId };
    }),

  getById: publicProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      // Get submission
      const submission = await ctx.db
        .select()
        .from(submissions)
        .where(sql`${submissions.id} = ${input}`)
        .limit(1);

      if (!submission[0]) {
        return null;
      }

      // Get analysis
      const analysis = await ctx.db
        .select()
        .from(analyses)
        .where(sql`${analyses.submissionId} = ${input}`)
        .limit(1);

      if (!analysis[0]) {
        return { submission: submission[0], analysis: null, issues: [], diffs: [] };
      }

      // Get issues
      const issues = await ctx.db
        .select()
        .from(analyses)
        .innerJoin(analyses, sql`${analyses.id} = ${analysis[0].id}`)
        .where(sql`${analyses.submissionId} = ${input}`);

      return {
        submission: submission[0],
        analysis: analysis[0],
        issues: issues,
        diffs: [],
      };
    }),
});
```

- [ ] **Step 3: Add submissionRouter to _app.ts**

```typescript
import { router } from "../trpc";
import { leaderboardRouter } from "./leaderboard";
import { submissionRouter } from "./submission"; // Add this

export const appRouter = router({
  leaderboard: leaderboardRouter,
  submission: submissionRouter, // Add this
});
```

- [ ] **Step 4: Commit**

```bash
git add src/server/routers/submission.ts src/server/routers/_app.ts
git commit -m "feat: add submission router with create and getById mutations"
```

---

## Chunk 3: Connect CodeInputSection to Mutation

**Files:**
- Modify: `src/components/code-input-section.tsx`

- [ ] **Step 1: Read current CodeInputSection component**

```bash
cat src/components/code-input-section.tsx
```

- [ ] **Step 2: Update CodeInputSection to use tRPC mutation**

Add import for trpc and useMutation hook:
```typescript
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
```

Add state and mutation:
```typescript
const router = useRouter();
const utils = trpc.useUtils();

const createSubmission = trpc.submission.create.useMutation({
  onSuccess: (data) => {
    router.push(`/roast/${data.id}`);
  },
});
```

Update button onClick:
```typescript
onClick={() => {
  if (!code.trim()) return;
  createSubmission.mutate({
    code: code.trim(),
    language: detectedLanguage,
    roastMode,
  });
}}
```

Add loading state to button:
```typescript
disabled={createSubmission.isPending}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/code-input-section.tsx
git commit -m "feat: connect CodeInputSection to submission.create mutation"
```

---

## Chunk 4: Update Roast Result Page

**Files:**
- Modify: `src/app/roast/[id]/page.tsx`

- [ ] **Step 1: Read current roast page**

```bash
cat src/app/roast/[id]/page.tsx
```

- [ ] **Step 2: Convert to dynamic page with tRPC**

Replace static data with dynamic fetching:
```typescript
import { createContext } from "@/server/context";
import { appRouter } from "@/server/routers/_app";
import { createCallerFactory } from "@/server/trpc";
import { notFound } from "next/navigation";

export default async function RoastPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const ctx = await createContext();
  const caller = createCaller(ctx);
  
  const result = await caller.submission.getById(id);
  
  if (!result || !result.submission) {
    notFound();
  }

  // Render with result.submission, result.analysis, result.issues
  // ... (update the static content to use dynamic data)
}
```

- [ ] **Step 3: Update display components to use dynamic data**

Replace hardcoded `STATIC_CODE`, `STATIC_ISSUES`, etc. with data from `result`.

- [ ] **Step 4: Commit**

```bash
git add src/app/roast/[id]/page.tsx
git commit -m "feat: make roast result page dynamic with database data"
```

---

## Chunk 5: Testing and Verification

**Files:**
- Test: Manual testing

- [ ] **Step 1: Set up GOOGLE_API_KEY**

Ensure `.env` has valid Google API key.

- [ ] **Step 2: Run the app and test submission**

```bash
pnpm dev
```

- [ ] **Step 3: Test the full flow**

1. Go to homepage
2. Enter some bad code (e.g., using `var`, no error handling, etc.)
3. Toggle roast mode on/off
4. Click "roast_my_code" button
5. Should redirect to `/roast/[id]`
6. Should see analysis results

- [ ] **Step 4: Test both roast modes**

- With roastMode OFF: should get technical, objective feedback
- With roastMode ON: should get sarcastic feedback with phrases like "POG em estado puro"

- [ ] **Step 5: Verify data is saved**

Check that:
- Submission is created in database
- Analysis is saved
- Issues are saved
- Score is assigned
- Leaderboard shows the new submission

- [ ] **Step 6: Commit**

```bash
git commit -m "test: verify roast creation flow works end-to-end"
```

---

## Summary

Total chunks: 5

- Chunk 1: Setup + Google Gemini integration (5 steps)
- Chunk 2: Create submission router (4 steps)
- Chunk 3: Connect CodeInputSection (3 steps)
- Chunk 4: Update roast result page (4 steps)
- Chunk 5: Testing and verification (6 steps)
