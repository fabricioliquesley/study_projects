import { and, count, desc, eq, sql } from "drizzle-orm";
import { db } from "./connection";
import {
  type Analysis,
  analyses,
  type Diff,
  diffs,
  type Issue,
  issues,
  type NewAnalysis,
  type NewDiff,
  type NewIssue,
  type NewSubmission,
  type Submission,
  submissions,
} from "./schema";

export const submissionQueries = {
  create: (data: NewSubmission) =>
    db.insert(submissions).values(data).returning(),

  findById: (id: string) =>
    db.select().from(submissions).where(eq(submissions.id, id)).limit(1),

  findAll: (limit = 10, offset = 0) =>
    db
      .select()
      .from(submissions)
      .orderBy(desc(submissions.createdAt))
      .limit(limit)
      .offset(offset),

  updateScore: (id: string, score: number) =>
    db
      .update(submissions)
      .set({ score })
      .where(eq(submissions.id, id))
      .returning(),

  delete: (id: string) =>
    db.delete(submissions).where(eq(submissions.id, id)).returning(),
};

export const analysisQueries = {
  create: (data: NewAnalysis) => db.insert(analyses).values(data).returning(),

  findById: (id: string) =>
    db.select().from(analyses).where(eq(analyses.id, id)).limit(1),

  findBySubmissionId: (submissionId: string) =>
    db
      .select()
      .from(analyses)
      .where(eq(analyses.submissionId, submissionId))
      .limit(1),

  findAll: (limit = 10, offset = 0) =>
    db
      .select()
      .from(analyses)
      .orderBy(desc(analyses.createdAt))
      .limit(limit)
      .offset(offset),

  delete: (id: string) =>
    db.delete(analyses).where(eq(analyses.id, id)).returning(),
};

export const issueQueries = {
  create: (data: NewIssue) => db.insert(issues).values(data).returning(),

  createMany: (data: NewIssue[]) => db.insert(issues).values(data).returning(),

  findById: (id: string) =>
    db.select().from(issues).where(eq(issues.id, id)).limit(1),

  findByAnalysisId: (analysisId: string) =>
    db
      .select()
      .from(issues)
      .where(eq(issues.analysisId, analysisId))
      .orderBy(issues.line),

  countByAnalysisId: (analysisId: string) =>
    db
      .select({ count: count() })
      .from(issues)
      .where(eq(issues.analysisId, analysisId)),

  countBySeverity: (
    analysisId: string,
    severity: "critical" | "warning" | "good",
  ) =>
    db
      .select({ count: count() })
      .from(issues)
      .where(
        and(eq(issues.analysisId, analysisId), eq(issues.severity, severity)),
      ),

  delete: (id: string) =>
    db.delete(issues).where(eq(issues.id, id)).returning(),
};

export const diffQueries = {
  create: (data: NewDiff) => db.insert(diffs).values(data).returning(),

  findById: (id: string) =>
    db.select().from(diffs).where(eq(diffs.id, id)).limit(1),

  findByIssueId: (issueId: string) =>
    db.select().from(diffs).where(eq(diffs.issueId, issueId)),

  delete: (id: string) => db.delete(diffs).where(eq(diffs.id, id)).returning(),
};

export const submissionWithAnalysis = db
  .select({
    id: submissions.id,
    code: submissions.code,
    language: submissions.language,
    roastMode: submissions.roastMode,
    score: submissions.score,
    createdAt: submissions.createdAt,
    analysis: {
      id: analyses.id,
      roastSummary: analyses.roastSummary,
      createdAt: analyses.createdAt,
    },
  })
  .from(submissions)
  .leftJoin(analyses, eq(submissions.id, analyses.submissionId))
  .prepare("submission_with_analysis");

export const analysisWithIssues = db
  .select({
    id: analyses.id,
    submissionId: analyses.submissionId,
    roastSummary: analyses.roastSummary,
    createdAt: analyses.createdAt,
    issue: {
      id: issues.id,
      severity: issues.severity,
      issueType: issues.issueType,
      line: issues.line,
      column: issues.column,
      description: issues.description,
      roastComment: issues.roastComment,
      createdAt: issues.createdAt,
    },
  })
  .from(analyses)
  .leftJoin(issues, eq(analyses.id, issues.analysisId))
  .prepare("analysis_with_issues");

export const issueWithDiff = db
  .select({
    id: issues.id,
    analysisId: issues.analysisId,
    severity: issues.severity,
    issueType: issues.issueType,
    line: issues.line,
    column: issues.column,
    description: issues.description,
    roastComment: issues.roastComment,
    createdAt: issues.createdAt,
    diff: {
      id: diffs.id,
      originalCode: diffs.originalCode,
      fixedCode: diffs.fixedCode,
      explanation: diffs.explanation,
      createdAt: diffs.createdAt,
    },
  })
  .from(issues)
  .leftJoin(diffs, eq(issues.id, diffs.issueId))
  .prepare("issue_with_diff");

export const fullSubmissionData = (submissionId: string) =>
  db
    .select({
      submission: {
        id: submissions.id,
        code: submissions.code,
        language: submissions.language,
        roastMode: submissions.roastMode,
        score: submissions.score,
        createdAt: submissions.createdAt,
      },
      analysis: {
        id: analyses.id,
        roastSummary: analyses.roastSummary,
        createdAt: analyses.createdAt,
      },
      issue: {
        id: issues.id,
        severity: issues.severity,
        issueType: issues.issueType,
        line: issues.line,
        column: issues.column,
        description: issues.description,
        roastComment: issues.roastComment,
        createdAt: issues.createdAt,
      },
      diff: {
        id: diffs.id,
        originalCode: diffs.originalCode,
        fixedCode: diffs.fixedCode,
        explanation: diffs.explanation,
        createdAt: diffs.createdAt,
      },
    })
    .from(submissions)
    .leftJoin(analyses, eq(submissions.id, analyses.submissionId))
    .leftJoin(issues, eq(analyses.id, issues.analysisId))
    .leftJoin(diffs, eq(issues.id, diffs.issueId))
    .where(eq(submissions.id, submissionId))
    .prepare("full_submission_data");

export const leaderboard = (limit = 10) =>
  db
    .select({
      id: submissions.id,
      language: submissions.language,
      score: submissions.score,
      createdAt: submissions.createdAt,
    })
    .from(submissions)
    .where(sql`${submissions.score} IS NOT NULL`)
    .orderBy(desc(submissions.score))
    .limit(limit)
    .prepare("leaderboard");

export const globalStats = async () => {
  const totalSubmissions = await db
    .select({ count: count() })
    .from(submissions);

  const totalAnalyses = await db.select({ count: count() }).from(analyses);

  const issuesBySeverity = await db
    .select({
      severity: issues.severity,
      count: count(),
    })
    .from(issues)
    .groupBy(issues.severity);

  const issuesByType = await db
    .select({
      issueType: issues.issueType,
      count: count(),
    })
    .from(issues)
    .groupBy(issues.issueType);

  return {
    totalSubmissions: totalSubmissions[0]?.count ?? 0,
    totalAnalyses: totalAnalyses[0]?.count ?? 0,
    issuesBySeverity,
    issuesByType,
  };
};
