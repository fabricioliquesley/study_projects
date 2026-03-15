import { CodeBlock } from "@/components/ui/code-block";

const LEADERBOARD_DATA = [
  {
    rank: 1,
    score: 1.2,
    code: `eval(prompt("enter code"))
document.write(response)
// trust the user lol`,
    language: "javascript",
    lines: 3,
  },
  {
    rank: 2,
    score: 1.8,
    code: `if (x == true) { return true; }
else if (x == false) { return false; }
else { return !false; }`,
    language: "typescript",
    lines: 3,
  },
  {
    rank: 3,
    score: 2.1,
    code: `SELECT * FROM users WHERE 1=1
-- TODO: add authentication`,
    language: "sql",
    lines: 2,
  },
  {
    rank: 4,
    score: 2.3,
    code: `catch (e) {
// ignore
}`,
    language: "java",
    lines: 3,
  },
  {
    rank: 5,
    score: 2.5,
    code: `const sleep = (ms) =>
  new Date(Date.now() + ms)
while(new Date() < end) {}`,
    language: "javascript",
    lines: 3,
  },
] as const;

function LeaderboardEntry({
  entry,
}: {
  entry: (typeof LEADERBOARD_DATA)[number];
}) {
  return (
    <div className="flex flex-col border border-border-primary rounded-m overflow-hidden">
      <div className="flex h-12 items-center justify-between border-b border-border-primary px-5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[13px] text-text-tertiary">#</span>
            <span className="font-mono text-[13px] font-bold text-accent-amber">
              {entry.rank}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs text-text-tertiary">score:</span>
            <span className="font-mono text-[13px] font-bold text-accent-red">
              {entry.score}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-text-secondary">
            {entry.language}
          </span>
          <span className="font-mono text-xs text-text-tertiary">
            {entry.lines} lines
          </span>
        </div>
      </div>
      <CodeBlock
        code={entry.code}
        language={entry.language}
        showHeader={false}
        height={120}
      />
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <main className="w-full max-w-[1440px] mx-auto px-[80px] py-10 flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[32px] font-bold text-accent-green">
            &gt;
          </span>
          <h1 className="font-mono text-[28px] font-bold text-text-primary">
            shame_leaderboard
          </h1>
        </div>
        <p className="font-mono text-sm text-text-secondary">
          {`// the most roasted code on the internet`}
        </p>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-text-tertiary">
            2,847 submissions
          </span>
          <span className="text-text-tertiary">·</span>
          <span className="font-mono text-xs text-text-tertiary">
            avg score: 4.2/10
          </span>
        </div>
      </section>

      <section className="flex flex-col gap-5">
        {LEADERBOARD_DATA.map((entry) => (
          <LeaderboardEntry key={entry.rank} entry={entry} />
        ))}
      </section>
    </main>
  );
}
