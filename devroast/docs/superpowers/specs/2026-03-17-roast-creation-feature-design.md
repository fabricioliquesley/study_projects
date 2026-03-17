# Roast Creation Feature - Design Spec

## Overview

This document describes the design for the core roast creation feature, allowing users to submit code snippets and receive AI-powered analysis with customizable tone.

## Goals

- Allow users to submit code for AI analysis
- Support two roast modes: "brutally honest" (technical) and "full roast" (sarcastic)
- Store results in the database for leaderboard display
- Display results on a dedicated page (`/roast/[id]`)

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  CodeInputSection │ ──▶ │  submission mutation │ ──▶ │  AI (Gemini)    │
│  (client)        │     │  (tRPC)            │     │  (Google AI)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                         │
                                                         ▼
                                                  ┌─────────────────┐
                                                  │  Save to DB     │
                                                  │  (submissions,  │
                                                  │   analyses,     │
                                                  │   issues)       │
                                                  └─────────────────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  /roast/[id]    │ ◀── │  Redirect        │ ◀── │  Return result  │
│  (result page)  │     │  (Router)        │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

## Data Flow

1. User submits code via `CodeInputSection` component
2. tRPC mutation `createSubmission` receives the code, language, and roastMode
3. Submission is saved to database with status "processing"
4. Gemini API is called with appropriate prompt based on roastMode
5. Response is parsed and saved to `analyses`, `issues`, and `diffs` tables
6. Submission is updated with score
7. User is redirected to `/roast/[id]`

## API Design

### tRPC Router: submission.ts

```typescript
export const submissionRouter = router({
  create: publicProcedure
    .input(z.object({
      code: z.string().max(MAX_CHARS),
      language: z.string(),
      roastMode: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      // 1. Save submission
      // 2. Call Gemini API
      // 3. Parse and save analysis
      // 4. Return submission ID
    }),

  getById: publicProcedure
    .input(z.string().uuid())
    .query(async ({ input }) => {
      // Return submission with analysis, issues, and diffs
    }),
});
```

## Prompt Design

### brutally honest (roastMode: false)

```
You are a technical code reviewer. Analyze the following code and provide a constructive, objective critique.

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
{code}
```

### full roast (roastMode: true)

```
You are a sarcastic, humorous code reviewer who roasts bad code. Be critical but funny. Use expressions like "POG em estado puro" (Programação Orientada a Gambiarras), "isso vai dar problema", "quem escreveu isso precisa de ajuda".

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
{code}
```

## Environment Variables

```env
GOOGLE_API_KEY=your_google_gemini_api_key
```

## Component Changes

### CodeInputSection (modify)

- Connect submit button to tRPC mutation
- Add loading state during submission
- Redirect to `/roast/[id]` after successful submission

### /roast/[id]/page.tsx (modify)

- Fetch submission data from tRPC
- Display dynamic content instead of static data
- Handle loading and error states

## Database Schema (already exists)

| Table | Columns |
|-------|---------|
| submissions | id, code, language, roastMode, score, createdAt |
| analyses | id, submissionId (FK), roastSummary, createdAt |
| issues | id, analysisId (FK), severity, issueType, line, column, description, roastComment, createdAt |
| diffs | id, issueId (FK), originalCode, fixedCode, explanation, createdAt |

## Acceptance Criteria

1. User can submit code via the input form
2. Submit button triggers the mutation and shows loading state
3. Gemini API is called with appropriate prompt based on roastMode
4. Analysis results are saved to the database
5. User is redirected to the result page after submission
6. Result page displays the full analysis with issues and diffs
7. Score is displayed and can be used for leaderboard ranking
8. roastMode toggle changes the tone of the analysis
