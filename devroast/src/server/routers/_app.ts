import { router } from "../trpc";
import { leaderboardRouter } from "./leaderboard";
import { statsRouter } from "./stats";
import { submissionRouter } from "./submission";

export const appRouter = router({
  leaderboard: leaderboardRouter,
  stats: statsRouter,
  submission: submissionRouter,
});

export type AppRouter = typeof appRouter;
