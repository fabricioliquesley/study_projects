CREATE TYPE "public"."finding_level" AS ENUM('critical', 'warning', 'good');--> statement-breakpoint
CREATE TYPE "public"."issue_type" AS ENUM('naming', 'performance', 'security', 'best_practice', 'syntax', 'style', 'error_handling', 'architecture', 'documentation', 'logic');--> statement-breakpoint
CREATE TYPE "public"."language" AS ENUM('javascript', 'typescript', 'python', 'java', 'csharp', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'sql', 'html', 'css');--> statement-breakpoint
CREATE TABLE "analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid,
	"roast_summary" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "analyses_submission_id_unique" UNIQUE("submission_id")
);
--> statement-breakpoint
CREATE TABLE "diffs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"issue_id" uuid,
	"original_code" text NOT NULL,
	"fixed_code" text NOT NULL,
	"explanation" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "issues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"analysis_id" uuid,
	"severity" "finding_level" NOT NULL,
	"issue_type" "issue_type" NOT NULL,
	"line" integer,
	"column" integer,
	"description" text NOT NULL,
	"roast_comment" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"language" "language" NOT NULL,
	"roast_mode" boolean DEFAULT false,
	"score" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "score_range" CHECK ("score" >= 0 AND "score" <= 10)
);
--> statement-breakpoint
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diffs" ADD CONSTRAINT "diffs_issue_id_issues_id_fk" FOREIGN KEY ("issue_id") REFERENCES "public"."issues"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_analysis_id_analyses_id_fk" FOREIGN KEY ("analysis_id") REFERENCES "public"."analyses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "analyses_submission_id_idx" ON "analyses" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX "diffs_issue_id_idx" ON "diffs" USING btree ("issue_id");--> statement-breakpoint
CREATE INDEX "issues_analysis_id_idx" ON "issues" USING btree ("analysis_id");