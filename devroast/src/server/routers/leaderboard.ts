import { asc, sql } from "drizzle-orm";
import { submissions } from "@/db/schema";
import { publicProcedure, router } from "../trpc";

export const leaderboardRouter = router({
  getShameLeaderboard: publicProcedure.query(async ({ ctx }) => {
    const leaderboard = await ctx.db
      .select({
        id: submissions.id,
        score: submissions.score,
        language: submissions.language,
        code: submissions.code,
      })
      .from(submissions)
      .where(sql`${submissions.score} is not null`)
      .orderBy(asc(submissions.score))
      .limit(3);

    const totalRoastsResult = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(submissions);

    const totalRoasts = totalRoastsResult[0]?.count ?? 0;

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
});
