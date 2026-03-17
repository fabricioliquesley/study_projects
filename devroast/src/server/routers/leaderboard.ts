import { asc, sql } from "drizzle-orm";
import { submissions } from "@/db/schema";
import type { Context } from "@/server/context";
import { publicProcedure, router } from "../trpc";

async function fetchLeaderboardItems(ctx: Context, limit: number) {
  return await ctx.db
    .select({
      id: submissions.id,
      score: submissions.score,
      language: submissions.language,
      code: submissions.code,
    })
    .from(submissions)
    .where(sql`${submissions.score} is not null`)
    .orderBy(asc(submissions.score))
    .limit(limit);
}

async function fetchTotalRoasts(ctx: Context) {
  const result = await ctx.db
    .select({ count: sql<number>`count(*)` })
    .from(submissions);
  return result[0]?.count ?? 0;
}

async function fetchAvgScore(ctx: Context) {
  const result = await ctx.db
    .select({ avg: sql<number>`avg(${submissions.score})::float` })
    .from(submissions)
    .where(sql`${submissions.score} is not null`);
  return Number(result[0]?.avg ?? 0);
}

export const leaderboardRouter = router({
  getShameLeaderboard: publicProcedure.query(async ({ ctx }) => {
    const leaderboard = await fetchLeaderboardItems(ctx, 3);
    const totalRoasts = await fetchTotalRoasts(ctx);

    return {
      leaderboard: leaderboard.map((item) => ({
        id: item.id,
        rank: 0,
        score: item.score ?? 0,
        language: item.language,
        code: item.code,
      })),
      totalRoasts,
    };
  }),

  getLeaderboard: publicProcedure.query(async ({ ctx }) => {
    const leaderboard = await fetchLeaderboardItems(ctx, 20);
    const totalRoasts = await fetchTotalRoasts(ctx);
    const avgScore = await fetchAvgScore(ctx);

    return {
      leaderboard: leaderboard.map((item, index) => ({
        id: item.id,
        rank: index + 1,
        score: item.score ?? 0,
        language: item.language,
        code: item.code,
      })),
      totalRoasts,
      avgScore,
    };
  }),
});
