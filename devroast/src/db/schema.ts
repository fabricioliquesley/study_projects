import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const languageEnum = pgEnum("language", [
  "javascript",
  "typescript",
  "python",
  "java",
  "csharp",
  "go",
  "rust",
  "ruby",
  "php",
  "swift",
  "kotlin",
  "sql",
  "html",
  "css",
]);

export const findingLevelEnum = pgEnum("finding_level", [
  "critical",
  "warning",
  "good",
]);

export const issueTypeEnum = pgEnum("issue_type", [
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
]);

export const submissions = pgTable("submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull(),
  language: languageEnum("language").notNull(),
  roastMode: boolean("roast_mode").default(false),
  score: integer("score"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const analyses = pgTable(
  "analyses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    submissionId: uuid("submission_id")
      .references(() => submissions.id, { onDelete: "cascade" })
      .unique(),
    roastSummary: text("roast_summary"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    submissionIdIdx: index("analyses_submission_id_idx").on(t.submissionId),
  }),
);

export const issues = pgTable(
  "issues",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    analysisId: uuid("analysis_id").references(() => analyses.id, {
      onDelete: "cascade",
    }),
    severity: findingLevelEnum("severity").notNull(),
    issueType: issueTypeEnum("issue_type").notNull(),
    line: integer("line"),
    column: integer("column"),
    description: text("description").notNull(),
    roastComment: text("roast_comment"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    analysisIdIdx: index("issues_analysis_id_idx").on(t.analysisId),
  }),
);

export const diffs = pgTable(
  "diffs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    issueId: uuid("issue_id").references(() => issues.id, {
      onDelete: "cascade",
    }),
    originalCode: text("original_code").notNull(),
    fixedCode: text("fixed_code").notNull(),
    explanation: text("explanation"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    issueIdIdx: index("diffs_issue_id_idx").on(t.issueId),
  }),
);

export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
export type Analysis = typeof analyses.$inferSelect;
export type NewAnalysis = typeof analyses.$inferInsert;
export type Issue = typeof issues.$inferSelect;
export type NewIssue = typeof issues.$inferInsert;
export type Diff = typeof diffs.$inferSelect;
export type NewDiff = typeof diffs.$inferInsert;
