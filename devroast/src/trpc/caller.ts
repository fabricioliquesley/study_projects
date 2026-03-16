import "server-only";

import { createContext } from "@/server/context";
import { appRouter } from "@/server/routers/_app";
import { createCallerFactory } from "@/server/trpc";

const createCaller = createCallerFactory(appRouter);

export async function getStats() {
  const ctx = await createContext();
  const caller = createCaller(ctx);
  return caller.stats.getMetrics();
}
