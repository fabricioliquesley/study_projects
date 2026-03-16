import { router } from "../trpc";
import { statsRouter } from "./stats";

export const appRouter = router({
  stats: statsRouter,
});

export type AppRouter = typeof appRouter;
