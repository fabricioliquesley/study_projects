import { router } from "../trpc";
import { leaderboardRouter } from "./leaderboard";
import { statsRouter } from "./stats";

export const appRouter = router({
  leaderboard: leaderboardRouter,
  stats: statsRouter,
});

export type AppRouter = typeof appRouter;
