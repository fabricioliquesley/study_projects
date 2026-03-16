import { isNotNull, sql } from "drizzle-orm";
import { analyses, submissions } from "@/db/schema";
import { publicProcedure, router } from "../trpc";

export const statsRouter = router({
  getMetrics: publicProcedure.query(async ({ ctx }) => {
    const totalSubmissions = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(submissions);

    const avgScoreResult = await ctx.db
      .select({ avg: sql<number>`coalesce(avg(${submissions.score}), 0)` })
      .from(submissions)
      .where(isNotNull(submissions.score));

    const totalAnalyses = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(analyses);

    return {
      totalSubmissions: totalSubmissions[0]?.count ?? 0,
      avgScore: avgScoreResult[0]?.avg ?? 0,
      totalAnalyses: totalAnalyses[0]?.count ?? 0,
    };
  }),
});
