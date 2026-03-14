import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";

const leaderboardRow = tv({
  base: ["flex items-center border-b border-border-primary px-5 py-4"],
});

type LeaderboardRowProps = ComponentProps<"div">;

function LeaderboardRow({ className, ...props }: LeaderboardRowProps) {
  return <div className={leaderboardRow({ className })} {...props} />;
}

const rankCell = tv({
  base: ["flex w-10 items-center font-mono text-[13px] text-text-tertiary"],
});

type RankCellProps = ComponentProps<"span">;

function RankCell({ className, ...props }: RankCellProps) {
  return <span className={rankCell({ className })} {...props} />;
}

const scoreCell = tv({
  base: ["flex w-[60px] items-center font-mono text-[13px] font-bold"],
  variants: {
    variant: {
      good: "text-accent-green",
      warning: "text-accent-amber",
      critical: "text-accent-red",
    },
  },
  defaultVariants: {
    variant: "good",
  },
});

type ScoreCellVariants = Parameters<typeof scoreCell>[0];

type ScoreCellProps = ComponentProps<"span"> & ScoreCellVariants;

function ScoreCell({ variant, className, ...props }: ScoreCellProps) {
  return <span className={scoreCell({ variant, className })} {...props} />;
}

const codeCell = tv({
  base: [
    "flex flex-1 items-center font-mono text-xs text-text-secondary truncate",
  ],
});

type CodeCellProps = ComponentProps<"span">;

function CodeCell({ className, ...props }: CodeCellProps) {
  return <span className={codeCell({ className })} {...props} />;
}

const langCell = tv({
  base: ["flex w-[100px] items-center font-mono text-xs text-text-tertiary"],
});

type LangCellProps = ComponentProps<"span">;

function LangCell({ className, ...props }: LangCellProps) {
  return <span className={langCell({ className })} {...props} />;
}

export {
  LeaderboardRow,
  RankCell,
  ScoreCell,
  CodeCell,
  LangCell,
  leaderboardRow,
  type LeaderboardRowProps,
  type RankCellProps,
  type ScoreCellProps,
  type ScoreCellVariants,
  type CodeCellProps,
  type LangCellProps,
};
