import ImageResponse from "@takumi-rs/image-response";
import { RoastOgImage } from "@/components/og/roast-image";
import { createContext } from "@/server/context";
import { appRouter } from "@/server/routers/_app";
import { createCallerFactory } from "@/server/trpc";

const createCaller = createCallerFactory(appRouter);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const ctx = await createContext();
  const caller = createCaller(ctx);

  const result = await caller.submission.getById(id);

  if (!result || !result.submission) {
    return new Response("Not Found", { status: 404 });
  }

  const { submission, analysis, issues } = result;

  const score = submission.score ?? 0;
  const language = submission.language;
  const roastSummary = analysis?.roastSummary ?? "No analysis available.";

  const criticalCount = issues.filter((i) => i.severity === "critical").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;
  const goodCount = issues.filter((i) => i.severity === "good").length;

  return new ImageResponse(
    <RoastOgImage
      score={score}
      language={language}
      roastSummary={roastSummary}
      criticalCount={criticalCount}
      warningCount={warningCount}
      goodCount={goodCount}
    />,
    {
      width: 1200,
      height: 630,
      format: "webp",
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    },
  );
}
