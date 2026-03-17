import "server-only";

import { createContext } from "@/server/context";
import { appRouter } from "@/server/routers/_app";
import { createCallerFactory } from "@/server/trpc";
import { ShameLeaderboardUI } from "./shame-leaderboard-ui";

const createCaller = createCallerFactory(appRouter);

export async function ShameLeaderboard() {
  const ctx = await createContext();
  const caller = createCaller(ctx);
  const { leaderboard, totalRoasts } =
    await caller.leaderboard.getShameLeaderboard();

  return (
    <ShameLeaderboardUI leaderboard={leaderboard} totalRoasts={totalRoasts} />
  );
}
