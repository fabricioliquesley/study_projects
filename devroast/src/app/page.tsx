import { Suspense } from "react";
import { CodeInputSection } from "@/components/code-input-section";
import { ShameLeaderboard } from "@/components/leaderboard/shame-leaderboard";
import { ShameLeaderboardSkeleton } from "@/components/leaderboard/shame-leaderboard-skeleton";
import { Stats } from "@/components/stats/stats";

export const revalidate = 3600;

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-[1440px] flex-col items-center gap-8 px-10 py-20">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="flex items-center gap-3 font-mono text-4xl font-bold">
          <span className="text-accent-green">$</span>
          <span className="text-text-primary">
            paste your code. get roasted.
          </span>
        </h1>
        <p className="font-mono text-sm text-text-secondary">
          {"//"} drop your code below and we&apos;ll rate it — brutally honest
          or full roast mode
        </p>
      </div>

      <CodeInputSection />

      <Stats />

      <div className="h-[60px]" />

      <Suspense fallback={<ShameLeaderboardSkeleton />}>
        <ShameLeaderboard />
      </Suspense>

      <div className="h-[60px]" />
    </main>
  );
}
