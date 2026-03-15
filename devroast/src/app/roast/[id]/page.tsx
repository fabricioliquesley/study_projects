import {
  AnalysisCardBadge,
  AnalysisCardDescription,
  AnalysisCardRoot,
  AnalysisCardTitle,
} from "@/components/ui/analysis-card";
import type { BadgeVariants } from "@/components/ui/badge";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";
import { ScoreRing } from "@/components/ui/score-ring";

const STATIC_CODE = `function calculateTotal(items) {
  let total = 0;
  for (var i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`;

const STATIC_ISSUES = [
  {
    id: 1,
    type: "critical" as const,
    title: "Using var instead of const/let",
    description:
      "The var keyword has function scope and is hoisted, which can lead to subtle bugs. Use const for values that won't be reassigned, or let for mutable bindings.",
    line: 3,
  },
  {
    id: 2,
    type: "warning" as const,
    title: "Missing error handling",
    description:
      "No validation for null or undefined items in the array. This could throw a TypeError if items contains falsy values.",
    line: 4,
  },
  {
    id: 3,
    type: "info" as const,
    title: "Consider using reduce",
    description:
      "The array reduce method would be more idiomatic and declarative for calculating sums.",
    line: 2,
  },
] as const;

const STATIC_DIFF_LINES = [
  { type: "unchanged" as const, content: "function calculateTotal(items) {" },
  { type: "unchanged" as const, content: "  let total = 0;" },
  {
    type: "removed" as const,
    content: "  for (var i = 0; i < items.length; i++) {",
  },
  { type: "added" as const, content: "  for (const item of items) {" },
  { type: "removed" as const, content: "    total += items[i].price;" },
  { type: "added" as const, content: "    total += item.price;" },
  { type: "unchanged" as const, content: "  }" },
  { type: "unchanged" as const, content: "  return total;" },
  { type: "unchanged" as const, content: "}" },
];

export default function RoastResultPage() {
  return (
    <main className="mx-auto flex max-w-[1440px] flex-col gap-10 px-10 py-10">
      <section className="flex items-center gap-12">
        <ScoreRing score={4.2} total={10} />
        <div className="flex flex-col gap-4">
          <h1 className="font-mono text-2xl font-bold text-text-primary">
            Roast Summary
          </h1>
          <p className="font-mono text-sm text-text-secondary max-w-md">
            This code has been analyzed and found worthy of public shaming.
            Several issues were detected, ranging from critical to
            informational.
          </p>
          <div className="flex items-center gap-3">
            <Badge variant="critical">1 Critical</Badge>
            <Badge variant="warning">1 Warning</Badge>
            <Badge variant="good">1 Info</Badge>
          </div>
        </div>
      </section>

      <div className="h-px w-full bg-border-primary" />

      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-accent-green">
            {"//"}
          </span>
          <span className="font-mono text-sm font-bold text-text-primary">
            submitted_code
          </span>
        </div>
        <div className="rounded border border-border-primary">
          <CodeBlock
            code={STATIC_CODE}
            language="javascript"
            showHeader={false}
          />
        </div>
      </section>

      <div className="h-px w-full bg-border-primary" />

      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-accent-green">
            {"//"}
          </span>
          <span className="font-mono text-sm font-bold text-text-primary">
            issues_found
          </span>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {STATIC_ISSUES.map((issue) => (
            <AnalysisCardRoot key={issue.id}>
              <div className="flex items-center justify-between">
                <AnalysisCardBadge
                  variant={issue.type as BadgeVariants["variant"]}
                >
                  {issue.type}
                </AnalysisCardBadge>
                <span className="font-mono text-xs text-text-tertiary">
                  line {issue.line}
                </span>
              </div>
              <AnalysisCardTitle>{issue.title}</AnalysisCardTitle>
              <AnalysisCardDescription>
                {issue.description}
              </AnalysisCardDescription>
            </AnalysisCardRoot>
          ))}
        </div>
      </section>

      <div className="h-px w-full bg-border-primary" />

      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-accent-green">
            {"//"}
          </span>
          <span className="font-mono text-sm font-bold text-text-primary">
            suggested_fix
          </span>
        </div>
        <div className="rounded border border-border-primary">
          <CodeBlock
            diffLines={STATIC_DIFF_LINES}
            language="javascript"
            showHeader={false}
          />
        </div>
      </section>
    </main>
  );
}
